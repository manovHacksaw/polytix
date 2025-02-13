import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'

interface Proposal {
  id: number;
  content: string;
}

interface ProposalListProps {
  proposals: Proposal[];
  setProposals: React.Dispatch<React.SetStateAction<Proposal[]>>;
}

export function ProposalList({ proposals, setProposals }: ProposalListProps) {
  const [newProposal, setNewProposal] = useState('')

  const addProposal = () => {
    if (newProposal.trim() !== '') {
      setProposals([...proposals, { id: Date.now(), content: newProposal.trim() }])
      setNewProposal('')
    }
  }

  const removeProposal = (id: number) => {
    setProposals(proposals.filter(proposal => proposal.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          value={newProposal}
          onChange={(e) => setNewProposal(e.target.value)}
          placeholder="Enter new proposal"
          className="flex-grow"
        />
        <Button onClick={addProposal} type="button">Add</Button>
      </div>
      <ul className="space-y-2">
        {proposals.map((proposal) => (
          <li key={proposal.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
            <span>{proposal.content}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeProposal(proposal.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
