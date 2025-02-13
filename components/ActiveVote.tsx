// components/ActiveVote.tsx
"use client";

import {  useState, useCallback } from "react"
import { ethers } from "ethers"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { toast } from "sonner"
import abi from "@/abi"
import type { Campaign } from "@/types/Campaign"

import VotingOptions from "@/components/VotingOptions"
import VoteSubmissionButton from "@/components/VoteSubmissionButton"

const contractAddress = "0x5fD6f6d28892F137215Ca8b5d4640E5F2Cc2aAf2"

interface Proposal {
    content: string
    voteCount: number
}

interface ActiveVoteProps {
    campaign: Campaign;
    proposals: Proposal[];
    votingTypeInfo: { type: string; badgeColor: string };
    isVotingEnded: boolean;
    timeRemaining: string;
    id: string;
}

export default function ActiveVote({
    campaign,
    proposals,
    votingTypeInfo,
    isVotingEnded,
    timeRemaining,
    id
}: ActiveVoteProps){
    const [selectedOption, setSelectedOption] = useState<string>("")
    const [voting, setVoting] = useState(false)

      // Memoize contract instance creation
    const getContract = useCallback(async (withSigner = false) => {
        if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this feature")
        }

        const provider = new ethers.BrowserProvider(window.ethereum)
        if (withSigner) {
            const signer = await provider.getSigner()
            return new ethers.Contract(contractAddress, abi, signer)
        }
        return new ethers.Contract(contractAddress, abi, provider)
    }, [])

      const handleVote = async () => {
        if (!selectedOption) return

        try {
        setVoting(true)
        const contract = await getContract(true)

        const tx = await contract.voteForProposal(id, selectedOption)
        toast.promise(tx.wait(), {
            loading: 'Submitting vote...',
            success: 'Vote submitted successfully!',
            error: 'Failed to submit vote'
        })

        await tx.wait()
        } catch (err) {
            console.error("Error voting:", err)
            if (err instanceof Error) {
                toast.error(err.message)
            } else {
                toast.error("Failed to submit vote. Please try again.")
            }
        } finally {
            setVoting(false)
        }
    }

    return(
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Cast Your Vote</CardTitle>
                <CardDescription>
                    {isVotingEnded
                        ? "Voting has ended for this campaign"
                        : "Select one option below to cast your vote"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <VotingOptions
                    proposals={proposals}
                    selectedOption={selectedOption}
                    onValueChange={setSelectedOption}
                    disabled={isVotingEnded}
                />

                <VoteSubmissionButton
                    isVoting={voting}
                    isVotingEnded={isVotingEnded}
                    disabled={!selectedOption || voting || isVotingEnded}
                    onClick={handleVote}
                />
            </CardContent>
        </Card>
    )
}