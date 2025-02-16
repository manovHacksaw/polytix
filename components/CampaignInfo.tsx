"use client"

import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Lock, Loader2, Vote } from "lucide-react"
import { toast } from "sonner"
import abi from "@/abi"
import { contractAddress } from "@/lib/constants"
import type { Campaign } from "@/types/Campaign"
import { useWalletConnection } from "@/hooks/useWallet"
import { CampaignData } from "./CampaignData"
import { CampaignSkeleton } from "./CampaignSkeleton"
import { ProposalsList } from "./ProposalsList"
import CampaignAnalytics from "./CampaignAnalytics"
import { VotingRestriction } from "@/types/VotingTypes"

interface CampaignInfoProps {
  id: string
}

export default function CampaignInfo({ id }: CampaignInfoProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [isVotingOpen, setIsVotingOpen] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationKey, setRegistrationKey] = useState("")
  const [isRegistrationKeyDialogOpen, setIsRegistrationKeyDialogOpen] = useState(false)
  const { address } = useWalletConnection()
  const [totalVotes, setTotalVotes] = useState(0);


  const fetchCampaignData = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed.")
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)

      // Fetch campaign metadata
      const campaignData = await contract.campaignMetadata(id)
      const proposalsData = await contract.getProposals(id)
      const votingOpen = await contract.isVotingOpen(id)

      // Fetch user-specific data if address is available
      let isRegisteredToVote = false
      let hasUserVoted = false

      if (address) {
        isRegisteredToVote = await contract.getRegistrationDetails(id, address)
        hasUserVoted = await contract.checkHasVoted(id, address)
      }

        const fetchedCampaign: Campaign = {
            id: Number(id),
            description: campaignData.description,
            creator: campaignData.creator,
            startTime: Number(campaignData.timeFrame.startTime),
            endTime: Number(campaignData.timeFrame.endTime),
            votingType: Number(campaignData.votingType),
            restriction: Number(campaignData.restriction),
            resultType: Number(campaignData.resultType),
            status: Number(campaignData.status),
            maxVoters: Number(campaignData.maxVoters),
        };

      setCampaign(fetchedCampaign)
      setProposals(proposalsData)
      setIsVotingOpen(votingOpen)


            setIsRegistered(
                fetchedCampaign.restriction === VotingRestriction.OpenToAll || isRegisteredToVote
            ); // Set isRegistered to true if "Open to All"
            setHasVoted(hasUserVoted);


      // Calculate total votes
      let total = 0;
      proposalsData.forEach((proposal) => {
        total += Number(proposal.voteCount);
      });
      setTotalVotes(total);

    } catch (err) {
      console.error(err)
      setError("Failed to fetch campaign details.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaignData()
  }, [address])

  const hasEnded = (endTime: number): boolean => {
    const now = Math.floor(Date.now() / 1000)
    return now > endTime
  }

  const handleRegister = () => {
    if (!campaign) return
    setIsRegistrationKeyDialogOpen(true)
  }

  const handleRegisterWithKey = async () => {
    if (!campaign) return

    try {
      setIsRegistering(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)

      // Convert registration key to bytes32
      const registrationKeyBytes32 = ethers.keccak256(ethers.toUtf8Bytes(registrationKey))

      const tx = await contract.registerToVote(campaign.id, registrationKeyBytes32)
      await tx.wait()

      toast.success("Successfully registered to vote!")
      setIsRegistered(true)
      setIsRegistrationKeyDialogOpen(false)
      fetchCampaignData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to register")
    } finally {
      setIsRegistering(false)
    }
  }

  const getCampaignStateMessage = () => {
    if (!campaign) return null

    if (hasEnded(campaign.endTime)) {
      return {
        title: "Campaign Ended",
        description: hasVoted
          ? `Thank you for participating! We hope your choice wins. Results are now available below.`
          : "This campaign has ended. You can view the results below.",
        variant: "default" as const,
        icon: CheckCircle2,
      }
    }

    if (campaign.restriction !== VotingRestriction.OpenToAll && !isRegistered && !isVotingOpen) {
      return {
        title: "Registration Required",
        description:
          "You need to register to participate in this campaign. Please register below.",
        variant: "warning" as const,
        icon: AlertTriangle,
      }
    }

    if (isVotingOpen && campaign.restriction !== VotingRestriction.OpenToAll && !isRegistered) {
      return {
        title: "Registration Required",
        description:
          "This campaign is restricted to registered voters. Registration is now closed.",
        variant: "warning" as const,
        icon: AlertTriangle,
      }
    }

    if (isRegistered && !isVotingOpen) {
      return {
        title: "Registered Successfully",
        description: "You're all set! Please wait for the campaign to start. We'll notify you when voting begins.",
        variant: "success" as const,
        icon: Clock,
      }
    }

    if (hasVoted) {
      return {
        title: "Vote Cast Successfully",
        description:
          "Thank you for participating! Your vote has been recorded. Results will be available when the campaign ends.",
        variant: "success" as const,
        icon: CheckCircle2,
      }
    }

    if (isVotingOpen && isRegistered && !hasVoted) {
        if (totalVotes >= campaign.maxVoters) {
            return {
                title: "Voting Closed",
                description: "The maximum number of votes has been reached for this campaign.",
                variant: "warning" as const,
                icon: AlertCircle,
            };
        }
        return {
            title: "Voting is Open",
            description: "You can now cast your vote. Choose your preferred proposal below.",
            variant: "default" as const,
            icon: Vote,
        };
    }
    if (isVotingOpen && campaign.restriction === VotingRestriction.OpenToAll && !hasVoted) { //If not requires registration and opened then Vote
        if (totalVotes >= campaign.maxVoters) {
            return {
                title: "Voting Closed",
                description: "The maximum number of votes has been reached for this campaign.",
                variant: "warning" as const,
                icon: AlertCircle,
            };
        }
        return {
            title: "Voting is Open",
            description: "This campaign is open to all. Choose your preferred proposal below.",
            variant: "default" as const,
            icon: Vote,
        };
    }
    return null
  }

  if (isLoading) {
    return <CampaignSkeleton />
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center bg-destructive/10 rounded-lg" role="alert">
        <div className="flex flex-col items-center gap-4 text-destructive">
          <AlertCircle className="h-10 w-10" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex min-h-[200px] items-center justify-center bg-yellow-50 rounded-lg">
        <p className="text-lg text-yellow-700">Campaign not found</p>
      </div>
    )
  }

  const campaignStateMessage = getCampaignStateMessage()

  return (
    <div className="space-y-8">
      <CampaignData campaign={campaign} />

      {campaignStateMessage && (
        <Alert variant={campaignStateMessage.variant}>
          {campaignStateMessage.icon && <campaignStateMessage.icon className="h-4 w-4" />}
          <AlertTitle>{campaignStateMessage.title}</AlertTitle>
          <AlertDescription>{campaignStateMessage.description}</AlertDescription>
        </Alert>
      )}

      <ProposalsList
        campaignId={id}
        proposals={proposals}
        isVotingOpen={isVotingOpen && totalVotes < campaign.maxVoters} // Pass updated condition to ProposalsList
        isRegistered={isRegistered}
        hasVoted={hasVoted}
        onVoteSuccess={fetchCampaignData}
      />

      {hasEnded(campaign.endTime) && <CampaignAnalytics campaign={campaign} proposals={proposals} />}

      {/* Conditionally render registration button */}
       {campaign.restriction !== VotingRestriction.OpenToAll && !isRegistered && !isVotingOpen && campaign.status === 0 && (
                <Card className="bg-primary/5 border-2 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold">Registration Required</h3>
                                <p className="text-sm text-muted-foreground">
                                    You need to register before you can participate in this campaign.
                                </p>
                            </div>
                            <Button onClick={handleRegister} disabled={isRegistering} variant="secondary">
                                {isRegistering ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Register Now
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

      <Dialog open={isRegistrationKeyDialogOpen} onOpenChange={setIsRegistrationKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Registration Key</DialogTitle>
            <DialogDescription>
              This campaign requires a registration key. Please enter the key you received. Do not share this key with
              anyone.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="registrationKey">Registration Key</Label>
              <Input
                id="registrationKey"
                value={registrationKey}
                onChange={(e) => setRegistrationKey(e.target.value)}
                type="password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsRegistrationKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRegisterWithKey} disabled={isRegistering}>
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Submit Key & Register"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}