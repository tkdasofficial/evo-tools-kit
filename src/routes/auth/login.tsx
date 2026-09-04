import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import {
  AuthLayout,
  Divider,
  Field,
  GoogleButton,
  SubmitButton,
  authInputClass,
} from "@/components/auth/AuthLayout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Log in — Hyper Cluster" },
      {
        name: "description",
        content: "Sign in to your Hyper Cluster workspace to continue working with your tools.",
      },
      { property: "og:title", content: "Log in — Hyper Cluster" },
      {
        property: "og:description",
        content: "Access your Hyper Cluster account with email or Google.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => setLoading(false), 700);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your workspace."
      footer={
        <span>
          New here?{" "}
          <Link to="/auth/signup" className="font-medium text-foreground hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
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

        <Field
          label="Password"
          action={
            <Link
              to="/auth/forgot-password"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot Password
            </Link>
          }
        >
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="current-password"
              placeholder="Enter your password"
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

        <SubmitButton loading={loading}>Log in</SubmitButton>
      </form>

      <Divider />
      <GoogleButton label="Continue with Google" />
    </AuthLayout>
  );
}
