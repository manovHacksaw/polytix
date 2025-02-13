import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, Vote } from "lucide-react"

export function Campaigns() {
  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-bold">Active Votes</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Candidate Based Vote */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Council Election</CardTitle>
              <Vote className="h-5 w-5 text-purple-600" />
            </div>
            <CardDescription>Candidate Based • Ends in 2 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Total Votes</span>
                <span className="font-medium">156</span>
              </div>
              <Progress value={66} className="h-2" />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>4 Candidates</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Vote Now</Button>
          </CardFooter>
        </Card>

        {/* Rank Based Vote */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Project Priority Poll</CardTitle>
              <Vote className="h-5 w-5 text-purple-600" />
            </div>
            <CardDescription>Rank Based • Ends in 5 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Total Votes</span>
                <span className="font-medium">89</span>
              </div>
              <Progress value={45} className="h-2" />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>6 Options to Rank</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Vote Now</Button>
          </CardFooter>
        </Card>

        {/* Proposal Based Vote */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Community Guidelines Update</CardTitle>
              <Vote className="h-5 w-5 text-purple-600" />
            </div>
            <CardDescription>Proposal Based • Ends in 1 week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Total Votes</span>
                <span className="font-medium">234</span>
              </div>
              <Progress value={78} className="h-2" />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>Registration Required</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Vote Now</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

