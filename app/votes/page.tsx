

import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Clock, Users } from 'lucide-react'
import Link from "next/link"
import abi from "@/abi"
import type { Campaign } from "@/types/Campaign"
import CampaignDetails from "@/components/CampaignDetails"

import ActiveVote from "@/components/ActiveVote"

const contractAddress = "0x5fD6f6d28892F137215Ca8b5d4640E5F2Cc2aAf2"

interface Proposal {
    content: string
    voteCount: number
}

interface VoteDetailsPageProps {
    params: {
        id: string
    }
}

async function fetchCampaignDetails(id: string): Promise<{
    campaign: Campaign | null;
    proposals: Proposal[];
    error: string | null;
}> {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const [metadata, fetchedProposals] = await Promise.all([
            contract.campaignMetadata(id),
            contract.getProposals(id)
        ]);

        const campaign: Campaign = {
            id: Number(id),
            votingType: Number(metadata.votingType),
            restriction: Number(metadata.restriction),
            resultType: Number(metadata.resultType),
            creator: metadata.creator,
            description: metadata.description,
            status: Number(metadata.status),
            startTime: Number(metadata.timeFrame.startTime),
            endTime: Number(metadata.timeFrame.endTime),
            maxVoters: Number(metadata.maxVoters),
        };

        return { campaign, proposals: fetchedProposals, error: null };

    } catch (err) {
        console.error("Error fetching campaign details:", err);
        return { campaign: null, proposals: [], error: "Failed to fetch campaign details. Please try again." };
    }
}

export default async function VoteDetailsPage({ params }: VoteDetailsPageProps) {
    const { id } = params;

    const { campaign, proposals, error } = await fetchCampaignDetails(id);

    if (error || !campaign) {
        return (
            <div className="flex min-h-[400px] items-center justify-center" role="alert">
                <div className="flex flex-col items-center gap-4 text-red-500">
                    <AlertCircle className="h-8 w-8" />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const votingTypeInfo = {
        type: campaign?.votingType === 0 ? "Candidate Based" : "Proposal Based",
        badgeColor: campaign?.votingType === 0
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    };

    const now = Math.floor(Date.now() / 1000);
    const isVotingEnded = now > campaign.endTime;

    let timeRemaining = "Ended";
    if (!isVotingEnded && campaign.endTime) {
        const diff = campaign.endTime - now;
        if (diff > 0) {
            const days = Math.floor(diff / 86400);
            if (days > 7) {
                const weeks = Math.floor(diff / 7);
                timeRemaining = `${weeks} week${weeks > 1 ? "s" : ""}`;
            } else {
                timeRemaining = `${days} day${days > 1 ? "s" : ""}`;
            }
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-6">
                    <Link href="/votes" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Votes
                    </Link>
                </Button>
                <CampaignDetails
                    description={campaign.description}
                    votingTypeInfo={votingTypeInfo}
                    timeRemaining={timeRemaining}
                    restriction={campaign.restriction}
                    maxVoters={campaign.maxVoters}
                    isVotingEnded={isVotingEnded}
                />
            </div>

            <ActiveVote 
                campaign={campaign}
                proposals={proposals}
                votingTypeInfo={votingTypeInfo}
                isVotingEnded={isVotingEnded}
                timeRemaining={timeRemaining}
                id={id}
            />
        </div>
    );
}