"use client";

import { useEffect } from "react";
import { initializeNotificationSystem } from "@/lib/notifications";

// Client component to handle notification initialization
export default function NotificationProvider() {
  useEffect(() => {
    // Initialize notification system
    initializeNotificationSystem();
  }, []);

  return null; // This component doesn't render anything
}