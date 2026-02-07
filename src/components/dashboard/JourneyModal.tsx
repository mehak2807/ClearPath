import { X, CheckCircle2, MapPin, Clock, Fingerprint } from "lucide-react";
import { Batch, JourneyEvent } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface JourneyModalProps {
  batch: Batch | null;
  onClose: () => void;
}

const sectionLabels = {
  origin: "Origin (Nodes 1–4)",
  transit: "Global Transit (Nodes 5–8)",
  final: "Final Product (Nodes 9–12)",
};

const JourneyModal = ({ batch, onClose }: JourneyModalProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["origin", "transit", "final"]));

  if (!batch) return null;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const groupedEvents = batch.journey.reduce(
    (acc, event) => {
      acc[event.section] = acc[event.section] || [];
      acc[event.section].push(event);
      return acc;
    },
    {} as Record<string, JourneyEvent[]>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-start justify-between">
            <div>
              <p className="text-xs font-mono text-muted-foreground">#{batch.id}</p>
              <h2 className="text-lg font-bold text-foreground mt-0.5">{batch.productName}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Origin: {batch.origin} · {batch.journey.length} verified events
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Journey Timeline */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
            {batch.journey.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No journey events recorded yet.</p>
            ) : (
              Object.entries(sectionLabels).map(([key, label]) => {
                const events = groupedEvents[key];
                if (!events?.length) return null;
                const isExpanded = expandedSections.has(key);
                return (
                  <div key={key} className="mb-4">
                    <button
                      onClick={() => toggleSection(key)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors mb-2"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {isExpanded ? "▼" : "▶"} {label}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        ({events.length} events)
                      </span>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="relative ml-4 border-l-2 border-border pl-6 space-y-5">
                            {events.map((event, i) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative"
                              >
                                {/* Timeline dot */}
                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-cp-verified/20 flex items-center justify-center">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cp-verified" />
                                </div>

                                {/* Event content */}
                                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                                  <div className="flex items-start gap-3">
                                    <span className="text-2xl">{event.actor.avatar}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-sm text-foreground">{event.actor.name}</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span className="text-xs text-muted-foreground">{event.actor.role}</span>
                                      </div>
                                      <p className="text-sm font-medium text-foreground mt-1">{event.action}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{event.details}</p>

                                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" /> {event.timestamp}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <MapPin className="w-3 h-3" /> {event.location}
                                        </span>
                                      </div>

                                      {event.dataPoints && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {Object.entries(event.dataPoints).map(([k, v]) => (
                                            <span key={k} className="px-2 py-0.5 rounded bg-muted text-[11px] text-muted-foreground">
                                              {k}: <span className="font-medium text-foreground">{v}</span>
                                            </span>
                                          ))}
                                        </div>
                                      )}

                                      {/* Digital Signature */}
                                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-cp-crypto font-mono">
                                        <Fingerprint className="w-3 h-3" />
                                        <span>{event.digitalSignature}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JourneyModal;
