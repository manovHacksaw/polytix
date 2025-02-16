import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/redux/store";
import { RootState } from "@/lib/redux/store";
import {
    fetchCampaigns,
    createCampaign,
    registerToVote,
    voteForProposal,
    fetchProposals,
    loadContractAndSigner
} from "@/lib/redux/features/contract/contractSlice";
import { VotingRestriction, ResultType } from "@/types/VotingTypes";
import { useCallback, useEffect } from "react";

function usePolytix() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        contractAddress, // Get contractAddress from state
        signerAddress, // Get signerAddress from state
        campaigns,
        proposals,
        paused,
        isFetchingCampaigns,
        isRegisteringVoter,
        isCastingVote,
        isCreatingCampaign,
        error,
    } = useSelector((state: RootState) => state.polytix);

    useEffect(() => {
        // Load the contract when the component mounts
        dispatch(loadContractAndSigner());
    }, [dispatch]);

    const dispatchFetchCampaigns = useCallback(() => {
        dispatch(fetchCampaigns());
    }, [dispatch]);

    const dispatchCreateCampaign = useCallback(
        (
            description: string,
            restriction: VotingRestriction,
            resultType: ResultType,
            startTime: number,
            endTime: number,
            maxVoters: number,
            proposals: string[]
        ) => {
            dispatch(
                createCampaign({
                    description,
                    restriction,
                    resultType,
                    startTime,
                    endTime,
                    maxVoters,
                    proposals,
                })
            );
        },
        [dispatch]
    );

    const dispatchRegisterToVote = useCallback((campaignId: number) => {
        dispatch(registerToVote(campaignId));
    }, [dispatch]);

    const dispatchVoteForProposal = useCallback((campaignId: number, proposalId: number) => {
        dispatch(voteForProposal({ campaignId, proposalId }));
    }, [dispatch]);

    const dispatchFetchProposals = useCallback((campaignId: number) => {
        dispatch(fetchProposals(campaignId));
    }, [dispatch]);

    return {
        // State
        contractAddress, // Return contractAddress instead of contract
        signerAddress, // Return signerAddress
        campaigns,
        proposals,
        paused,
        isFetchingCampaigns,
        isRegisteringVoter,
        isCastingVote,
        isCreatingCampaign,
        error,

        // Actions
        dispatchFetchCampaigns,
        dispatchCreateCampaign,
        dispatchRegisterToVote,
        dispatchVoteForProposal,
        dispatchFetchProposals,
    };
}

export default usePolytix;