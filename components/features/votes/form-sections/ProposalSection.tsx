import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProposalSectionProps {
  proposals: Array<{ id: number; content: string }>
  onAdd: () => void
  onUpdate: (id: number, content: string) => void
  onRemove: (id: number) => void
}

export function ProposalSection({ proposals, onAdd, onUpdate, onRemove }: ProposalSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposals</CardTitle>
        <CardDescription>Add up to 10 proposals for voters to choose from</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {proposals.map((proposal, index) => (
          <div key={proposal.id} className="flex items-center gap-2">
            <Input
              placeholder={`Proposal ${index + 1}`}
              value={proposal.content}
              onChange={(e) => onUpdate(proposal.id, e.target.value)}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={() => onRemove(proposal.id)}
            >
              ✕
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="w-full"
          disabled={proposals.length >= 10}
        >
          Add Proposal
        </Button>
      </CardContent>
    </Card>
  )
}