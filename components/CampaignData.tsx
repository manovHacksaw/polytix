"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Calendar, Users, Vote, Clock, Shield, Trophy } from "lucide-react"
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

  const getStatusVariant = (status: number): "default" | "success" | "destructive" | "secondary" => {
    switch (status) {
      case 0: return "secondary" // Created
      case 1: return "default"   // Active
      case 2: return "destructive" // Ended
      default: return "secondary"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="border-2 border-primary/20 overflow-hidden backdrop-blur-sm bg-background/95">
        <CardHeader className="space-y-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start gap-4"
            variants={childVariants}
          >
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                {campaign.description}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Campaign ID: #{campaign.id}
              </p>
            </div>
            <Badge
              variant={getStatusVariant(campaign.status)}
              className="text-sm px-4 py-1.5 rounded-full font-medium"
            >
              {getStatusString(campaign.status)}
            </Badge>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={childVariants}
          >
            {/* Creator Info */}
            <div className="group bg-muted/50 hover:bg-muted/70 rounded-xl p-5 border border-border transition-all duration-200 hover:shadow-md">
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-500" /> {/* Modified Icon Color */}
                <span className="font-medium">Creator</span>
              </p>
              <div className="font-mono text-sm break-all text-primary/90 group-hover:text-primary transition-colors">
                {campaign.creator}
              </div>
            </div>

            {/* Time Info */}
            <div className="group bg-muted/50 hover:bg-muted/70 rounded-xl p-5 border border-border transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-yellow-500" /> {/* Modified Icon Color */}
                <span className="font-medium text-sm">Timeline</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-primary/90 group-hover:text-primary transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>Start: {new Date(campaign.startTime * 1000).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-primary/90 group-hover:text-primary transition-colors">
                  <Calendar className="h-4 w-4" />
                  <span>End: {new Date(campaign.endTime * 1000).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Campaign Info */}
            <div className="group bg-muted/50 hover:bg-muted/70 rounded-xl p-5 border border-border transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-blue-500" /> {/* Modified Icon Color */}
                <span className="font-medium text-sm">Campaign Details</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="group-hover:bg-background/50 transition-colors border-emerald-500"> {/* Added Border Color */}
                  <Vote className="h-3 w-3 mr-1" />
                  {getVotingTypeString(campaign.votingType)}
                </Badge>
                <Badge variant="outline" className="group-hover:bg-background/50 transition-colors border-blue-500"> {/* Added Border Color */}
                  <Shield className="h-3 w-3 mr-1" />
                  {getRestrictionString(campaign.restriction)}
                </Badge>
                <Badge variant="outline" className="group-hover:bg-background/50 transition-colors border-yellow-500"> {/* Added Border Color */}
                  <Trophy className="h-3 w-3 mr-1" />
                  {getResultTypeString(campaign.resultType)}
                </Badge>
              </div>
            </div>
          </motion.div>
        </CardHeader>
      </Card>
    </motion.div>
  )
}