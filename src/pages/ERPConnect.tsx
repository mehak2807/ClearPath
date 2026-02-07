import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plug, Check, Loader2, ShieldCheck, Fingerprint } from "lucide-react";
import { erpRecords, ERPRecord } from "@/data/mockData";

const erpSystems = [
  { name: "SAP", icon: "S" },
  { name: "Oracle", icon: "O" },
  { name: "Tally", icon: "T" },
  { name: "Custom API", icon: "C" },
];

const ERPConnect = () => {
  const [selectedERP, setSelectedERP] = useState<string | null>(null);
  const [endpointUrl, setEndpointUrl] = useState("https://nestle-erp.com/api/v1");
  const [accessToken, setAccessToken] = useState("eyJhbGciOi...");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [records, setRecords] = useState<ERPRecord[]>([]);
  const [validatingIndex, setValidatingIndex] = useState(-1);
  const [showSigning, setShowSigning] = useState(false);
  const [signatureGenerated, setSignatureGenerated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsConnecting(false);
    setIsConnected(true);

    // Populate records one by one
    for (let i = 0; i < erpRecords.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setRecords((prev) => [...prev, erpRecords[i]]);
    }

    // Validate records
    for (let i = 0; i < erpRecords.length; i++) {
      setValidatingIndex(i);
      await new Promise((r) => setTimeout(r, 800));
      setRecords((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, validated: true, status: "Verified" } : r))
      );
    }
    setValidatingIndex(-1);
  };

  const handleSign = async () => {
    setShowSigning(true);
    await new Promise((r) => setTimeout(r, 2500));
    setSignatureGenerated(true);
    await new Promise((r) => setTimeout(r, 1500));
    setShowSuccess(true);
  };

  const statusStyles: Record<string, string> = {
    "Ready to Seal": "bg-cp-warning/15 text-cp-warning",
    Verified: "bg-cp-verified/15 text-cp-verified",
    Pending: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ERP Integration</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Connect your enterprise system to seal data into ClearPath
        </p>
      </div>

      {/* ERP Selector */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h2 className="text-sm font-semibold text-foreground mb-4">Select ERP System</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {erpSystems.map((erp) => (
            <button
              key={erp.name}
              onClick={() => setSelectedERP(erp.name)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                selectedERP === erp.name
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <span className="text-3xl block mb-2">{erp.icon}</span>
              <span className="text-sm font-medium text-foreground">{erp.name}</span>
            </button>
          ))}
        </div>

        {selectedERP && !isConnected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">ERP Endpoint URL</label>
              <input
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Access Token</label>
              <input
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plug className="w-4 h-4" />
                  Connect
                </>
              )}
            </button>

            {/* Wire animation */}
            {isConnecting && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xl">{erpSystems.find((e) => e.name === selectedERP)?.icon}</span>
                <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-wire-flow" />
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {isConnected && (
          <div className="flex items-center gap-2 text-cp-verified text-sm font-medium">
            <Check className="w-4 h-4" />
            Connected to {selectedERP}
          </div>
        )}
      </motion.div>

      {/* ERP Data Table */}
      <AnimatePresence>
        {records.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">Fetched ERP Records</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Logic Verified: Batch weight matches previous node
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ERP Ref ID</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, i) => (
                    <motion.tr
                      key={rec.erpRefId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-3 font-mono text-sm text-foreground">{rec.erpRefId}</td>
                      <td className="px-5 py-3 text-sm text-foreground">{rec.quantity}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{rec.timestamp}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{rec.location}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {i === validatingIndex && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
                          {rec.validated && <Check className="w-3.5 h-3.5 text-cp-verified" />}
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[rec.status] || ""}`}>
                            {rec.status}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sign Button */}
            {records.every((r) => r.validated) && !showSuccess && (
              <div className="p-5 border-t border-border">
                <button
                  onClick={handleSign}
                  disabled={showSigning}
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all glow-blue disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {showSigning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {signatureGenerated ? "Sealing..." : "Generating Digital Signature..."}
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" />
                      Digitally Sign & Push to Ledger
                    </>
                  )}
                </button>

                {showSigning && !signatureGenerated && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-muted rounded-lg"
                  >
                    <p className="text-xs text-muted-foreground mb-2">Generating Private Key Signature...</p>
                    <p className="font-mono text-xs text-cp-crypto break-all animate-pulse">
                      0x7a2c9f8b3e1d4a6f92b8c7e5d0f3a1b6e4c9d2f8a7b3e1c5f9d4a2b8e6f3c1d7a9b5e2f8c4d0a6b3e9f1c7d5a2b8e4f0c6d3a9b5e1f7c2d8a4b0e6f3...
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 border-t border-border text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cp-verified/10 mb-3 glow-verified">
                  <ShieldCheck className="w-8 h-8 text-cp-verified" />
                </div>
                <h3 className="text-lg font-bold text-cp-verified">Data Encrypted & Sealed in Ledger</h3>
                <p className="text-sm text-muted-foreground mt-1">All records have been cryptographically verified and pushed.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ERPConnect;
