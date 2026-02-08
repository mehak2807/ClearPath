import { Package, Users, ShieldCheck, Activity } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { activityData } from "@/data/mockData";
import { motion } from "framer-motion";
import { useBatches } from "@/context/BatchContext";

const StatCards = () => {
  const { batches } = useBatches();
  
  // Calculate total batches dynamically
  const totalBatches = batches.length;
  
  // Calculate active actors from unique actors in journey events
  const uniqueActors = new Set<string>();
  batches.forEach(batch => {
    batch.journey.forEach(event => {
      uniqueActors.add(event.actor.id);
    });
  });
  const activeActors = uniqueActors.size;
  
  const cards = [
    {
      title: "Total Batches",
      value: totalBatches.toString(),
      change: "Dynamic count",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Actors",
      value: activeActors.toString(),
      change: "Unique verified actors",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{card.change}</p>
        </motion.div>
      ))}

      {/* Activity Chart Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border p-5"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm text-muted-foreground">Real-Time Activity</p>
            <p className="text-2xl font-bold text-foreground mt-1">42</p>
          </div>
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Activity className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="h-12 mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(215, 80%, 52%)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Security Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl border border-border p-5"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Security Status</p>
            <p className="text-lg font-semibold text-cp-verified mt-1">All Verified</p>
          </div>
          <div className="p-2.5 rounded-lg bg-cp-verified/10 animate-pulse-glow">
            <ShieldCheck className="w-5 h-5 text-cp-verified" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">All Data Cryptographically Verified</p>
      </motion.div>
    </div>
  );
};

export default StatCards;
