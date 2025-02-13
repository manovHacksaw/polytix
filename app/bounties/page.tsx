import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Search } from "lucide-react"
import Link from "next/link"
import { BountyCard } from "@/components/features/bounties/bounty-card"
import { PageHeader } from "@/components/common/page-header"
import { SearchFilters } from "@/components/common/search-filters"

export default function BountiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Bounties"
        action={{
          label: "Create Bounty",
          href: "/bounties/create",
        }}
      />

      <SearchFilters
        searchPlaceholder="Search bounties..."
        filters={[
          {
            name: "reward",
            options: [
              { value: "all", label: "All Rewards" },
              { value: "high", label: "High Reward (500+ ETH)" },
              { value: "medium", label: "Medium Reward (100-500 ETH)" },
              { value: "low", label: "Low Reward (0-100 ETH)" },
            ],
            defaultValue: "all",
          },
          {
            name: "status",
            options: [
              { value: "active", label: "Active" },
              { value: "upcoming", label: "Upcoming" },
              { value: "ended", label: "Ended" },
            ],
            defaultValue: "active",
          },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <BountyCard
            key={i}
            title={`Community Feedback ${i + 1}`}
            creator="Popular Creator"
            description="Help shape the future of our platform by providing valuable feedback and suggestions for improvement."
            reward={500}
            status="active"
            postedAt="2 days ago"
          />
        ))}
      </div>
    </div>
  )
}

