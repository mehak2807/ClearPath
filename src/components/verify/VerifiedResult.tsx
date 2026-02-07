import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Fingerprint,
  ChevronDown,
  ChevronRight,
  User,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";
import { Batch } from "@/data/mockData";
import productImage from "@/assets/product-coffee.jpg";
import avatarMap from "@/data/avatarMap";

const sections = [
  { key: "origin", label: "Origin", range: "Nodes 1-4" },
  { key: "transit", label: "Global Transit", range: "Nodes 5-8" },
  { key: "final", label: "Final Product", range: "Nodes 9-12" },
] as const;

interface VerifiedResultProps {
  batch: Batch;
}

const VerifiedResult = ({ batch }: VerifiedResultProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["origin"])
  );

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const groupedEvents = batch.journey.reduce(
    (acc, event) => {
      acc[event.section] = acc[event.section] || [];
      acc[event.section].push(event);
      return acc;
    },
    {} as Record<string, typeof batch.journey>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Verified Badge */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-cp-verified/10 border border-cp-verified/30 rounded-xl p-4 text-center glow-verified"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-cp-verified" />
          <span className="text-sm font-bold text-cp-verified uppercase tracking-wide">
            100% Secure & Verified
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Scanned at 14:02 IST | Location: Delhi Retail Store
        </p>
      </motion.div>

      {/* Product Card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <img
            src={productImage}
            alt={batch.productName}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <p className="font-mono text-xs text-muted-foreground">#{batch.id}</p>
            <h2 className="text-lg font-bold text-foreground">{batch.productName}</h2>
            <p className="text-sm text-muted-foreground">{batch.origin}</p>
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Product Journey</h3>
          <p className="text-xs text-muted-foreground">
            {batch.journey.length} verified events
          </p>
        </div>

        <div className="p-4 space-y-2">
          {sections.map((section) => {
            const events = groupedEvents[section.key];
            if (!events?.length) return null;
            const isExpanded = expandedSections.has(section.key);

            return (
              <div key={section.key}>
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {section.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({section.range})
                  </span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2 space-y-4">
                        {events.map((event) => {
                          const avatar = avatarMap[event.actor.id];
                          return (
                            <div key={event.id} className="relative">
                              {/* Timeline dot */}
                              <div className="absolute -left-[21px] top-2 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                              </div>

                              <div className="bg-muted/30 rounded-lg p-3.5 border border-border/50 space-y-2">
                                {/* Actor row */}
                                <div className="flex items-center gap-3">
                                  {avatar ? (
                                    <img
                                      src={avatar}
                                      alt={event.actor.name}
                                      className="w-9 h-9 rounded-full object-cover ring-2 ring-border"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">
                                      <User className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-medium text-foreground">
                                        {event.actor.name}
                                      </span>
                                      {event.actor.verified && (
                                        <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                                      )}
                                    </div>
                                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                      {event.actor.role}
                                    </span>
                                  </div>
                                </div>

                                {/* Action */}
                                <p className="text-sm font-medium text-foreground">
                                  {event.action}
                                </p>

                                {/* Location & Time */}
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {event.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {event.timestamp}
                                  </span>
                                </div>

                                {/* Data Points */}
                                {event.dataPoints && (
                                  <div className="bg-muted/50 rounded px-3 py-2 text-xs text-muted-foreground">
                                    {Object.entries(event.dataPoints)
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(", ")}
                                  </div>
                                )}

                                {/* Digital Signature */}
                                <div className="flex items-center gap-1.5 text-[11px] text-cp-crypto font-mono pt-1 border-t border-border/30">
                                  <Fingerprint className="w-3 h-3" />
                                  <span>
                                    DIGITAL SIGNATURE: {event.digitalSignature}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default VerifiedResult;
