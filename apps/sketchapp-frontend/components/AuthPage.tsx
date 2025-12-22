"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignin) {
        // Sign in
        const response = await authAPI.signin({
          username: email,
          password: password,
        });

        // Store tokens and user data
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));

        toast.success("Signed in successfully");
        // Redirect to canvas or rooms page
        router.push("/canvas");
      } else {
        // Sign up
        const response = await authAPI.signup({
          username: email,
          password: password,
          name: name,
        });

        // Store tokens and user data
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));

        toast.success("Account created successfully");
        // Redirect to canvas or rooms page
        router.push("/canvas");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
       {/* Background decoration */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <Card className="w-full max-w-md p-8 space-y-6 border-2 border-border/50 backdrop-blur-sm bg-card/80">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <Pencil className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold font-sketch">Sketch Sync</span>
          </Link>
          <h1 className="text-3xl font-bold font-sketch text-foreground">
            {isSignin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-mono">
            {isSignin
              ? "Sign in to continue to your canvas"
              : "Sign up to start collaborating"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-1 font-mono"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isSignin}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition font-sans"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1 font-mono"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition font-sans"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-1 font-mono"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition font-sans"
              placeholder="••••••••"
            />
            {!isSignin && (
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                Must be at least 6 characters
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-mono">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-lg font-sketch"
          >
            {loading
              ? "Please wait..."
              : isSignin
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm font-mono">
          <span className="text-muted-foreground">
            {isSignin ? "Don't have an account?" : "Already have an account?"}
          </span>{" "}
          <Link
            href={isSignin ? "/signup" : "/signin"}
            className="text-primary hover:underline font-medium"
          >
            {isSignin ? "Sign up" : "Sign in"}
          </Link>
        </div>
      </Card>
    </div>
  );
}
