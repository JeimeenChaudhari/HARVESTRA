import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Bell, Globe, Shield, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import PageBackground from "@/components/PageBackground";

const Settings = () => {
  return (
    <PageBackground variant="settings">
      <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and app settings</p>
      </div>

      {/* Account Settings */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="farmer@kerala.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Farm Location</Label>
            <Input id="location" placeholder="District, Kerala" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Quest Updates</p>
              <p className="text-sm text-muted-foreground">Get notified about quest progress</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weather Alerts</p>
              <p className="text-sm text-muted-foreground">Receive important weather updates</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Community Activity</p>
              <p className="text-sm text-muted-foreground">Comments and mentions</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketplace Messages</p>
              <p className="text-sm text-muted-foreground">Product inquiries and orders</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Language</Label>
            <p className="text-sm text-muted-foreground">🇬🇧 English (Can be changed in sidebar)</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Date Format</Label>
            <p className="text-sm text-muted-foreground">DD/MM/YYYY (Indian Standard)</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Time Zone</Label>
            <p className="text-sm text-muted-foreground">IST (GMT+5:30)</p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-muted-foreground">Show profile to other farmers</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activity Status</p>
              <p className="text-sm text-muted-foreground">Show when you're online</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <Button variant="outline" className="w-full">Change Password</Button>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            FAQs & Help Center
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Contact Support
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Terms of Service
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Privacy Policy
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="border-2">
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          <p className="mb-1">Harvestra GO v1.0.0</p>
          <p>© 2025 Sustainable Farming Initiative</p>
        </CardContent>
      </Card>
      </div>
    </PageBackground>
  );
};

export default Settings;
