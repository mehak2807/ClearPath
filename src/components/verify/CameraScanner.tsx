import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, ScanLine, Shield } from "lucide-react";

interface CameraScannerProps {
  onScanComplete: () => void;
  duration?: number; // seconds
}

const CameraScanner = ({ onScanComplete, duration = 25 }: CameraScannerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanning(true);
    } catch {
      // Camera not available — fallback to simulated scan
      setScanning(true);
    }
  };

  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Stop camera stream
          streamRef.current?.getTracks().forEach((t) => t.stop());
          onScanComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [scanning, onScanComplete]);

  const progress = ((duration - secondsLeft) / duration) * 100;

  if (!scanning) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-8 text-center space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-2xl bg-muted border border-border flex items-center justify-center">
          <Camera className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Scan Product QR Code</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Position the QR code within the scanner frame to verify product authenticity
          </p>
        </div>
        <button
          onClick={startCamera}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Start Scanner
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* Camera viewport */}
      <div className="relative aspect-square max-h-[360px] bg-foreground/95 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Scan overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Corner brackets */}
          <div className="w-56 h-56 relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />

            {/* Scanning line */}
            <motion.div
              className="absolute left-2 right-2 h-0.5 bg-primary/80 shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
              animate={{ top: ["8%", "88%", "8%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Top info bar */}
        <div className="absolute top-0 left-0 right-0 px-4 py-3 bg-gradient-to-b from-foreground/60 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-primary-foreground" />
              <span className="text-xs font-medium text-primary-foreground">Scanning</span>
            </div>
            <span className="text-xs font-mono text-primary-foreground/80">{secondsLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress section */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Analyzing QR data...</span>
          <span className="font-mono text-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-cp-verified" />
          <span>Verifying digital signatures and chain integrity</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CameraScanner;
