"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ethers } from "ethers"
import abi from "@/abi"

const contractAddress = "0x5fD6f6d28892F137215Ca8b5d4640E5F2Cc2aAf2"

interface Proposal {
  content: string
  voteCount: string
}

interface VoteSectionProps {
  id: string
  proposals: Proposal[]
}

export function VoteSection({ id, proposals }: VoteSectionProps) {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleVote() {
    if (selectedProposal === null) return

    setIsVoting(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to vote")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)

      const tx = await contract.vote(id, selectedProposal)
      await tx.wait()

      // Refresh the page to show updated vote counts
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Failed to submit vote")
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="grid gap-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {proposals.map((proposal, index) => (
          <Card 
            key={index}
            className={`cursor-pointer transition-colors ${
              selectedProposal === index ? "border-primary" : ""
            }`}
            onClick={() => setSelectedProposal(index)}
          >
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="font-medium">{proposal.content}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {proposal.voteCount} votes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 flex-1 rounded-full bg-secondary ${
                  selectedProposal === index ? "bg-primary/20" : ""
                }`}>
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(Number(proposal.voteCount) / proposals.reduce(
                        (acc, curr) => acc + Number(curr.voteCount),
                        0
                      )) * 100}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleVote}
          disabled={selectedProposal === null || isVoting}
        >
          {isVoting ? "Submitting Vote..." : "Submit Vote"}
        </Button>
      </div>
    </div>
  )
}