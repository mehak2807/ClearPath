import { X } from "lucide-react";
import { Batch } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeModalProps {
  batch: Batch | null;
  onClose: () => void;
}

// Base URL for verification - can be configured per environment
const VERIFICATION_BASE_URL = import.meta.env.VITE_VERIFICATION_URL || "https://qr-ruddy-chi.vercel.app";

const QRCodeModal = ({ batch, onClose }: QRCodeModalProps) => {
  if (!batch) return null;

  // Generate verification URL - redirect to homepage
  const verificationUrl = VERIFICATION_BASE_URL;

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
          className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">QR Code</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Scan to verify batch
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* QR Code Content */}
          <div className="flex flex-col items-center px-6 py-8">
            {/* QR Code - white background required for optimal scanning */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG
                value={verificationUrl}
                size={256}
                level="H"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>

            {/* Batch Information */}
            <div className="mt-6 w-full space-y-2">
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground">Batch ID</p>
                <p className="font-mono text-sm font-medium text-foreground mt-0.5">#{batch.id}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground">Product Name</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{batch.productName}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground">Verification URL</p>
                <p className="text-xs font-mono text-primary mt-0.5 break-all">{verificationUrl}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRCodeModal;
