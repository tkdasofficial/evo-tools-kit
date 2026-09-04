import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import {
  AuthLayout,
  Checkbox,
  Divider,
  Field,
  GoogleButton,
  SubmitButton,
  authInputClass,
} from "@/components/auth/AuthLayout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Hyper Cluster" },
      {
        name: "description",
        content: "Create your free Hyper Cluster account to sync tool settings across devices.",
      },
      { property: "og:title", content: "Create account — Hyper Cluster" },
      {
        property: "og:description",
        content: "Sign up with email or Google and start using the Hyper Cluster tool suite.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => setLoading(false), 700);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free to start. No card required."
      footer={
        <span>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-medium text-foreground hover:underline">
            Log in
          </Link>
        </span>
      }
    >
      <form onSubmit={submit} className="mt-7 space-y-4">
        <Field label="Full name">
          <input
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Cooper"
            className={authInputClass}
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={authInputClass}
          />
        </Field>

        <Field label="Password">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={cn(authInputClass, "pr-10")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        <div className="space-y-2.5 rounded-lg border border-border bg-muted/40 p-3.5">
          <Checkbox checked={terms} onChange={setTerms}>
            I agree to the <span className="font-medium text-foreground">Terms of Service</span>
          </Checkbox>
          <Checkbox checked={privacy} onChange={setPrivacy}>
            I agree to the <span className="font-medium text-foreground">Privacy Policy</span>
          </Checkbox>
        </div>

        <SubmitButton loading={loading} disabled={!terms || !privacy}>
          Create account
        </SubmitButton>
      </form>

      <Divider />
      <GoogleButton label="Continue with Google" />
    </AuthLayout>
  );
}
