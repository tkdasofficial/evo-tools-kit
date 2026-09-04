import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { ProfileMenu } from "./ProfileMenu";

export function AppHeader({
  onMenuClick,
  title,
}: {
  onMenuClick: () => void;
  title?: string | undefined;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-1 px-2 sm:px-4 lg:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent active:bg-accent"
        >
          <Menu className="size-5" strokeWidth={2} />
        </button>

        {title ? (
          <h2 className="min-w-0 flex-1 truncate px-1 text-[15px] font-semibold tracking-tight sm:text-base">
            {title}
          </h2>
        ) : (
          <Link to="/" className="flex min-w-0 flex-1 items-center px-1">
            <span className="font-display truncate text-[15px] font-semibold tracking-tight">
              Hyper Cluster
            </span>
          </Link>
        )}

        <ProfileMenu />
      </div>
    </header>
  );
}
