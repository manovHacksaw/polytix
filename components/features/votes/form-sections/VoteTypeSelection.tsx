import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const voteTypes = [
  {
    value: "candidate",
    label: "Candidate Based",
    description: "Traditional voting with registered candidates",
  },
  {
    value: "rank",
    label: "Rank Based",
    description: "Rank multiple options in order of preference",
  },
  {
    value: "proposal",
    label: "Proposal Based",
    description: "Submit and vote on proposals",
  },
]

export function VoteTypeSelection({ form }) {
  return (
    <FormField
      control={form.control}
      name="voteType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Vote Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {voteTypes.map((option) => (
                <FormItem key={option.value}>
                  <FormControl>
                    <Card
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary",
                        field.value === option.value && "border-primary bg-primary/5"
                      )}
                    >
                      <CardHeader className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} />
                          <CardTitle className="text-base">{option.label}</CardTitle>
                        </div>
                        <CardDescription>{option.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </FormControl>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  )
}