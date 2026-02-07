import { Shield, Bell, Key, Globe } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your ClearPath workspace</p>
      </div>

      <div className="space-y-4">
        {[
          { icon: Shield, title: "Security", desc: "Manage cryptographic keys and verification settings" },
          { icon: Bell, title: "Notifications", desc: "Configure alerts for supply chain events" },
          { icon: Key, title: "API Keys", desc: "Manage API access tokens for integrations" },
          { icon: Globe, title: "Regions", desc: "Configure supported regions and compliance zones" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-muted">
              <item.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
