import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center", className)}>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}

