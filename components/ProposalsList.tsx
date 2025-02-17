"use client"

  import { useState } from "react"
  import { motion, AnimatePresence } from "framer-motion"
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
  import { Progress } from "@/components/ui/progress"
  import { cn } from "@/lib/utils"
  import { CheckCircle2, Loader2, Vote, AlertTriangle, ChevronRight } from "lucide-react"
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
  
    const totalVotes = proposals.reduce((sum, proposal) => sum + Number(proposal.voteCount), 0)
  
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
  
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut",
          staggerChildren: 0.1
        }
      }
    }
  
    const itemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut"
        }
      }
    }
  
    return (
      <>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Card className="border-2 border-muted backdrop-blur-sm bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Proposals
              </CardTitle>
              {totalVotes > 0 && (
                <div className="text-sm text-muted-foreground">
                  Total Votes: {totalVotes}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {proposals.length > 0 ? (
                <div className="grid gap-4">
                  {proposals.map((proposal, index) => {
                    const votePercentage = totalVotes > 0 
                      ? (Number(proposal.voteCount) / totalVotes) * 100 
                      : 0
  
                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className={cn(
                          "group relative border rounded-xl p-5 transition-all duration-200",
                          hasVoted 
                            ? "bg-muted/50 border-border" 
                            : "hover:border-primary/40 hover:shadow-md border-border",
                        )}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {proposal.content}
                            </h3>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Votes: {Number(proposal.voteCount)}</span>
                                <span>{votePercentage.toFixed(1)}%</span>
                              </div>
                              <Progress value={votePercentage} className="h-1.5" />
                            </div>
                          </div>
                          {isVotingOpen && isRegistered && !hasVoted && (
                            <Button
                              onClick={() => {
                                setSelectedProposal(index)
                                setIsVoteDialogOpen(true)
                              }}
                              variant="outline"
                              className="md:w-auto w-full group-hover:border-primary/40 group-hover:bg-primary/5"
                            >
                              <Vote className="mr-2 h-4 w-4 text-primary" />
                              Vote
                              <ChevronRight className="ml-2 h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-12 text-muted-foreground"
                >
                  <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No proposals available for this campaign.</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
  
        <Dialog open={isVoteDialogOpen} onOpenChange={setIsVoteDialogOpen}>
          <DialogContent className="bg-background/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Confirm Your Vote</DialogTitle>
              <DialogDescription>
                Please review your selection carefully. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
  
            <div className="space-y-4 mt-4">
              {selectedProposal !== null && proposals[selectedProposal] && (
                <div className="p-5 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Selected Proposal:</h4>
                      <p className="text-muted-foreground">{proposals[selectedProposal].content}</p>
                    </div>
                  </div>
                </div>
              )}
  
              <DialogFooter>
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsVoteDialogOpen(false)}
                    className="border-border hover:bg-muted/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => selectedProposal !== null && handleVote(selectedProposal)}
                    disabled={isVoting || selectedProposal === null}
                    className="min-w-[120px]"
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