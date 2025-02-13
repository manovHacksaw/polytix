import { Campaign } from "@/types/Campaign"
import { motion } from "framer-motion"
import { Calendar, Users, ChevronRight } from "lucide-react"
import Link from "next/link"

interface ActiveVotesProps {
  campaigns: Campaign[]
}

export function ActiveVotes({ campaigns }: ActiveVotesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign, index) => (
        <motion.div
          key={campaign.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            href={`/votes/${campaign.id}`}
            className="block h-full rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-900"
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {campaign.description}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(campaign.startTime * 1000).toLocaleDateString()} - 
                      {new Date(campaign.endTime * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Max Voters: {campaign.maxVoters}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {campaign.votingType === 0 ? "Proposal Based" : "Candidate Based"}
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}