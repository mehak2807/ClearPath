import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plug, Check, Loader2, ShieldCheck, Fingerprint, Package, MapPin } from "lucide-react";
import { erpRecords, ERPRecord, Batch, JourneyEvent, Actor } from "@/data/mockData";
import { useLocation, useNavigate } from "react-router-dom";
import { useBatches } from "@/context/BatchContext";

const erpSystems = [
  { name: "SAP", icon: "S" },
  { name: "Oracle", icon: "O" },
  { name: "Tally", icon: "T" },
  { name: "Custom API", icon: "C" },
];

const ERPConnect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.product as Batch | undefined;
  const { addJourneyEvent, updateBatch } = useBatches();

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

  // Product details state
  const [productStatus, setProductStatus] = useState<string>("Manufactured");
  const [productQuantity, setProductQuantity] = useState<string>("");
  const [productLocation, setProductLocation] = useState<string>("");
  // Truncate ISO string to 'YYYY-MM-DDTHH:mm' format for datetime-local input
  const [productTimestamp, setProductTimestamp] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );

  // Redirect if no product selected
  useEffect(() => {
    if (!selectedProduct) {
      navigate("/verified-actor-dashboard", { replace: true });
    }
  }, [selectedProduct, navigate]);

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
    
    // Log product details being sealed (in a real app, this would be sent to the blockchain)
    console.log("Sealing product details:", {
      product: selectedProduct,
      status: productStatus,
      quantity: productQuantity,
      location: productLocation,
      timestamp: productTimestamp,
    });
    
    await new Promise((r) => setTimeout(r, 1500));
    
    // Create a new journey event with the product details
    if (selectedProduct) {
      // Generate a unique ID for the new event (based on current journey length + 1)
      const newEventId = selectedProduct.journey.length + 1;
      
      // Generate a digital signature (random hex string for demonstration purposes only)
      // In production, this should use a secure cryptographic function or signing service
      const digitalSignature = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
      
      // Create a verified actor (you can customize this based on the current user)
      const verifiedActor: Actor = {
        id: "ACT-VERIFIED",
        name: "Verified ERP Actor",
        role: "Verified Actor",
        organization: selectedERP || "ERP System",
        location: productLocation || "Not specified",
        avatar: "",
        verified: true,
      };
      
      // Format timestamp for display
      const formattedTimestamp = new Date(productTimestamp).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', '') + ' IST';
      
      // Determine section based on product status
      let section: "origin" | "transit" | "final" = "origin";
      if (productStatus === "In-Transit" || productStatus === "Processed") {
        section = "transit";
      } else if (productStatus === "Delivered") {
        section = "final";
      }
      
      const newEvent: JourneyEvent = {
        id: newEventId,
        actor: verifiedActor,
        action: productStatus,
        details: `ERP verified and sealed: ${productQuantity || 'Quantity not specified'}`,
        timestamp: formattedTimestamp,
        location: productLocation || "Location not specified",
        digitalSignature: digitalSignature,
        dataPoints: productQuantity ? { "Quantity": productQuantity } : undefined,
        section: section,
      };
      
      // Add the journey event to the batch
      addJourneyEvent(selectedProduct.id, newEvent);
      
      // Update batch status in BatchContext
      updateBatch(selectedProduct.id, { 
        status: productStatus as "Harvested" | "In-Transit" | "Processed" | "Delivered" | "Verified",
        lastUpdated: new Date().toISOString().split('T')[0],
      });
      
      console.log("Batch updated:", {
        batchId: selectedProduct.id,
        status: productStatus,
        quantity: productQuantity,
        location: productLocation,
        timestamp: productTimestamp,
      });
    }
    
    setShowSuccess(true);
    // NO NAVIGATION - just stay on success screen
  };

  const statusStyles: Record<string, string> = {
    "Ready to Seal": "bg-cp-warning/15 text-cp-warning",
    Verified: "bg-cp-verified/15 text-cp-verified",
    Pending: "bg-muted text-muted-foreground",
  };

  // If no product selected, return null (useEffect will handle redirect)
  if (!selectedProduct) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ERP Integration</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Connect your enterprise system to seal data into ClearPath
        </p>
      </div>

      {/* Product Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h2 className="text-sm font-semibold text-foreground mb-4">Selected Product Details</h2>
        
        {/* Product Info Display */}
        <div className="bg-accent/10 rounded-lg p-4 mb-6 border border-accent/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                <Package className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                {selectedProduct.productName}
              </h3>
              <p className="text-sm text-muted-foreground font-mono">
                {selectedProduct.id}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{selectedProduct.origin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Form */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Product Status <span className="text-red-500">*</span>
            </label>
            <select
              value={productStatus}
              onChange={(e) => setProductStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="Manufactured">Manufactured</option>
              <option value="Harvested">Harvested</option>
              <option value="In-Transit">In Transit</option>
              <option value="Processed">Processed</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Quantity
              </label>
              <input
                type="text"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
                placeholder="e.g., 500 kg"
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Location
              </label>
              <input
                type="text"
                value={productLocation}
                onChange={(e) => setProductLocation(e.target.value)}
                placeholder="e.g., Warehouse A"
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Timestamp
            </label>
            <input
              type="datetime-local"
              value={productTimestamp}
              onChange={(e) => setProductTimestamp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </motion.div>

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
