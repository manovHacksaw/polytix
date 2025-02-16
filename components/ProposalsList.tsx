"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { CheckCircle2, Loader2, Vote } from "lucide-react"
import { toast } from "sonner"
import { ethers } from "ethers"
import { contractAddress } from "@/lib/constants"
import abi from "@/abi"

interface ProposalsListProps {
  campaignId: string
  proposals: Array<{ content: string; voteCount: number }>
  isVotingOpen: boolean
  isRegistered: boolean
  hasVoted: boolean
  onVoteSuccess: () => void
}

export function ProposalsList({
  campaignId,
  proposals,
  isVotingOpen,
  isRegistered,
  hasVoted,
  onVoteSuccess,
}: ProposalsListProps) {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null)
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (proposalId: number) => {
    try {
      setIsVoting(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)

      const tx = await contract.voteForProposal(campaignId, proposalId)
      await tx.wait()

      toast.success("Vote cast successfully!")
      setIsVoteDialogOpen(false)
      onVoteSuccess()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to cast vote")
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <>
      <Card className="border-2 border-muted">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-700">Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          {proposals.length > 0 ? (
            <div className="grid gap-4">
              {proposals.map((proposal, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between border rounded-lg p-4 transition-colors",
                    hasVoted ? "bg-gray-100 border-gray-300" : "border-gray-200 hover:border-gray-400",
                  )}
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{proposal.content}</h3>
                    <p className="text-sm text-gray-500 mt-1">Votes: {Number(proposal.voteCount)}</p>
                  </div>
                  {isVotingOpen && isRegistered && !hasVoted && (
                    <Button
                      onClick={() => {
                        setSelectedProposal(index)
                        setIsVoteDialogOpen(true)
                      }}
                      variant="outline"
                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300"
                    >
                      <Vote className="mr-2 h-4 w-4 text-gray-500" />
                      Vote
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No proposals available for this campaign.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isVoteDialogOpen} onOpenChange={setIsVoteDialogOpen}>
        <DialogContent className="bg-white text-gray-800">
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              Are you sure you want to vote for this proposal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedProposal !== null && proposals[selectedProposal] && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium">Selected Proposal:</h4>
                <p className="mt-1 text-gray-600">{proposals[selectedProposal].content}</p>
              </div>
            )}

            <DialogFooter>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsVoteDialogOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  Cancel
                </Button>
                <Button
                  onClick={() => selectedProposal !== null && handleVote(selectedProposal)}
                  disabled={isVoting || selectedProposal === null}
                >
                  {isVoting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Voting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirm Vote
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}