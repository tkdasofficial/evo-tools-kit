import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  AuthLayout,
  Field,
  SubmitButton,
  authInputClass,
} from "@/components/auth/AuthLayout";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Hyper Cluster" },
      {
        name: "description",
        content: "Request a secure password reset link for your Hyper Cluster account.",
      },
      { property: "og:title", content: "Reset password — Hyper Cluster" },
      {
        property: "og:description",
        content: "Enter your email and we'll send a secure reset link.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a secure reset link."
      footer={
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="text-center">
          <p className="text-[13px] font-medium">Check your inbox</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            If an account exists for that address, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className={authInputClass}
            />
          </Field>
          <SubmitButton loading={loading}>Send reset link</SubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}
