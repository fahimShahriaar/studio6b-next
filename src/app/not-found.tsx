import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="font-serif text-6xl font-semibold">404</h1>
      <p className="text-muted-foreground">
        Sorry, we couldn&apos;t find that page.
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Back to home
      </Link>
    </div>
  );
}
