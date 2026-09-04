import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Account settings — Hyper Cluster" },
      {
        name: "description",
        content:
          "Manage your Hyper Cluster account preferences, default tool settings and notifications.",
      },
      { property: "og:title", content: "Account settings — Hyper Cluster" },
      {
        property: "og:description",
        content: "Manage your account preferences and default tool settings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="Settings">
      <h1 className="text-[22px] font-semibold tracking-tight">Account settings</h1>
      <p className="mt-1.5 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
        Preferences for your account, default tool options and notifications will appear here once
        accounts are connected.
      </p>

      <div className="mt-6 space-y-3">
        {[
          { label: "Profile", hint: "Name, email and avatar" },
          { label: "Default tool settings", hint: "Formats, quality and output naming" },
          { label: "Notifications", hint: "Product updates and processing alerts" },
          { label: "Security", hint: "Password and active sessions" },
        ].map((row) => (
          <div
            key={row.label}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <p className="text-[13px] font-medium">{row.label}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{row.hint}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
