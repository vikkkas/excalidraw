"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Pencil, ArrowLeft, User } from "lucide-react";
import Link from "next/link";

// Dynamically import Excalidraw to avoid SSR issues
const ExcalidrawCanvas = dynamic(
  () => import("@/components/ExcalidrawCanvas").then((mod) => ({ default: mod.ExcalidrawCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-lg font-sketch animate-pulse">Loading canvas...</div>
      </div>
    ),
  }
);

function DrawPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomSlug = searchParams.get("room");
  const [user, setUser] = useState<any>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    const guestNameStored = localStorage.getItem("guestName");
    
    if (userStr) {
      // Logged in user
      setUser(JSON.parse(userStr));
    } else if (guestNameStored) {
      // Guest with name already set
      setUser({ name: guestNameStored, isGuest: true });
    } else {
      // New guest - show name prompt
      setShowNamePrompt(true);
    }
  }, [router]);

  const handleGuestJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    // Store guest name
    localStorage.setItem("guestName", guestName);
    setUser({ name: guestName, isGuest: true });
    setShowNamePrompt(false);
  };

  if (!roomSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-sketch mb-4">No Room Specified</h1>
          <p className="text-muted-foreground mb-4 font-mono">Please select a room from the dashboard</p>
          <Button
            onClick={() => router.push("/canvas")}
            className="font-sketch"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show name prompt for guests
  if (showNamePrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

        <Card className="w-full max-w-md p-8 space-y-6 border-2 border-border/50 backdrop-blur-sm bg-card/80">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pencil className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-sketch text-foreground mb-2">Join Canvas Room</h1>
            <p className="text-muted-foreground font-mono text-sm">Enter your name to start collaborating</p>
          </div>

          <form onSubmit={handleGuestJoin} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2 font-mono">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg font-sans"
                autoFocus
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!guestName.trim()}
              className="w-full h-12 text-lg font-sketch"
            >
              Join Room
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-3 font-mono">
              Already have an account?
            </p>
            <Button
              variant="link"
              onClick={() => router.push("/signin")}
              className="text-primary font-medium text-sm"
            >
              Sign in instead
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/40 px-4 py-2 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(user?.isGuest ? "/" : "/canvas")}
            className="text-muted-foreground hover:text-foreground font-mono text-xs sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {user?.isGuest ? "Home" : "Dashboard"}
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-base font-bold font-sketch flex items-center gap-2">
            <span className="text-muted-foreground font-mono font-normal text-xs uppercase tracking-wider">Room:</span>
            {roomSlug}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {user?.isGuest && (
            <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 rounded font-mono">
              Guest
            </span>
          )}
          <div className="flex items-center gap-2 text-sm text-foreground font-medium">
            <User className="h-4 w-4 text-muted-foreground" />
            {user?.name}
          </div>
        </div>
      </header>

      {/* Canvas Area */}
      <main className="flex-1 overflow-hidden">
        <ExcalidrawCanvas roomSlug={roomSlug} />
      </main>
    </div>
  );
}

export default function DrawPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-lg font-sketch animate-pulse">Loading...</div>
      </div>
    }>
      <DrawPageContent />
    </Suspense>
  );
}
