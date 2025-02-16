// components/VotingActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Clock } from "lucide-react";
import { VotingRestriction } from "@/types/VotingTypes";

interface VotingActionsProps {
    restriction: VotingRestriction;
    isRegistered: boolean;
    votingOpen: boolean;
    hasVoted: boolean;
    isLoading: boolean;
    handleRegister: () => Promise<void>;
    handleVote: () => Promise<void>;
    selectedProposal: number | null;
}

const VotingActions: React.FC<VotingActionsProps> = ({
    restriction,
    isRegistered,
    votingOpen,
    hasVoted,
    isLoading,
    handleRegister,
    handleVote,
    selectedProposal,
}) => {
    return (
        <div className="mt-8">
            {restriction !== VotingRestriction.OpenToAll && !isRegistered ? (
                <Button
                    onClick={handleRegister}
                    disabled={isLoading || !votingOpen}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Registering...
                        </>
                    ) : (
                        <>
                            <HandRaised className="h-4 w-4 mr-2" />
                            Register to Vote
                        </>
                    )}
                </Button>
            ) : votingOpen && !hasVoted ? (
                <Button
                    onClick={handleVote}
                    disabled={isLoading || selectedProposal === null}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Submitting Vote...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Vote for Proposal
                        </>
                    )}
                </Button>
            ) : hasVoted ? (
                <div className="text-green-600 mt-4">
                    <CheckCircle className="inline-block h-5 w-5 mr-1 align-text-top" />
                    You have already voted in this campaign.
                </div>
            ) : !votingOpen ? (
                <div className="text-gray-600 mt-4">
                    <Clock className="inline-block h-5 w-5 mr-1 align-text-top" />
                    Voting is not currently open for this campaign.
                </div>
            ) : null}
        </div>
    );
};

export default VotingActions;