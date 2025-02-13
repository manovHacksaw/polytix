import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

interface BountyCardProps {
  title: string
  creator: string
  description: string
  reward: number
  status: "active" | "upcoming" | "ended"
  postedAt: string
}

export function BountyCard({ title, creator, description, reward, status, postedAt }: BountyCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Award className="h-5 w-5 text-purple-600" />
        </div>
        <CardDescription>
          Posted by {creator} • {postedAt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-600 dark:bg-purple-900/20">
            {reward} ETH
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              status === "active" && "bg-green-100 text-green-600 dark:bg-green-900/20",
              status === "upcoming" && "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
              status === "ended" && "bg-gray-100 text-gray-600 dark:bg-gray-900/20",
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  )
}

