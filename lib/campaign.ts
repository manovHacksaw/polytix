
import { ethers } from "ethers"
import abi from "@/abi"

const contractAddress = "0x5fD6f6d28892F137215Ca8b5d4640E5F2Cc2aAf2"

export async function getCampaignDetails(id: string) {
  const provider = new ethers.BrowserProvider(window.ethereum); 
  const contract = new ethers.Contract(contractAddress, abi, provider)

  try {
    const metadata = await contract.campaignMetadata(id)
    const proposals = await contract.getProposals(id)

    const timeRemaining = calculateTimeRemaining(metadata.timeFrame.endTime)

    return {
      campaignId: Number(id),
      description: metadata.description,
      votingType: Number(metadata.votingType),
      status: Number(metadata.status),
      timeRemaining,
      proposals: proposals.map((proposal: any) => ({
        content: proposal.content,
        voteCount: proposal.voteCount.toString()
      }))
    }
  } catch (err) {
    console.error("Error fetching campaign data:", err)
    return null
  }
}

export function calculateTimeRemaining(endTime: number) {
  const now = Math.floor(Date.now() / 1000)
  const diff = endTime - now
  const days = Math.floor(diff / 86400)
  if (days > 7) {
    return `${Math.floor(days / 7)} weeks`
  } else {
    return `${days} days`
  }
}
