"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Theme, NotificationPreferences } from "@/lib/types";
import ProtectedLayout from "../protected-layout";

export default function SettingsPage() {
  return (
    <ProtectedLayout>
      <ProtectedSettingsContent />
    </ProtectedLayout>
  );
}

function ProtectedSettingsContent() {
  const [theme, setTheme] = useState<Theme>('system');
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    taskReminders: true,
    eventReminders: true,
    dailyDigest: false,
  });

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    // In a real app, you would save this to the user's profile
  };

  const handleNotificationChange = (key: keyof NotificationPreferences, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    // In a real app, you would save this to the user's profile
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Customize the appearance of Origo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Light Mode</Label>
                  <p className="text-sm text-muted-foreground">Clean, bright interface</p>
                </div>
                <Switch 
                  checked={theme === 'light'} 
                  onCheckedChange={(checked) => handleThemeChange(checked ? 'light' : 'system')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Easy on the eyes</p>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={(checked) => handleThemeChange(checked ? 'dark' : 'system')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>System (Default)</Label>
                  <p className="text-sm text-muted-foreground">Matches your OS setting</p>
                </div>
                <Switch 
                  checked={theme === 'system'} 
                  onCheckedChange={(checked) => handleThemeChange(checked ? 'system' : 'light')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Control when you receive alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified about due tasks</p>
                </div>
                <Switch 
                  checked={notifications.taskReminders} 
                  onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified before events</p>
                </div>
                <Switch 
                  checked={notifications.eventReminders} 
                  onCheckedChange={(checked) => handleNotificationChange('eventReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">Summary of your day&rsquo;s activities</p>
                </div>
                <Switch 
                  checked={notifications.dailyDigest} 
                  onCheckedChange={(checked) => handleNotificationChange('dailyDigest', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Account Email</Label>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Export Data</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>About Origo</CardTitle>
            <CardDescription>Your productivity companion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Version</Label>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
              
              <div>
                <Label>Developer</Label>
                <p className="text-sm text-muted-foreground">Origo Team</p>
              </div>
              
              <Button variant="outline">Learn More</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}