import type { ReactNode } from "react";

export function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl">
      <header>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{intro}</p>
        {updated && (
          <p className="mt-3 inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            {updated}
          </p>
        )}
      </header>
      <div className="mt-8 space-y-6">{children}</div>
    </article>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card px-5 py-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 space-y-3 text-[13px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
