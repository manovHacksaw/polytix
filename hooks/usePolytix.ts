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
import { useEffect } from "react";

function usePolytix() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        contract,
        campaigns,
        proposals,
        paused,
        isFetchingCampaigns,
        isRegisteringVoter,
        isCastingVote,
        isCreatingCampaign,
        error,
        signerAddress
    } = useSelector((state: RootState) => state.polytix);

    useEffect(() => {
        // Load the contract when the component mounts
        dispatch(loadContractAndSigner());
    }, [dispatch]);

    const dispatchFetchCampaigns = () => {
        dispatch(fetchCampaigns());
    };

    const dispatchCreateCampaign = (
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
    };

    const dispatchRegisterToVote = (campaignId: number) => {
        dispatch(registerToVote(campaignId));
    };

    const dispatchVoteForProposal = (campaignId: number, proposalId: number) => {
        dispatch(voteForProposal({ campaignId, proposalId }));
    };

    const dispatchFetchProposals = (campaignId: number) => {
        dispatch(fetchProposals(campaignId));
    };

    return {
        // State
        contract,
        campaigns,
        proposals,
        paused,
        isFetchingCampaigns,
        isRegisteringVoter,
        isCastingVote,
        isCreatingCampaign,
        error,
        signerAddress,

        // Actions
        dispatchFetchCampaigns,
        dispatchCreateCampaign,
        dispatchRegisterToVote,
        dispatchVoteForProposal,
        dispatchFetchProposals,
    };
}

export default usePolytix;