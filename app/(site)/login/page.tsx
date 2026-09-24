import { loginAction, registerAction } from "@/lib/actions";
import { hasStaffAccount } from "@/lib/accounts";
import { pageMeta } from "@/lib/seo";
import { FormSubmit } from "@/components/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Sign in",
  description: "Customer and team sign in for Clearway job tracking, dispatch, and appointment changes.",
  path: "/login",
});

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : "";
  const staffReady = await hasStaffAccount();

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="font-heading text-4xl">Sign in to your jobs</h1>
      <p className="mt-4 text-muted-foreground">
        Customers track, edit, and cancel hauls. Dispatchers and technicians open the operations board. Admins manage people, email, SMS, and call tracking.
      </p>
      {error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      {!staffReady ? (
        <p className="mt-4 rounded-xl bg-secondary p-3 text-sm">
          No staff account exists yet.{" "}
          <Link href="/admin/setup" className="underline">
            Create the first admin
          </Link>
          .
        </p>
      ) : null}
      <Tabs defaultValue="signin" className="mt-8">
        <TabsList>
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="register">Create customer account</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <form action={loginAction} className="mt-4 space-y-4 rounded-3xl border border-border bg-card p-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="username" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1.5" />
            </div>
            <FormSubmit>Sign in</FormSubmit>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form action={registerAction} className="mt-4 space-y-4 rounded-3xl border border-border bg-card p-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="reg-email">Email</Label>
              <Input id="reg-email" name="email" type="email" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="reg-phone">Phone</Label>
              <Input id="reg-phone" name="phone" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="reg-password">Password</Label>
              <Input id="reg-password" name="password" type="password" required className="mt-1.5" />
            </div>
            <FormSubmit>Create account</FormSubmit>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
