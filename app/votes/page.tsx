"use client"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Search, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import abi from "@/abi";
import { contractAddress } from "@/lib/constants";

// Define ENUM types
enum VotingType { CandidateBased, ProposalBased }
enum VotingRestriction { OpenToAll, Limited, RequiredRegistration }
enum ResultType { RankBased, OneWinner }
enum CampaignStatus { Created, Active, Ended }

interface Campaign {
    id: number;
    description: string;
    creator: string;
    startTime: number;
    endTime: number;
    votingType: VotingType;
    restriction: VotingRestriction;
    resultType: ResultType;
    status: CampaignStatus;
    maxVoters: number;
}

export default function VotesPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        async function fetchCampaigns() {
            try {
                if (!window.ethereum) {
                    setError("MetaMask is not installed.");
                    return;
                }

                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);
                const count = await contract.campaignCount();

                const fetchedCampaigns: Campaign[] = [];
                for (let index = 1; index <= count; index++) {
                    const campaign = await contract.campaignMetadata(index);
                    fetchedCampaigns.push({
                        id: index,
                        description: campaign.description,
                        creator: campaign.creator,
                        startTime: Number(campaign.timeFrame.startTime),
                        endTime: Number(campaign.timeFrame.endTime),
                        votingType: Number(campaign.votingType),
                        restriction: Number(campaign.restriction),
                        resultType: Number(campaign.resultType),
                        status: Number(campaign.status),
                        maxVoters: Number(campaign.maxVoters),
                    });
                }

                // Sort campaigns by start time (newest first)
                const sortedCampaigns = fetchedCampaigns.sort((a, b) => b.startTime - a.startTime);
                setCampaigns(sortedCampaigns);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch campaigns.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter((campaign) =>
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const hasEnded = (endTime: number): boolean => {
        const now = Math.floor(Date.now() / 1000);
        return now > endTime;
    };

    const getTimeRemaining = (endTime: number): string => {
        const now = Math.floor(Date.now() / 1000);
        const diff = endTime - now;

        if (diff <= 0) {
            return "Ended";
        }

        const days = Math.floor(diff / (60 * 60 * 24));
        const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((diff % (60 * 60)) / 60);
        const seconds = Math.floor(diff % 60);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const getVotingTypeString = (votingType: VotingType): string => {
        switch (votingType) {
            case VotingType.CandidateBased:
                return "Candidate Based";
            case VotingType.ProposalBased:
                return "Proposal Based";
            default:
                return "Unknown";
        }
    };

    const getRestrictionString = (restriction: VotingRestriction): string => {
        switch (restriction) {
            case VotingRestriction.OpenToAll:
                return "Open to All";
            case VotingRestriction.Limited:
                return "Limited";
            case VotingRestriction.RequiredRegistration:
                return "Requires Registration";
            default:
                return "Unknown";
        }
    };

    const getResultTypeString = (resultType: ResultType): string => {
        switch (resultType) {
            case ResultType.RankBased:
                return "Rank Based";
            case ResultType.OneWinner:
                return "One Winner";
            default:
                return "Unknown";
        }
    };

    const getStatusString = (status: CampaignStatus): string => {
        switch (status) {
            case CampaignStatus.Created:
                return "Created";
            case CampaignStatus.Active:
                return "Active";
            case CampaignStatus.Ended:
                return "Ended";
            default:
                return "Unknown";
        }
    };

    const getStatusColor = (status: CampaignStatus): string => {
        switch (status) {
            case CampaignStatus.Created:
                return "bg-blue-100 text-blue-800";
            case CampaignStatus.Active:
                return "bg-green-100 text-green-800";
            case CampaignStatus.Ended:
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <h1 className="text-4xl font-bold text-purple-900 mb-4 md:mb-0">
                        Latest Voting Campaigns
                    </h1>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
                        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
                        <span className="ml-3 text-lg text-gray-600">Loading campaigns...</span>
                    </div>
                ) : error ? (
                    <div className="flex min-h-[200px] items-center justify-center bg-red-50 rounded-lg" role="alert">
                        <div className="flex flex-col items-center gap-4 text-red-600">
                            <AlertCircle className="h-10 w-10" />
                            <p className="text-lg font-medium">Error: {error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredCampaigns.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCampaigns.map((campaign) => {
                                    const timeRemaining = getTimeRemaining(campaign.endTime);
                                    return (
                                        <div
                                            key={campaign.id}
                                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                                        >
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                                                        {campaign.description}
                                                    </h2>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                                                        {getStatusString(campaign.status)}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Creator:</span>{' '}
                                                        <span className="font-mono">{`${campaign.creator.slice(0, 6)}...${campaign.creator.slice(-4)}`}</span>
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm">
                                                            {getVotingTypeString(campaign.votingType)}
                                                        </span>
                                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                                                            {getRestrictionString(campaign.restriction)}
                                                        </span>
                                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-sm">
                                                            {getResultTypeString(campaign.resultType)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-1 text-sm text-gray-500 mb-4 flex items-center">
                                                     <Clock className="h-4 w-4 mr-2" />
                                                    {timeRemaining === "Ended" ? (
                                                        <span className="text-red-600">Ended</span>
                                                    ) : (
                                                        <span>Time Remaining: {timeRemaining}</span>
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray-500 mb-4">Max Voters: {campaign.maxVoters}</p>

                                                <Button
                                                    onClick={() => router.push(`/votes/${campaign.id}`)}
                                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
                                <Search className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-lg text-gray-600">No campaigns found matching your search.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}