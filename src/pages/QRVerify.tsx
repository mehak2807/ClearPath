import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CheckCircle2, MapPin, Clock, Fingerprint, ChevronDown, ChevronRight } from "lucide-react";
import { batches } from "@/data/mockData";
import productImage from "@/assets/product-coffee.jpg";

const verifiedBatch = batches[0];

const sections = [
  { key: "origin", label: "Origin", range: "Nodes 1–4" },
  { key: "transit", label: "Global Transit", range: "Nodes 5–8" },
  { key: "final", label: "Final Product", range: "Nodes 9–12" },
] as const;

const QRVerify = () => {
  const [scanned, setScanned] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["origin"]));

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const groupedEvents = verifiedBatch.journey.reduce(
    (acc, event) => {
      acc[event.section] = acc[event.section] || [];
      acc[event.section].push(event);
      return acc;
    },
    {} as Record<string, typeof verifiedBatch.journey>
  );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">QR Verification</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Scan a product QR code to verify its journey</p>
      </div>

      {!scanned ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-8 text-center"
        >
          <div className="w-48 h-48 mx-auto rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center mb-4">
            <span className="text-6xl">📷</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Point your camera at a ClearPath QR code</p>
          <button
            onClick={() => setScanned(true)}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Simulate QR Scan
          </button>
        </motion.div>
      ) : (
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
              <span className="text-sm font-bold text-cp-verified uppercase tracking-wide">100% Secure & Verified</span>
            </div>
            <p className="text-xs text-muted-foreground">Scanned at 14:02 IST | Location: Delhi Retail Store</p>
          </motion.div>

          {/* Product Card */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <img
                src={productImage}
                alt="Product"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <p className="font-mono text-xs text-muted-foreground">#{verifiedBatch.id}</p>
                <h2 className="text-lg font-bold text-foreground">{verifiedBatch.productName}</h2>
                <p className="text-sm text-muted-foreground">{verifiedBatch.origin}</p>
              </div>
            </div>
          </div>

          {/* Collapsible Timeline */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Product Journey</h3>
              <p className="text-xs text-muted-foreground">{verifiedBatch.journey.length} verified events</p>
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
                      <span className="text-sm font-medium text-foreground">{section.label}</span>
                      <span className="text-xs text-muted-foreground">({section.range})</span>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 border-l-2 border-cp-verified/30 pl-4 py-2 space-y-4">
                            {events.map((event) => (
                              <div key={event.id} className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-cp-verified flex items-center justify-center">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-cp-verified-foreground" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{event.actor.avatar}</span>
                                    <span className="text-sm font-medium text-foreground">{event.actor.name}</span>
                                    <CheckCircle2 className="w-3 h-3 text-primary" />
                                  </div>
                                  <p className="text-sm text-foreground">{event.action}</p>
                                  <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {event.timestamp}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {event.location}</span>
                                  </div>
                                  {event.dataPoints && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                      {Object.entries(event.dataPoints).map(([k, v]) => (
                                        <span key={k} className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                                          {k}: <span className="font-medium text-foreground">{v}</span>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 mt-1 text-[10px] text-cp-crypto font-mono">
                                    <Fingerprint className="w-2.5 h-2.5" />
                                    Signed by {event.actor.id}: {event.digitalSignature}
                                  </div>
                                </div>
                              </div>
                            ))}
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
      )}
    </div>
  );
};

export default QRVerify;
