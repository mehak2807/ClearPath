import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Building2 } from "lucide-react";
import { batches } from "@/data/mockData";

const allActors = batches[0].journey.map((e) => e.actor);

const Actors = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Verified Actors</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          All supply chain participants with verified identities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allActors.map((actor, i) => (
          <motion.div
            key={actor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{actor.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm truncate">{actor.name}</h3>
                  {actor.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                </div>
                <p className="text-xs text-primary font-medium mt-0.5">{actor.role}</p>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> {actor.organization}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> {actor.location}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-cp-verified/15 text-cp-verified text-[11px] font-medium">
                    Verified
                  </span>
                  <span className="text-[10px] font-mono text-cp-crypto">{actor.id}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Actors;
