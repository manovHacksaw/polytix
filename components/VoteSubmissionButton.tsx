"use client";

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface VoteSubmissionButtonProps {
    isVoting: boolean
    isVotingEnded: boolean
    disabled: boolean
    onClick: () => void
}

const VoteSubmissionButton: React.FC<VoteSubmissionButtonProps> = ({
    isVoting,
    isVotingEnded,
    disabled,
    onClick,
}) => {
    return (
        <Button
            className="mt-6 w-full bg-purple-600 hover:bg-purple-700"
            onClick={onClick}
            disabled={disabled}
        >
            {isVoting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Vote...
                </>
            ) : isVotingEnded ? (
                "Voting Ended"
            ) : (
                "Submit Vote"
            )}
        </Button>
    )
}

export default VoteSubmissionButton