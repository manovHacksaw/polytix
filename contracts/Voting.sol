// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Polytix is ReentrancyGuard, Pausable {
    enum VotingType { CandidateBased, ProposalBased }
    enum VotingRestriction { OpenToAll, Limited, RequiredRegistration }
    enum ResultType { RankBased, OneWinner }
    enum CampaignStatus { Created, Active, Ended }

    address owner;

    constructor() {
        owner = msg.sender;
    }

    struct TimeFrame {
        uint256 startTime;
        uint256 endTime;
    }

    struct Proposal {
        string content;
        uint256 voteCount;
    }

    struct CampaignMetadata {
        VotingType votingType;
        VotingRestriction restriction;
        ResultType resultType;
        address creator;
        string description;
        CampaignStatus status;
        TimeFrame timeFrame;
        uint256 maxVoters;
    }

    struct CampaignData {
        uint256 totalVotes;
        uint256 proposalCount;
        uint256 registeredVoterCount;
        mapping(uint256 => Proposal) proposals;
        mapping(address => bool) hasVoted;
        mapping(address => bool) isRegistered;
    }

    mapping(uint256 => CampaignMetadata) public campaignMetadata;
    mapping(uint256 => CampaignData) private campaignData;
    uint256 public campaignCount;

    event CampaignCreated(uint256 indexed campaignId, address indexed creator, uint256 startTime, uint256 endTime);
    event ProposalAdded(uint256 indexed campaignId, uint256 indexed proposalId, string content);
    event VoterRegistered(uint256 indexed campaignId, address indexed voter);
    event VoteCast(uint256 indexed campaignId, address indexed voter, uint256 proposalId);

    modifier  onlyOwner(){
        require(msg.sender == owner, "Only owner is allowed");
        _;
    }

    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign");
        _;
    }

    modifier onlyCreator(uint256 _campaignId) {
        require(campaignMetadata[_campaignId].creator == msg.sender, "Not creator");
        _;
    }

    function createProposalBasedCampaign(
        string memory description,
        VotingRestriction restriction,
        ResultType resultType,
        uint256 startTime,
        uint256 endTime,
        uint256 maxVoters,
        string[] memory proposals
    ) external whenNotPaused nonReentrant {
        require(startTime >= block.timestamp + 3 minutes, "Invalid start time");
        require(startTime < endTime, "Invalid timeframe");
        require(proposals.length >= 2, "Minimum 2 proposals required");

        campaignCount++;

        campaignMetadata[campaignCount] = CampaignMetadata({
            votingType: VotingType.ProposalBased,
            restriction: restriction,
            resultType: resultType,
            creator: msg.sender,
            description: description,
            status: CampaignStatus.Created,
            timeFrame: TimeFrame(startTime, endTime),
            maxVoters: maxVoters
        });

        CampaignData storage data = campaignData[campaignCount];

        for (uint256 i = 0; i < proposals.length; i++) {
            data.proposals[i] = Proposal({ content: proposals[i], voteCount: 0 });
            emit ProposalAdded(campaignCount, i, proposals[i]);
        }

        data.proposalCount = proposals.length;

        emit CampaignCreated(campaignCount, msg.sender, startTime, endTime);
    }

    function addProposal(uint256 _campaignId, string memory proposalContent)
        external
        campaignExists(_campaignId)
        onlyCreator(_campaignId)
        whenNotPaused
    {
        require(bytes(proposalContent).length > 0, "Invalid proposal content");
        require(campaignMetadata[_campaignId].status == CampaignStatus.Created, "Cannot add proposals now");

        CampaignData storage data = campaignData[_campaignId];
        data.proposals[data.proposalCount] = Proposal({ content: proposalContent, voteCount: 0 });
        data.proposalCount++;

        emit ProposalAdded(_campaignId, data.proposalCount - 1, proposalContent);
    }

    function registerToVote(uint256 _campaignId) external whenNotPaused campaignExists(_campaignId) {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        CampaignData storage data = campaignData[_campaignId];

        require(metadata.restriction != VotingRestriction.OpenToAll, "No registration required");
        require(!data.isRegistered[msg.sender], "Already registered");
        require(block.timestamp < metadata.timeFrame.startTime, "Registration closed");

        if (metadata.restriction == VotingRestriction.Limited) {
            require(data.registeredVoterCount < metadata.maxVoters, "Max voters reached");
        }

        data.isRegistered[msg.sender] = true;
        data.registeredVoterCount++;

        emit VoterRegistered(_campaignId, msg.sender);
    }

    function voteForProposal(uint256 _campaignId, uint256 _proposalId)
        external
        whenNotPaused
        campaignExists(_campaignId)
    {
        CampaignMetadata storage metadata = campaignMetadata[_campaignId];
        CampaignData storage data = campaignData[_campaignId];

        require(isVotingOpen(_campaignId), "Voting not open");
        require(!data.hasVoted[msg.sender], "Already voted");
        require(_proposalId < data.proposalCount, "Invalid proposal ID");

        if (metadata.restriction != VotingRestriction.OpenToAll) {
            require(data.isRegistered[msg.sender], "Not registered to vote");
        }

        data.hasVoted[msg.sender] = true;
        data.proposals[_proposalId].voteCount++;
        data.totalVotes++;

        emit VoteCast(_campaignId, msg.sender, _proposalId);
    }

    function isVotingOpen(uint256 _campaignId) public view returns (bool) {
        TimeFrame memory timeFrame = campaignMetadata[_campaignId].timeFrame;
        return block.timestamp >= timeFrame.startTime && block.timestamp <= timeFrame.endTime;
    }

    function getProposals(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (Proposal[] memory)
    {
        CampaignData storage data = campaignData[_campaignId];
        Proposal[] memory proposals = new Proposal[](data.proposalCount);

        for (uint256 i = 0; i < data.proposalCount; i++) {
            proposals[i] = data.proposals[i];
        }

        return proposals;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
