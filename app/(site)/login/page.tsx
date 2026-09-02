import { loginAction, registerAction } from "@/lib/actions";
import { demoAccounts } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = pageMeta({
  title: "Sign in",
  description: "Customer and team sign in for Clearway job tracking, dispatch, and appointment changes.",
  path: "/login",
});

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const query = await searchParams;
  const error = typeof query.error === "string" ? query.error : "";

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="font-heading text-4xl">Sign in to your jobs</h1>
      <p className="mt-4 text-muted-foreground">
        Customers track, edit, and cancel hauls. Dispatchers and technicians open the operations board. Demo accounts are included so you can try both sides on this local site.
      </p>
      {error ? <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      <Tabs defaultValue="signin" className="mt-8">
        <TabsList>
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="register">Create customer account</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <form action={loginAction} className="mt-4 space-y-4 rounded-3xl border border-border bg-card p-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="mt-1.5" />
            </div>
            <Button type="submit">Sign in</Button>
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
            <Button type="submit">Create account</Button>
          </form>
        </TabsContent>
      </Tabs>
      <div className="mt-6 rounded-2xl bg-secondary/70 p-4 text-sm leading-relaxed">
        <p className="font-medium">Demo logins</p>
        <p className="mt-2">Customer: {demoAccounts.customer.email} / {demoAccounts.customer.password}</p>
        <p>Dispatch: {demoAccounts.ops.email} / {demoAccounts.ops.password}</p>
        <p>Technician: {demoAccounts.tech.email} / {demoAccounts.tech.password}</p>
      </div>
    </div>
  );
}
