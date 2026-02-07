import { motion } from "framer-motion";
import { QrCode, ShieldCheck, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoleCard {
  title: string;
  description: string;
  icon: typeof QrCode;
  path: string;
  colorClass: string;
  bgColorClass: string;
}

const roleCards: RoleCard[] = [
  {
    title: "Consumer",
    description: "Scan QR codes to verify product authenticity and trace supply chain journey",
    icon: QrCode,
    path: "/verify",
    colorClass: "text-primary",
    bgColorClass: "bg-primary/15",
  },
  {
    title: "Verified Actor",
    description: "Manage verified identities and track supply chain participants",
    icon: ShieldCheck,
    path: "/actors",
    colorClass: "text-cp-verified",
    bgColorClass: "bg-cp-verified/15",
  },
  {
    title: "Company",
    description: "Access ERP integration, inventory management, and dashboard analytics",
    icon: Building2,
    path: "/",
    colorClass: "text-accent",
    bgColorClass: "bg-accent/15",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome to ClearPath</h1>
        <p className="text-sm text-muted-foreground">
          Select your role to access the supply chain transparency platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {roleCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(card.path)}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-xl ${card.bgColorClass} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${card.colorClass}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
