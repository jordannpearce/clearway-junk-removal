import { redirect } from "next/navigation";
import { hasStaffAccount } from "@/lib/accounts";
import { listNotificationLog } from "@/lib/comms";

export default async function AdminNotificationsPage() {
  if (!(await hasStaffAccount())) redirect("/admin/setup");
  const notes = await listNotificationLog(120);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">Notifications</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Every Resend email, SignalWire text, review request, and tracked call lands here so dispatch can see what the customer and crew already received.
      </p>
      <div className="mt-6 space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        ) : notes.map((note) => (
          <article key={note.id} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-medium">
              {note.channel.toUpperCase()} · {note.status} · {note.kind || "note"} · {new Date(note.createdAt).toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              To {note.to} via {note.provider}
              {note.audience ? ` · ${note.audience}` : ""}
            </p>
            <p className="mt-2 font-medium">{note.subject}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{note.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
