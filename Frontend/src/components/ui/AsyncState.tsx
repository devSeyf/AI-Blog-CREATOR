import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";
import { buttonStyles, cardStyles } from "../../styles/ui";

interface StateProps {
  title?: string;
  message: string;
  className?: string;
}

interface ErrorStateProps extends StateProps {
  onRetry?: () => void;
}

export function LoadingState({
  message = "Loading...",
  className = "",
}: Partial<StateProps>) {
  return (
    <div
      className={`flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-slate-500 ${className}`}
      role="status"
    >
      <LoaderCircle className="size-5 animate-spin text-cyan-600" />
      {message}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", message, className = "" }: StateProps) {
  return (
    <div className={`${cardStyles} px-6 py-12 text-center ${className}`}>
      <Inbox className="mx-auto mb-3 size-9 text-slate-300" />
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export function ErrorState({
  title = "Unable to load this content",
  message,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`${cardStyles} border-rose-200 bg-rose-50 px-6 py-10 text-center ${className}`}
      role="alert"
    >
      <AlertTriangle className="mx-auto mb-3 size-9 text-rose-500" />
      <h3 className="font-semibold text-rose-900">{title}</h3>
      <p className="mt-1 text-sm text-rose-700">{message}</p>
      {onRetry && (
        <button className={`${buttonStyles.secondary} mt-5`} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

