import { Link } from "@tanstack/react-router";
import { Menu, User } from "lucide-react";

export function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-2 sm:px-4 lg:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent active:bg-accent"
        >
          <Menu className="size-5" strokeWidth={2} />
        </button>

        <div className="flex-1" />

        <Link
          to="/auth/signup"
          aria-label="Sign up or sign in"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent active:bg-accent"
        >
          <User className="size-[18px]" strokeWidth={2} />
        </Link>
      </div>
    </header>
  );
}
