import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { ethers } from "ethers"
import type { Campaign } from "@/types/Campaign"
import type { VotingRestriction, ResultType } from "@/types/VotingTypes"
import { contractAddress } from "@/lib/constants"
import abi from "@/abi"
import type { RootState } from "../../store"

interface ContractState {
  contract: ethers.Contract | null
  campaigns: Campaign[]
  proposals: { [key: number]: { content: string; voteCount: number }[] }
  paused: boolean
  isFetchingCampaigns: boolean
  isRegisteringVoter: boolean
  isCastingVote: boolean
  isCreatingCampaign: boolean  
  error: string | null
  signerAddress: string | null // Add signerAddress to the state
  currentCampaign: {
    data:
      | (Campaign & {
          proposals: { content: string; voteCount: number }[]
          totalVotes: number
          registeredVoterCount: number
          isVotingOpen: boolean
          hasVoted: boolean
        })
      | null
    isLoading: boolean
    error: string | null
  }
}

const initialState: ContractState = {
  contract: null,
  campaigns: [],
  proposals: {},
  paused: true,
  isFetchingCampaigns: false,
  isRegisteringVoter: false,
  isCastingVote: false,
  isCreatingCampaign: false,
  error: null,
  signerAddress: null, // Initialize signerAddress
  currentCampaign: {
    data: null,
    isLoading: false,
    error: null,
  },
}

// Async thunk to load the contract and signer address
export const loadContractAndSigner = createAsyncThunk(
  "polytix/loadContractAndSigner",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("Ethereum provider not available")
      }
      const provider = new ethers.BrowserProvider(window.ethereum)

      // Request accounts *before* getting the signer
      await window.ethereum.request({ method: "eth_requestAccounts" })

      const signer = await provider.getSigner()
      const signerAddress = await signer.getAddress()
      const contract = new ethers.Contract(contractAddress, abi, signer)

      return { contract, signerAddress }
    } catch (error: any) {
      // Cast error to 'any' to access 'message' property
      console.error("Failed to load contract:", error)
      return rejectWithValue(error.message || "Failed to load contract.") // Provide a default message
    }
  },
)

export const fetchCampaigns = createAsyncThunk("polytix/fetchCampaigns", async (_, { rejectWithValue, getState }) => {
  try {
    const { polytix } = getState() as { polytix: ContractState }
    if (!polytix.contract) throw new Error("Contract not loaded")

    const campaignCount = await polytix.contract.campaignCount()
    const campaigns: Campaign[] = []
    console.log(campaignCount)

    for (let i = 1; i <= campaignCount; i++) {
      const campaign = await polytix.contract.campaignMetadata(i)
      console.log("CLG", campaign.description)
      campaigns.push({
        id: i,
        votingType: campaign.votingType,
        restriction: campaign.restriction,
        resultType: campaign.resultType,
        creator: campaign.creator,
        description: campaign.description,
        status: campaign.status,
        startTime: Number(campaign.timeFrame.startTime),
        endTime: Number(campaign.timeFrame.endTime),
        maxVoters: Number(campaign.maxVoters),
      })
    }
    console.log("CAMPAIGNS", campaigns)
    return campaigns
  } catch (error: any) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unknown error occurred")
  }
})

export const getCampaignById = createAsyncThunk(
  "polytix/getCampaignById",
  async (campaignId: number, { rejectWithValue, getState, dispatch }) => {
    try {
      const { polytix } = getState() as { polytix: ContractState }
      if (!polytix.contract) throw new Error("Contract not loaded")

      // Fetch campaign metadata and proposals in parallel
      const [metadata, proposals] = await Promise.all([
        polytix.contract.campaignMetadata(campaignId),
        polytix.contract.getProposals(campaignId),
      ])

      // Get additional campaign data
      const data = {
        totalVotes: await polytix.contract.campaignData(campaignId).totalVotes(),
        registeredVoterCount: await polytix.contract.campaignData(campaignId).registeredVoterCount(),
        isVotingOpen: await polytix.contract.isVotingOpen(campaignId),
      }

      // Check if current user has voted if they're connected
      let hasVoted = false
      if (polytix.signerAddress) {
        hasVoted = await polytix.contract.campaignData(campaignId).hasVoted(polytix.signerAddress)
      }

      // Format the campaign details
      const campaign = {
        id: campaignId,
        votingType: Number(metadata.votingType),
        restriction: Number(metadata.restriction),
        resultType: Number(metadata.resultType),
        creator: metadata.creator,
        description: metadata.description,
        status: Number(metadata.status),
        timeFrame: {
          startTime: Number(metadata.timeFrame.startTime),
          endTime: Number(metadata.timeFrame.endTime),
        },
        maxVoters: Number(metadata.maxVoters),
        proposals: proposals.map((p: any) => ({
          content: p.content,
          voteCount: Number(p.voteCount),
        })),
        totalVotes: Number(data.totalVotes),
        registeredVoterCount: Number(data.registeredVoterCount),
        isVotingOpen: data.isVotingOpen,
        hasVoted,
      }

      return campaign
    } catch (error: any) {
      console.error("Error fetching campaign:", error)
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to fetch campaign details")
    }
  },
)

