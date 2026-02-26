import { cn } from "@/lib/utils";

type Status = "active" | "pending" | "expired" | "open" | "closed" | "claimable" | "canceled";

const statusStyles: Record<Status, string> = {
  active: "status-active",
  open: "status-active",
  claimable: "status-active",
  pending: "status-pending",
  expired: "status-expired",
  closed: "text-muted-foreground bg-muted/50 border-border",
  canceled: "status-expired",
};

const StatusBadge = ({ status }: { status: Status }) => (
  <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize", statusStyles[status])}>
    {status}
  </span>
);

export default StatusBadge;
