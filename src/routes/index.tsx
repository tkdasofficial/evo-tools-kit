import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { tools, toolGroups } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hyper Cluster — 10 fast utility tools in one suite" },
      {
        name: "description",
        content:
          "Hyper Cluster is a minimalist micro-SaaS suite: audio enhancing, image editing, data conversion and design utilities in one clean workspace.",
      },
      { property: "og:title", content: "Hyper Cluster — 10 fast utility tools in one suite" },
      {
        property: "og:description",
        content: "Audio, image, data and design micro-tools in one clean, mobile-first workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <section className="pb-8">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Ten sharp utilities. One quiet workspace.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Media, data and design chores handled in seconds — no setup, no clutter.
        </p>
      </section>

      <div className="space-y-10">
        {toolGroups.map((group) => (
          <section key={group}>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {group}
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {tools
                .filter((t) => t.group === group)
                .map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      to="/tools/$slug"
                      params={{ slug: tool.slug }}
                      className="flex flex-col bg-card p-5 transition-colors hover:bg-accent"
                    >
                      <Icon className="size-5" strokeWidth={1.75} />
                      <h3 className="mt-4 text-sm font-medium tracking-tight">{tool.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {tool.description}
                      </p>
                    </Link>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
