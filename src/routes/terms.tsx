import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Hyper Cluster" },
      {
        name: "description",
        content:
          "The terms that govern your use of the Hyper Cluster tool suite: accounts, acceptable use, plans, liability and termination.",
      },
      { property: "og:title", content: "Terms of Service — Hyper Cluster" },
      {
        property: "og:description",
        content: "Accounts, acceptable use, billing and liability terms for Hyper Cluster.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <AppShell title="Terms of Service">
      <LegalPage
        title="Terms of Service"
        intro="By using Hyper Cluster you agree to these terms. Please read them carefully — they set out what you can expect from us and what we expect from you."
        updated="Last updated 4 September 2026"
      >
        <LegalSection title="1. Acceptance">
          <p>
            Using the website or any tool in the suite means you accept these terms. If you do not
            agree, please stop using the service.
          </p>
        </LegalSection>
        <LegalSection title="2. Your account">
          <p>
            You are responsible for keeping your credentials secure and for all activity under your
            account. Tell us promptly if you believe your account has been compromised.
          </p>
        </LegalSection>
        <LegalSection title="3. Acceptable use">
          <p>
            Do not use Hyper Cluster to process content you have no right to use, to infringe
            intellectual property, to create unlawful or harmful material, or to attempt to disrupt,
            reverse engineer or overload the service.
          </p>
        </LegalSection>
        <LegalSection title="4. Your content">
          <p>
            You keep all rights to the files you process. Because processing happens in your browser,
            we do not claim any licence over your content and do not store it.
          </p>
        </LegalSection>
        <LegalSection title="5. Plans and billing">
          <p>
            Paid plans are billed in advance for the period you select and renew automatically until
            cancelled. You can cancel at any time and keep access until the end of the paid period.
            Fees already paid are non-refundable except where required by law.
          </p>
        </LegalSection>
        <LegalSection title="6. Availability">
          <p>
            We work to keep the service available and accurate, but it is provided on an "as is"
            basis without warranties. Features may change, and maintenance may cause short
            interruptions.
          </p>
        </LegalSection>
        <LegalSection title="7. Limitation of liability">
          <p>
            To the maximum extent permitted by law, Hyper Cluster is not liable for indirect or
            consequential losses, lost data or lost profits. Our total liability is limited to the
            amount you paid in the twelve months before the claim.
          </p>
        </LegalSection>
        <LegalSection title="8. Termination">
          <p>
            You may stop using the service at any time. We may suspend or end access if these terms
            are breached or if required for legal or security reasons.
          </p>
        </LegalSection>
        <LegalSection title="9. Changes">
          <p>
            We may update these terms as the service evolves. Material changes will be reflected in
            the date above, and continued use means you accept the revised terms.
          </p>
        </LegalSection>
      </LegalPage>
    </AppShell>
  );
}
