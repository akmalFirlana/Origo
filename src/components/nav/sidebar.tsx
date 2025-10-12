"use client";

import { Home, Calendar, CheckSquare, CalendarDays, Activity, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    { icon: CalendarDays, label: "Habits", href: "/habits" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Activity, label: "Activity", href: "/activity" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="w-64 border-r bg-background h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Origo</h1>
        <p className="text-xs text-muted-foreground">Productivity App</p>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Origo</p>
      </div>
    </div>
  );
}