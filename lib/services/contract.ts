import { ethers } from "ethers"
import abi from "@/abi"
import type { Campaign, Proposal } from "@/types/contract"

const CONTRACT_ADDRESS = "0x62884C5842349d367d7235bBb858172A0758d408"

export class ContractService {
  private contract: ethers.Contract
  private provider: ethers.BrowserProvider

  constructor() {
    if (typeof window !== "undefined" && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, abi, this.provider)
    }
  }

  async getCampaign(id: number): Promise<Campaign> {
    const metadata = await this.contract.campaignMetadata(id)
    const proposals = await this.contract.getProposals(id)
    const signer = await this.provider.getSigner()
    const address = await signer.getAddress()

    const campaign: Campaign = {
      id,
      ...metadata,
      proposals,
      totalVotes: await this.contract.campaignData(id).totalVotes,
      hasVoted: await this.contract.campaignData(id).hasVoted(address),
      isRegistered: await this.contract.campaignData(id).isRegistered(address),
      proposalCount: proposals.length,
    }

    return campaign
  }

  async voteForProposal(campaignId: number, proposalId: number): Promise<void> {
    const signer = await this.provider.getSigner()
    const contractWithSigner = this.contract.connect(signer)
    const tx = await contractWithSigner.voteForProposal(campaignId, proposalId)
    await tx.wait()
  }

  async registerToVote(campaignId: number): Promise<void> {
    const signer = await this.provider.getSigner()
    const contractWithSigner = this.contract.connect(signer)
    const tx = await contractWithSigner.registerToVote(campaignId)
    await tx.wait()
  }

  async isVotingOpen(campaignId: number): Promise<boolean> {
    return await this.contract.isVotingOpen(campaignId)
  }
}

export const contractService = new ContractService()

