import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

import { auth, signOut } from "@/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-muted/20 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r bg-background lg:flex lg:flex-col">
        <div className="border-b p-4">
          <Link href="/admin" className="text-lg font-semibold">
            Studio 6B
          </Link>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AdminNav />
        </div>
        <div className="border-t p-3">
          <p className="mb-2 px-3 text-xs text-muted-foreground">
            {session.user.email}
          </p>
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b bg-background px-4 py-3 lg:hidden">
          <Link href="/admin" className="font-semibold">
            Studio 6B Admin
          </Link>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="size-4" />
            </Button>
          </form>
        </header>
        {/* Mobile nav */}
        <div className="border-b bg-background lg:hidden">
          <AdminNav />
        </div>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
