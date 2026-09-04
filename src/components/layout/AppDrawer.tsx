import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { X, LayoutGrid } from "lucide-react";
import { tools, toolGroups } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";

export function AppDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tool navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[84%] max-w-xs flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border pl-4 pr-2">
          <span className="flex items-center gap-2">
            <BrandMark />
            <span className="font-display text-base font-semibold tracking-tight">
              Hyper Cluster
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="inline-flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavItem
            to="/"
            active={pathname === "/"}
            onClick={onClose}
            icon={<LayoutGrid className="size-4" />}
            label="All tools"
          />

          {toolGroups.map((group) => (
            <div key={group} className="mt-6">
              <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {group}
              </p>
              <ul className="space-y-0.5">
                {tools
                  .filter((t) => t.group === group)
                  .map((tool) => {
                    const to = `/tools/${tool.slug}`;
                    const Icon = tool.icon;
                    return (
                      <li key={tool.slug}>
                        <NavItem
                          to={to}
                          active={pathname === to}
                          onClick={onClose}
                          icon={<Icon className="size-4" />}
                          label={tool.name}
                        />
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

function NavItem({
  to,
  active,
  onClick,
  icon,
  label,
}: {
  to: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
