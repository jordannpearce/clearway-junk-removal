import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function FormSubmit({
  children,
  className,
  variant = "default",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "xs" | "sm" | "lg";
}) {
  return (
    <button type="submit" className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </button>
  );
}
