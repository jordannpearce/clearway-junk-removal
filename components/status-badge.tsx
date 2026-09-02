import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/store";
import type { JobStatus } from "@/lib/types";

const tone: Record<JobStatus, "default" | "secondary" | "destructive" | "outline"> = {
  requested: "outline",
  confirmed: "secondary",
  dispatched: "default",
  en_route: "default",
  on_site: "default",
  completed: "secondary",
  cancelled: "destructive",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return <Badge variant={tone[status]}>{statusLabel(status)}</Badge>;
}
