import { motion } from "framer-motion";
import { QrCode, ShieldCheck, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/context/UserRoleContext";
import { Button } from "@/components/ui/button";

interface RoleCard {
  title: string;
  description: string;
  icon: typeof QrCode;
  path: string;
  role: 'actor' | 'company';
  buttonText: string;
  colorClass: string;
  bgColorClass: string;
}

const roleCards: RoleCard[] = [
  {
    title: "Verified Actor",
    description: "Connect your ERP system and seal supply chain data into ClearPath ledger",
    icon: ShieldCheck,
    path: "/verified-actor-onboarding",
    role: "actor",
    buttonText: "Enter as Actor",
    colorClass: "text-cp-verified",
    bgColorClass: "bg-cp-verified/15",
  },
  {
    title: "Company",
    description: "View all verified supply chain participants and their identities",
    icon: Building2,
    path: "/company-onboarding",
    role: "company",
    buttonText: "Enter as Company",
    colorClass: "text-accent",
    bgColorClass: "bg-accent/15",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { setUserRole } = useUserRole();

  const handleRoleSelect = (role: 'actor' | 'company', path: string) => {
    setUserRole(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with ClearPath branding */}
      <div className="px-6 py-8 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
            <img
              src="/favicon.png"
              alt="ClearPath logo"
              className="w-10 h-10"
            />
          </div>
          <span className="text-3xl font-bold tracking-tight text-foreground">
            ClearPath
          </span>
        </div>
      </div>

      {/* Hero section and role cards */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          {/* Hero section */}
          <div className="text-center space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-foreground"
            >
              Transparent Supply Chain Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Select your role to access the supply chain transparency platform
            </motion.p>
          </div>

          {/* Role selection cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roleCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-card rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className={`p-5 rounded-xl ${card.bgColorClass} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-10 h-10 ${card.colorClass}`} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-foreground">{card.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem]">
                        {card.description}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleRoleSelect(card.role, card.path)}
                      className="w-full mt-2"
                      size="lg"
                    >
                      {card.buttonText}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
