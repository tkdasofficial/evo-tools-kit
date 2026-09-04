import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-block size-7 shrink-0 overflow-hidden rounded-md",
        className,
      )}
    >
      <img
        src="/brand/logo-light.svg"
        alt=""
        aria-hidden
        className="size-full object-cover dark:hidden"
      />
      <img
        src="/brand/logo-dark.svg"
        alt=""
        aria-hidden
        className="hidden size-full object-cover dark:block"
      />
    </span>
  );
}
