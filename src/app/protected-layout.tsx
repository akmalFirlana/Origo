"use client";

import { Sidebar } from "@/components/nav/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect non-authenticated users away from protected layout
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show nothing while checking auth status or redirecting
  if (!isLoaded || (!isSignedIn && isLoaded)) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <header className="border-b p-4 flex justify-end gap-2">
          <ThemeToggle />
          <SignedOut>
            <SignInButton>
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}