// CampaignDetails.tsx
import { Users, Calendar, Vote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CampaignDetailsProps {
  campaign: any;
  getVotingTypeString: (votingType: number) => string;
  getRestrictionString: (restriction: number) => string;
  getResultTypeString: (resultType: number) => string;
}

export function CampaignDetails({
  campaign,
  getVotingTypeString,
  getRestrictionString,
  getResultTypeString,
}: CampaignDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Creator Info */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="font-medium">Creator</span>
        </p>
        <p className="font-mono text-sm break-all text-primary">{campaign?.creator}</p>
      </div>

      {/* Time Info */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Timeline</span>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-primary">Start: {new Date(campaign?.startTime * 1000).toLocaleString()}</p>
          <p className="text-primary">End: {new Date(campaign?.endTime * 1000).toLocaleString()}</p>
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
            {getVotingTypeString(campaign?.votingType ?? 0)}
          </Badge>
          <Badge variant="outline" className="mr-2">
            {getRestrictionString(campaign?.restriction ?? 0)}
          </Badge>
          <Badge variant="outline">{getResultTypeString(campaign?.resultType ?? 0)}</Badge>
        </div>
      </div>
    </div>
  );
}