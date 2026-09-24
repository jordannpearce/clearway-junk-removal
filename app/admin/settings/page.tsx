import { redirect } from "next/navigation";
import { saveIntegrationSettingsAction } from "@/lib/admin-actions";
import { hasStaffAccount } from "@/lib/accounts";
import { getSession } from "@/lib/auth";
import { getIntegrationStatus } from "@/lib/settings";
import { site } from "@/lib/site";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminSettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  if (!(await hasStaffAccount())) redirect("/admin/setup");
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin");
  const query = await searchParams;
  const status = await getIntegrationStatus();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl">API keys</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        You can paste Resend and SignalWire values here. They stay on the server, never go back out in full after you save, and Railway environment variables still win if both are set.
      </p>
      <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed">
        <p className="font-medium">Safest place</p>
        <p className="mt-2 text-muted-foreground">
          The safest store is Railway Variables on the <span className="font-medium text-foreground">web</span> service, not this page and not a chat or email. Open{" "}
          <a className="text-primary underline" href="https://railway.com/project/244460ba-d2e1-45b8-8f93-c443d0ca1c22" target="_blank" rel="noreferrer">
            the Clearway Railway project
          </a>
          , choose <span className="font-medium text-foreground">web</span>, then Variables, and add the same names as the fields below. Railway injects them at boot. They never sit in git and they are not shown in the admin HTML.
        </p>
        <p className="mt-2 text-muted-foreground">
          Use this page when you want to set keys without opening Railway. Leave a secret field blank to keep the value that is already stored.
        </p>
      </div>
      {query.saved === "1" ? <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">Settings saved. New emails, texts, and calls will use these keys.</p> : null}
      {query.error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{query.error}</p> : null}

      <form action={saveIntegrationSettingsAction} className="mt-8 space-y-8">
        <section className="space-y-4 rounded-3xl border border-border bg-card p-6">
          <div>
            <h2 className="font-heading text-2xl">Resend</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {status.resend.configured
                ? `Email is live${status.resend.keyHint ? ` (${status.resend.keyHint})` : ""}. Source: ${status.resend.source}.`
                : "No Resend key yet. Sends stay in the notification log."}
              {status.resend.lockedByEnv ? " A Railway variable is already set, so it overrides anything saved here." : ""}
            </p>
          </div>
          <div>
            <Label htmlFor="resend_api_key">RESEND_API_KEY</Label>
            <Input id="resend_api_key" name="resend_api_key" type="password" autoComplete="off" className="mt-1.5" placeholder={status.resend.keyHint || "re_••••"} />
          </div>
          <div>
            <Label htmlFor="resend_from_email">RESEND_FROM_EMAIL</Label>
            <Input
              id="resend_from_email"
              name="resend_from_email"
              className="mt-1.5"
              defaultValue={status.resend.fromEmail}
              placeholder={`Clearway Junk Removal <${site.email}>`}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-border bg-card p-6">
          <div>
            <h2 className="font-heading text-2xl">SignalWire</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {status.signalwire.configured
                ? `SMS and calls are live from ${status.signalwire.fromNumber || "your from-number"}. Source: ${status.signalwire.source}.`
                : "No complete SignalWire set yet. SMS and click-to-call stay in the log."}
              {status.signalwire.lockedByEnv ? " Railway variables are already set and override this form." : ""}
            </p>
          </div>
          <div>
            <Label htmlFor="signalwire_space">SIGNALWIRE_SPACE</Label>
            <Input
              id="signalwire_space"
              name="signalwire_space"
              className="mt-1.5"
              defaultValue={status.signalwire.space}
              placeholder="your-space.signalwire.com"
            />
          </div>
          <div>
            <Label htmlFor="signalwire_project_id">SIGNALWIRE_PROJECT_ID</Label>
            <Input id="signalwire_project_id" name="signalwire_project_id" type="password" autoComplete="off" className="mt-1.5" placeholder={status.signalwire.projectHint || "Project ID"} />
          </div>
          <div>
            <Label htmlFor="signalwire_api_token">SIGNALWIRE_API_TOKEN</Label>
            <Input id="signalwire_api_token" name="signalwire_api_token" type="password" autoComplete="off" className="mt-1.5" placeholder={status.signalwire.tokenHint || "API token"} />
          </div>
          <div>
            <Label htmlFor="signalwire_from_number">SIGNALWIRE_FROM_NUMBER</Label>
            <Input
              id="signalwire_from_number"
              name="signalwire_from_number"
              className="mt-1.5"
              defaultValue={status.signalwire.fromNumber}
              placeholder="+13412503505"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Messaging webhook: <code className="rounded bg-muted px-1.5 py-0.5">{site.url}/api/signalwire/sms</code>
          </p>
        </section>

        <FormSubmit>Save keys</FormSubmit>
      </form>
    </div>
  );
}
