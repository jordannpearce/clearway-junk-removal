import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 py-20">
      <h1 className="font-heading text-4xl">That page is not on the route</h1>
      <p className="mt-3 text-muted-foreground">
        The Hayward yard is still here. Try the homepage, the city list, or schedule a haul.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/schedule">Schedule</Link>
        </Button>
      </div>
    </div>
  );
}
