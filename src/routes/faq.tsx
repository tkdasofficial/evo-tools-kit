import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

const faqs = [
  {
    q: "Are my files uploaded to a server?",
    a: "No. Every tool processes your file inside your browser on your own device. Nothing is sent to us, and nothing is stored after you close the page.",
  },
  {
    q: "Do I need an account to use the tools?",
    a: "No. All ten tools are available without signing in. An account only adds saved preferences, history and the higher limits included in paid plans.",
  },
  {
    q: "What file sizes are supported?",
    a: "Limits are shown on each tool — typically 20MB for images, 50MB for audio and 200MB for video-based tools. Larger files depend on your device's available memory.",
  },
  {
    q: "Will compression or resizing reduce quality?",
    a: "Default settings are tuned so the change is not visible at normal viewing size. You can always compare the preview before downloading and dial the quality back up.",
  },
  {
    q: "Can I use the results commercially?",
    a: "Yes. You keep full rights to everything you process. We claim no licence over your files or outputs.",
  },
  {
    q: "Does it work on a phone?",
    a: "Yes. The interface is built mobile-first and works in any modern mobile or desktop browser. Very large files are easier to handle on a desktop.",
  },
  {
    q: "How do I cancel a paid plan?",
    a: "Cancel any time from your account settings. You keep access until the end of the period you have already paid for.",
  },
  {
    q: "Something produced an unexpected result — what should I do?",
    a: "Reset the settings to their defaults and try again with the original, uncompressed file. If it still looks wrong, contact us with the tool name and file type.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Hyper Cluster tool suite" },
      {
        name: "description",
        content:
          "Answers about file privacy, size limits, output quality, accounts and billing for the Hyper Cluster tool suite.",
      },
      { property: "og:title", content: "FAQ — Hyper Cluster tool suite" },
      {
        property: "og:description",
        content: "Common questions about privacy, limits, quality, accounts and plans.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <AppShell title="FAQ">
      <div className="mx-auto w-full max-w-3xl">
        <header>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            Frequently asked questions
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Everything about privacy, limits, output quality and plans — in short answers.
          </p>
        </header>

        <div className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {faqs.map((faq) => (
            <details key={faq.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-[14px] font-medium">
                <span>{faq.q}</span>
                <span className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
