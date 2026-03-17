import { Loader2, AlertCircle, Inbox } from "lucide-react"

interface StateProps {
  title?: string
  description?: string
}

export function LoadingState({ title = "Loading...", description }: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
      <p className="font-medium">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again later.",
}: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-8 w-8 text-destructive mb-3" />
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  )
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Check back later.",
}: StateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="h-8 w-8 text-muted-foreground mb-3" />
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
