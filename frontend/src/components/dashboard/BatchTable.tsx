import { Eye, Download, QrCode } from "lucide-react";
import { Batch } from "@/data/mockData";
import { motion } from "framer-motion";
import { generateJourneyPDF } from "@/utils/generateJourneyPDF";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import QRCodeModal from "./QRCodeModal";

interface BatchTableProps {
  batches: Batch[];
  onViewBatch: (batch: Batch) => void;
}

const statusStyles: Record<string, string> = {
  Harvested: "bg-cp-warning/15 text-cp-warning",
  "In-Transit": "bg-primary/15 text-primary",
  Processed: "bg-accent/15 text-accent",
  Delivered: "bg-cp-verified/15 text-cp-verified",
  Verified: "bg-cp-verified/15 text-cp-verified",
};

// Static QR code image for table display
const QR_CODE_IMAGE = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2029%2029'%3e%3cpath%20fill='%23000'%20d='M0%200h7v7H0zM8%200h1v1H8zm2%200h1v2h1V1h1v1h2V0h2v1h-1v2h2V1h1v2h-1v1h1v1h-1v1h-1V5h-2v1h-1V5h-1v1h-1V5h1V4h-2v1h-1V4h1V3h1V2h-2v1h-1zm12%200h7v7h-7zM1%201v5h5V1zm9%200v1h1V1zm12%200v5h5V1zM2%202v3h3V2zm14%200v3h3V2zM8%203v1h1v1H8V4H7v1H6V4h1V3zm-1%202v1h1V5zM0%208h1v2H0zm2%200h1v1H2zm2%200h2v1H4zm3%200h1v2H7zm3%200h2v1h-2zm3%200h1v1h1v1h-2V9h1zm3%200h2v1h-1v1h-1zm4%200h1v1h-1zm2%200h1v2h1V8h1v1h-1v1h1v2h-2v-2h-1v1h-1v-1h1V9h-1V8h1zm-21%201v1h1V9zm15%200v1h1V9zM1%2010v1h1v-1zm3%200h1v1H4zm2%200h1v2H6v-2zm2%200v1h2v1H9v1H8v-2h1v-1zm4%200h1v1h-1zm2%200h1v1h-1v1h-1v-1h1zm2%200v1h1v1h-1v1h-1v-2h1zm6%200h1v1h-1zM0%2012h1v1H0zm4%200h1v2H4zm7%200v1h1v-1zm2%200h1v1h-1zm8%200h1v1h-1zM1%2013v1h2v-1zm6%200h1v1H7zm2%200h1v1H9zm2%200v2h-1v-1h-1v-1zm7%200h1v1h-1zm2%200h3v1h-1v1h-1v-1h-1zM0%2014h1v2h1v-1h1v2H2v2H1v-4H0zm16%200h1v1h-1zm-10%201v1h1v-1zm2%200h2v1h1v1h-1v1H9v-2h1v-1zm3%200h1v1h-1zm7%200v1h-1v1h1v1h-2v-2h1v-1zM4%2016v1h1v-1zm2%200h1v1H6zm13%200h1v2h-1v1h-1v-2h1zM3%2017v2h1v1H3v1h1v1H3v2H2v-2h1v-1H2v-2h1v1h1v-2H3zm5%200h2v1H8zm9%200h1v1h-1zm5%200v1h-1v1h2v1h-1v1h1v1h-2v-1h-2v-1h1v-1h-1v-1h2v-1zM7%2018h1v1H7zm3%200v1h1v-1zm-1%201v1h1v-1zm2%200h3v1h-1v1h-1v-1h-1zm8%200h1v1h-1zM6%2020v1h1v-1zm2%200h1v2H8zm2%200h1v1h-1zm9%200h1v1h-1zM5%2021v1h1v-1zm7%200h1v1h-1zm3%200h2v1h-2zm-8%201v1h2v1h1v-1h1v1h-1v2H9v-1H8v1H7v-2h1v-1H7zm8%200v1h-1v2h2v-2h1v1h1v-1h-1v-1zm7%200h1v1h-1zM0%2022h7v7H0zm17%200h1v1h-1zm5%200h1v1h-1zM1%2023v5h5v-5zm12%200v1h-1v1h1v1h1v1h-1v1h2v-2h1v2h2v-1h-1v-1h1v-1h-2v-1h-1v-1h-2zm10%200h1v1h-1zM2%2024v3h3v-3zm6%200h1v1H8zm10%200v1h1v-1zm-9%201v1h2v-1zm12%200v1h-1v1h2v-1h1v2h-1v1h-2v-3h1zm-13%201h1v2H8z'/%3e%3c/svg%3e";

const BatchTable = ({ batches, onViewBatch }: BatchTableProps) => {
  const { toast } = useToast();
  const [qrBatch, setQrBatch] = useState<Batch | null>(null);
  
  const handleDownloadPDF = (batch: Batch) => {
    generateJourneyPDF(batch);
    toast({
      title: "PDF Generated",
      description: `Journey report for ${batch.productName} has been downloaded.`,
      duration: 3000,
    });
  };

  const handleQRClick = (batch: Batch) => {
    setQrBatch(batch);
  };

  const closeQRModal = () => {
    setQrBatch(null);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Batch Registry</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Track and verify product batches</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Batch ID</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Origin</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">QR Code</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Updated</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, i) => (
              <motion.tr
                key={batch.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <span className="font-mono text-sm font-medium text-foreground">#{batch.id}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-foreground">{batch.productName}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{batch.origin}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[batch.status] || ""}`}>
                    {batch.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => handleQRClick(batch)}
                    className="p-0 border-0 bg-transparent cursor-pointer"
                    title="Click to view full QR Code"
                    aria-label={`View QR code for batch ${batch.id}`}
                  >
                    <img
                      src={QR_CODE_IMAGE}
                      alt="QR Code"
                      className="w-12 h-12 hover:opacity-70 transition-opacity"
                    />
                  </button>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{batch.lastUpdated}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleDownloadPDF(batch)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Download Journey PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewBatch(batch)}
                      className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                      title="View Journey"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <QRCodeModal batch={qrBatch} onClose={closeQRModal} />
    </motion.div>
  );
};

export default BatchTable;
