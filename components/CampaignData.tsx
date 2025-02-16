"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Vote } from "lucide-react"
import type { Campaign } from "@/types/Campaign"

interface CampaignDataProps {
  campaign: Campaign
}

export function CampaignData({ campaign }: CampaignDataProps) {
  const getVotingTypeString = (votingType: number): string => {
    return ["Candidate Based", "Proposal Based"][votingType] || "Unknown"
  }

  const getRestrictionString = (restriction: number): string => {
    return ["Open to All", "Limited", "Requires Registration"][restriction] || "Unknown"
  }

  const getResultTypeString = (resultType: number): string => {
    return ["Rank Based", "One Winner"][resultType] || "Unknown"
  }

  const getStatusString = (status: number): string => {
    return ["Created", "Active", "Ended"][status] || "Unknown"
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="space-y-6">
        <div className="flex justify-between items-start">
          <CardTitle className="text-3xl font-bold">{campaign.description}</CardTitle>
          <Badge
            variant={campaign.status === 1 ? "default" : campaign.status === 2 ? "destructive" : "secondary"}
            className="text-sm px-4 py-1"
          >
            {getStatusString(campaign.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Creator Info */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">Creator</span>
            </p>
            <p className="font-mono text-sm break-all text-primary">{campaign.creator}</p>
          </div>

          {/* Time Info */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Timeline</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-primary">Start: {new Date(campaign.startTime * 1000).toLocaleString()}</p>
              <p className="text-primary">End: {new Date(campaign.endTime * 1000).toLocaleString()}</p>
            </div>
          </div>

          {/* Campaign Info */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Vote className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Campaign Details</span>
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className="mr-2">
                {getVotingTypeString(campaign.votingType)}
              </Badge>
              <Badge variant="outline" className="mr-2">
                {getRestrictionString(campaign.restriction)}
              </Badge>
              <Badge variant="outline">{getResultTypeString(campaign.resultType)}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