export const createCampaign = createAsyncThunk(
  "polytix/createCampaign",
  async (
    {
      description,
      restriction,
      resultType,
      startTime,
      endTime,
      maxVoters,
      proposals,
    }: {
      description: string
      restriction: VotingRestriction
      resultType: ResultType
      startTime: number
      endTime: number
      maxVoters: number
      proposals: string[]
    },
    { rejectWithValue, getState },
  ) => {
    try {
      const { polytix } = getState() as { polytix: ContractState }
      if (!polytix.contract) throw new Error("Contract not loaded")

      const tx = await polytix.contract.createProposalBasedCampaign(
        description,
        restriction,
        resultType,
        startTime,
        endTime,
        maxVoters,
        proposals,
      )
      await tx.wait()

      return true
    } catch (error: any) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  },
)

export const registerToVote = createAsyncThunk(
  "polytix/registerToVote",
  async (campaignId: number, { rejectWithValue, getState }) => {
    try {
      const { polytix } = getState() as { polytix: ContractState }
      if (!polytix.contract) throw new Error("Contract not loaded")

      const tx = await polytix.contract.registerToVote(campaignId)
      await tx.wait()

      return campaignId
    } catch (error: any) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  },
)

export const voteForProposal = createAsyncThunk(
  "polytix/voteForProposal",
  async ({ campaignId, proposalId }: { campaignId: number; proposalId: number }, { rejectWithValue, getState }) => {
    try {
      const { polytix } = getState() as { polytix: ContractState }
      if (!polytix.contract) throw new Error("Contract not loaded")

      const tx = await polytix.contract.voteForProposal(campaignId, proposalId)
      await tx.wait()

      return { campaignId, proposalId }
    } catch (error: any) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  },
)

export const fetchProposals = createAsyncThunk(
  "polytix/fetchProposals",
  async (campaignId: number, { rejectWithValue, getState }) => {
    try {
      const { polytix } = getState() as { polytix: ContractState }
      if (!polytix.contract) throw new Error("Contract not loaded")

      const proposals = await polytix.contract.getProposals(campaignId)
      return { campaignId, proposals }
    } catch (error: any) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  },
)

const polytixSlice = createSlice({
  name: "polytix",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load contract and signer
      .addCase(
        loadContractAndSigner.fulfilled,
        (state, action: PayloadAction<{ contract: ethers.Contract; signerAddress: string }>) => {
          state.contract = action.payload.contract
          state.signerAddress = action.payload.signerAddress
          state.error = null
        },
      )
      .addCase(loadContractAndSigner.rejected, (state, action) => {
        state.contract = null
        state.signerAddress = null
        state.error = action.payload as string
      })

      // Campaigns
      .addCase(fetchCampaigns.pending, (state) => {
        state.isFetchingCampaigns = true
        state.error = null
      })
      .addCase(fetchCampaigns.fulfilled, (state, action: PayloadAction<Campaign[]>) => {
        state.isFetchingCampaigns = false
        state.campaigns = action.payload
        console.log("ACTION PAYLOAD", state.campaigns)
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isFetchingCampaigns = false
        state.error = action.payload as string
      })

      //Create Campaign
      .addCase(createCampaign.pending, (state) => {
        state.isCreatingCampaign = true
        state.error = null
      })
      .addCase(createCampaign.fulfilled, (state) => {
        state.isCreatingCampaign = false
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isCreatingCampaign = false
        state.error = action.payload as string
      })

      //Register to Vote
      .addCase(registerToVote.pending, (state) => {
        state.isRegisteringVoter = true
        state.error = null
      })
      .addCase(registerToVote.fulfilled, (state) => {
        state.isRegisteringVoter = false
      })
      .addCase(registerToVote.rejected, (state, action) => {
        state.isRegisteringVoter = false
        state.error = action.payload as string
      })

      //Vote for Proposal
      .addCase(voteForProposal.pending, (state) => {
        state.isCastingVote = true
        state.error = null
      })
      .addCase(voteForProposal.fulfilled, (state) => {
        state.isCastingVote = false
      })
      .addCase(voteForProposal.rejected, (state, action) => {
        state.isCastingVote = false
        state.error = action.payload as string
      })

      //Fetch Proposals
      .addCase(
        fetchProposals.fulfilled,
        (
          state,
          action: PayloadAction<{
            campaignId: number
            proposals: { content: string; voteCount: number }[]
          }>,
        ) => {
          state.proposals[action.payload.campaignId] = action.payload.proposals
        },
      )
      .addCase(fetchProposals.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(getCampaignById.pending, (state) => {
        state.currentCampaign.isLoading = true
        state.currentCampaign.error = null
      })
      .addCase(getCampaignById.fulfilled, (state, action) => {
        state.currentCampaign.isLoading = false
        state.currentCampaign.data = action.payload
        state.currentCampaign.error = null
      })
      .addCase(getCampaignById.rejected, (state, action) => {
        state.currentCampaign.isLoading = false
        state.currentCampaign.data = null
        state.currentCampaign.error = action.payload as string
      })
  },
})

export const selectContract = (state: RootState) => state.polytix

export default polytixSlice.reducer

