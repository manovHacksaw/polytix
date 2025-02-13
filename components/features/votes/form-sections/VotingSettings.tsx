import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function VotingSettings({ form }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting Settings</CardTitle>
        <CardDescription>Configure who can participate in the vote</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="registrationRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Registration Required</FormLabel>
                <FormDescription>
                  Require voters to register before voting starts
                </FormDescription>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("voteType") === "candidate" && (
          <FormField
            control={form.control}
            name="candidateRegistration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate Registration</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select who can register candidates" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="creator">Created by Vote Creator</SelectItem>
                    <SelectItem value="open">Open Registration</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="maxVoters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Voters (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter maximum number of voters" 
                  {...field} 
                />
              </FormControl>
              <FormDescription className="px-3"> Leave empty for unlimited voters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}