import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  User,
  UserPlus,
  LogIn,
  Settings,
  ScrollText,
  Shield,
  HelpCircle,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accounts are not connected yet, so nobody is signed in.
 * When auth is wired up, replace this with the real session state.
 */
export function useIsSignedIn() {
  return false;
}

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const signedIn = useIsSignedIn();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent active:bg-accent",
          open && "bg-accent",
        )}
      >
        <User className="size-[18px]" strokeWidth={2} />
      </button>

      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          "absolute right-0 top-12 z-50 w-60 origin-top-right overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg transition-all duration-150",
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {signedIn ? (
          <MenuLink to="/settings" onClick={close} icon={<Settings className="size-4" />}>
            Settings
          </MenuLink>
        ) : (
          <>
            <MenuLink to="/auth/signup" onClick={close} icon={<UserPlus className="size-4" />}>
              Sign up
            </MenuLink>
            <MenuLink to="/auth/login" onClick={close} icon={<LogIn className="size-4" />}>
              Log in
            </MenuLink>
          </>
        )}

        <span className="my-1.5 block h-px bg-border" />

        <MenuLink to="/pricing" onClick={close} icon={<Tag className="size-4" />}>
          Pricing
        </MenuLink>
        <MenuLink to="/faq" onClick={close} icon={<HelpCircle className="size-4" />}>
          FAQ
        </MenuLink>
        <MenuLink to="/privacy" onClick={close} icon={<Shield className="size-4" />}>
          Privacy Policy
        </MenuLink>
        <MenuLink to="/terms" onClick={close} icon={<ScrollText className="size-4" />}>
          Terms of Service
        </MenuLink>
      </div>
    </div>
  );
}

function MenuLink({
  to,
  onClick,
  icon,
  children,
}: {
  to: string;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className="flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{children}</span>
    </Link>
  );
}
