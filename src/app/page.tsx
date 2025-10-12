"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (isLoaded && isSignedIn) {
    return null; // Or a loading state while redirecting
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Origo Productivity App</h1>
        <p className="text-muted-foreground mb-6">Please sign in to continue</p>
        <Link
          href="/sign-in"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 inline-block"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}