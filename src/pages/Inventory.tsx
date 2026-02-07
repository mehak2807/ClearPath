import { useState } from "react";
import BatchTable from "@/components/dashboard/BatchTable";
import JourneyModal from "@/components/dashboard/JourneyModal";
import { batches, Batch } from "@/data/mockData";

const Inventory = () => {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Full batch registry with journey tracking
        </p>
      </div>

      <BatchTable batches={batches} onViewBatch={setSelectedBatch} />

      {selectedBatch && (
        <JourneyModal batch={selectedBatch} onClose={() => setSelectedBatch(null)} />
      )}
    </div>
  );
};

export default Inventory;
