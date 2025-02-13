// components/CampaignDetails.tsx
import { Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CampaignDetailsProps {
  description: string
  votingTypeInfo: {
    type: string
    badgeColor: string
  }
  timeRemaining: string
  restriction: number
  maxVoters: number
  isVotingEnded: boolean
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  description,
  votingTypeInfo,
  timeRemaining,
  restriction,
  maxVoters,
  isVotingEnded,
}) => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">{description}</h1>
        <Badge variant="secondary" className={votingTypeInfo.badgeColor}>
          {votingTypeInfo.type}
        </Badge>
      </div>
      <div className="mt-2 flex items-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            {isVotingEnded ? "Voting ended" : `Ends in ${timeRemaining}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>
            {restriction === 0 && "Open to All"}
            {restriction === 1 && `Limited to ${maxVoters} Voters`}
            {restriction === 2 && "Registration Required"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails