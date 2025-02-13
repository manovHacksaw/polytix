import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

export function DateSelection({ form }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <div className="relative">
                <Input type="datetime-local" {...field} />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date</FormLabel>
            <FormControl>
              <div className="relative">
                <Input type="datetime-local" {...field} />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}