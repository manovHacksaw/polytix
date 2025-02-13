import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface SearchFiltersProps {
  searchPlaceholder?: string
  filters: {
    name: string
    options: FilterOption[]
    defaultValue?: string
  }[]
}

export function SearchFilters({ searchPlaceholder = "Search...", filters }: SearchFiltersProps) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input className="border-0 bg-transparent" placeholder={searchPlaceholder} />
      </div>
      {filters.map((filter) => (
        <Select key={filter.name} defaultValue={filter.defaultValue}>
          <SelectTrigger>
            <SelectValue placeholder={`Filter by ${filter.name}`} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  )
}

