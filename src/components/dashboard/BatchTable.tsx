import { Eye, Download } from "lucide-react";
import { Batch } from "@/data/mockData";
import { motion } from "framer-motion";
import { generateJourneyPDF } from "@/utils/generateJourneyPDF";
import { useToast } from "@/hooks/use-toast";

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

const BatchTable = ({ batches, onViewBatch }: BatchTableProps) => {
  const { toast } = useToast();
  
  const handleDownloadPDF = (batch: Batch) => {
    generateJourneyPDF(batch);
    toast({
      title: "PDF Generated",
      description: `Journey report for ${batch.productName} has been downloaded.`,
      duration: 3000,
    });
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
    </motion.div>
  );
};

export default BatchTable;
