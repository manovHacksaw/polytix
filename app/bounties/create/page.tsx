import { CreateBountyForm } from "@/components/features/bounties/CreateBountyForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateBountyPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Bounty</CardTitle>
          <CardDescription>Set up a new bounty program for your community</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateBountyForm />
        </CardContent>
      </Card>
    </div>
  )
}

