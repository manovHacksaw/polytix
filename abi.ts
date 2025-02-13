const metaData= {
	"compiler": {
		"version": "0.8.28+commit.7893614a"
	},
	"language": "Solidity",
	"output": {
		"abi": [
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					}
				],
				"name": "CampaignCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "Paused",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "proposalId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "string",
						"name": "content",
						"type": "string"
					}
				],
				"name": "ProposalAdded",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "address",
						"name": "account",
						"type": "address"
					}
				],
				"name": "Unpaused",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "proposalId",
						"type": "uint256"
					}
				],
				"name": "VoteCast",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "campaignId",
						"type": "uint256"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "voter",
						"type": "address"
					}
				],
				"name": "VoterRegistered",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "proposalContent",
						"type": "string"
					}
				],
				"name": "addProposal",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "campaignCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"name": "campaignMetadata",
				"outputs": [
					{
						"internalType": "enum Polytix.VotingType",
						"name": "votingType",
						"type": "uint8"
					},
					{
						"internalType": "enum Polytix.VotingRestriction",
						"name": "restriction",
						"type": "uint8"
					},
					{
						"internalType": "enum Polytix.ResultType",
						"name": "resultType",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "enum Polytix.CampaignStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "startTime",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "endTime",
								"type": "uint256"
							}
						],
						"internalType": "struct Polytix.TimeFrame",
						"name": "timeFrame",
						"type": "tuple"
					},
					{
						"internalType": "uint256",
						"name": "maxVoters",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "enum Polytix.VotingRestriction",
						"name": "restriction",
						"type": "uint8"
					},
					{
						"internalType": "enum Polytix.ResultType",
						"name": "resultType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "maxVoters",
						"type": "uint256"
					},
					{
						"internalType": "string[]",
						"name": "proposals",
						"type": "string[]"
					}
				],
				"name": "createProposalBasedCampaign",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "getProposals",
				"outputs": [
					{
						"components": [
							{
								"internalType": "string",
								"name": "content",
								"type": "string"
							},
							{
								"internalType": "uint256",
								"name": "voteCount",
								"type": "uint256"
							}
						],
						"internalType": "struct Polytix.Proposal[]",
						"name": "",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "isVotingOpen",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "pause",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "paused",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					}
				],
				"name": "registerToVote",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "unpause",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "_campaignId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_proposalId",
						"type": "uint256"
					}
				],
				"name": "voteForProposal",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		],
		"devdoc": {
			"events": {
				"Paused(address)": {
					"details": "Emitted when the pause is triggered by `account`."
				},
				"Unpaused(address)": {
					"details": "Emitted when the pause is lifted by `account`."
				}
			},
			"kind": "dev",
			"methods": {
				"paused()": {
					"details": "Returns true if the contract is paused, and false otherwise."
				}
			},
			"version": 1
		},
		"userdoc": {
			"kind": "user",
			"methods": {},
			"version": 1
		}
	},
	"settings": {
		"compilationTarget": {
			"contracts/Voting.sol": "Polytix"
		},
		"evmVersion": "shanghai",
		"libraries": {},
		"metadata": {
			"bytecodeHash": "ipfs"
		},
		"optimizer": {
			"enabled": false,
			"runs": 200
		},
		"remappings": []
	},
	"sources": {
		"@openzeppelin/contracts/access/Ownable.sol": {
			"keccak256": "0xff6d0bb2e285473e5311d9d3caacb525ae3538a80758c10649a4d61029b017bb",
			"license": "MIT",
			"urls": [
				"bzz-raw://8ed324d3920bb545059d66ab97d43e43ee85fd3bd52e03e401f020afb0b120f6",
				"dweb:/ipfs/QmfEckWLmZkDDcoWrkEvMWhms66xwTLff9DDhegYpvHo1a"
			]
		},
		"@openzeppelin/contracts/security/Pausable.sol": {
			"keccak256": "0x0849d93b16c9940beb286a7864ed02724b248b93e0d80ef6355af5ef15c64773",
			"license": "MIT",
			"urls": [
				"bzz-raw://4ddabb16009cd17eaca3143feadf450ac13e72919ebe2ca50e00f61cb78bc004",
				"dweb:/ipfs/QmSPwPxX7d6TTWakN5jy5wsaGkS1y9TW8fuhGSraMkLk2B"
			]
		},
		"@openzeppelin/contracts/security/ReentrancyGuard.sol": {
			"keccak256": "0xa535a5df777d44e945dd24aa43a11e44b024140fc340ad0dfe42acf4002aade1",
			"license": "MIT",
			"urls": [
				"bzz-raw://41319e7f621f2dc3733511332c4fd032f8e32ad2aa7fd6f665c19741d9941a34",
				"dweb:/ipfs/QmcYR3bd862GD1Bc7jwrU9bGxrhUu5na1oP964bDCu2id1"
			]
		},
		"@openzeppelin/contracts/utils/Context.sol": {
			"keccak256": "0x493033a8d1b176a037b2cc6a04dad01a5c157722049bbecf632ca876224dd4b2",
			"license": "MIT",
			"urls": [
				"bzz-raw://6a708e8a5bdb1011c2c381c9a5cfd8a9a956d7d0a9dc1bd8bcdaf52f76ef2f12",
				"dweb:/ipfs/Qmax9WHBnVsZP46ZxEMNRQpLQnrdE4dK8LehML1Py8FowF"
			]
		},
		"contracts/Voting.sol": {
			"keccak256": "0xbf0d5d6181114b919fd632521497d9940d1200e515a343acead71212538d68f5",
			"license": "MIT",
			"urls": [
				"bzz-raw://8347cb6a6e1388defeab5d3c1c11f421a16f24b591ef520fbaf33b27a71602a0",
				"dweb:/ipfs/QmNwbDPWT3o5wqMCaK4eNja3bLDN7ipunY7shpDm8BWD6P"
			]
		}
	},
	"version": 1
}

export default metaData.output.abi;