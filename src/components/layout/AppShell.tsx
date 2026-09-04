import { useState, type ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppDrawer } from "./AppDrawer";
import { AppFooter } from "./AppFooter";

export function AppShell({ children, title }: { children: ReactNode; title?: string | undefined }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader onMenuClick={() => setOpen(true)} title={title} />
      <AppDrawer open={open} onClose={() => setOpen(false)} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-14 pt-20 sm:px-6 lg:px-8">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
