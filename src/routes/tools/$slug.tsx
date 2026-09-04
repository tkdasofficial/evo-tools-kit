import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { getTool } from "@/lib/tools";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { name: tool.name, description: tool.description };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Tool"} — Hyper Cluster` },
      { name: "description", content: loaderData?.description ?? "Hyper Cluster utility tool." },
      { property: "og:title", content: `${loaderData?.name ?? "Tool"} — Hyper Cluster` },
      { property: "og:description", content: loaderData?.description ?? "Hyper Cluster tool." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ToolPage,
});

function ToolPage() {
  const { slug } = Route.useParams();
  const tool = getTool(slug)!;
  return (
    <AppShell title={tool.name}>
      <ToolWorkspace tool={tool} />
    </AppShell>
  );
}
