import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Hyper Cluster" },
      {
        name: "description",
        content:
          "How Hyper Cluster handles your files, account details and analytics — including local, in-browser processing of uploads.",
      },
      { property: "og:title", content: "Privacy Policy — Hyper Cluster" },
      {
        property: "og:description",
        content: "What data Hyper Cluster collects, how it is used, and the choices you have.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AppShell title="Privacy Policy">
      <LegalPage
        title="Privacy Policy"
        intro="This policy explains what information Hyper Cluster collects, why it is collected, and how you stay in control of it."
        updated="Last updated 4 September 2026"
      >
        <LegalSection title="1. Files you process">
          <p>
            Files you select in a tool are processed in your browser on your own device. They are not
            uploaded to our servers, are not stored by us, and are discarded from memory when you
            close or reload the page.
          </p>
          <p>
            Because processing is local, we cannot recover a file for you. Always keep your original
            copy until you have downloaded the result you want.
          </p>
        </LegalSection>
        <LegalSection title="2. Account information">
          <p>
            If you create an account we store your email address, an encrypted password credential,
            and basic account timestamps. We use this only to sign you in, secure your account and
            send essential service messages.
          </p>
        </LegalSection>
        <LegalSection title="3. Usage analytics">
          <p>
            We collect aggregated, non-identifying usage data — which tools are opened, error rates
            and performance timings — to fix problems and decide what to improve. This data is not
            linked to the contents of your files.
          </p>
        </LegalSection>
        <LegalSection title="4. Cookies and local storage">
          <p>
            We use strictly necessary cookies and browser storage to keep you signed in and to
            remember interface preferences. We do not use advertising cookies or sell data to
            advertisers.
          </p>
        </LegalSection>
        <LegalSection title="5. Service providers">
          <p>
            Hosting, authentication and email delivery are handled by infrastructure providers acting
            on our instructions. They may process account data solely to deliver those services.
          </p>
        </LegalSection>
        <LegalSection title="6. Your rights">
          <p>
            You may request access to, correction of, or deletion of your account data at any time.
            Deleting your account removes your profile and associated records from our systems.
          </p>
        </LegalSection>
        <LegalSection title="7. Children">
          <p>
            Hyper Cluster is not directed at children under 13, and we do not knowingly collect their
            personal information.
          </p>
        </LegalSection>
        <LegalSection title="8. Changes and contact">
          <p>
            We will update this page when our practices change and revise the date above. For any
            privacy question, contact us and we will respond within a reasonable period.
          </p>
        </LegalSection>
      </LegalPage>
    </AppShell>
  );
}
