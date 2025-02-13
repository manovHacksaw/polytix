export interface Campaign {
    campaignId: number
    votingType: number
    restriction: number
    resultType: number
    creator: string
    description: string
    status: number
    timeFrame: {
      startTime: number
      endTime: number
    }
    maxVoters: number
  }
  
  