// components/VotingOptions.tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Proposal {
  content: string
  voteCount: number
}

interface VotingOptionsProps {
  proposals: Proposal[]
  selectedOption: string
  onValueChange: (value: string) => void
  disabled: boolean
}

const VotingOptions: React.FC<VotingOptionsProps> = ({
  proposals,
  selectedOption,
  onValueChange,
  disabled,
}) => {
  return (
    <RadioGroup
      value={selectedOption}
      onValueChange={onValueChange}
      className="grid gap-4"
      disabled={disabled}
    >
      {proposals.map((proposal, index) => (
        <Label
          key={index}
          className="flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <span>{proposal.content}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {proposal.voteCount.toString()} votes
          </span>
        </Label>
      ))}
    </RadioGroup>
  )
}

export default VotingOptions