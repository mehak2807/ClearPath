import { useState, useCallback } from "react";
import { QrCode } from "lucide-react";
import { batches } from "@/data/mockData";
import CameraScanner from "@/components/verify/CameraScanner";
import VerifiedResult from "@/components/verify/VerifiedResult";

const verifiedBatch = batches[0];

const QRVerify = () => {
  const [scanned, setScanned] = useState(false);

  const handleScanComplete = useCallback(() => {
    setScanned(true);
  }, []);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-1">
          <QrCode className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">QR Verification</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Scan a product QR code to verify its supply chain journey
        </p>
      </div>

      {!scanned ? (
        <CameraScanner onScanComplete={handleScanComplete} duration={25} />
      ) : (
        <VerifiedResult batch={verifiedBatch} />
      )}
    </div>
  );
};

export default QRVerify;
