import { useState } from "react";
import StatCards from "@/components/dashboard/StatCards";
import BatchTable from "@/components/dashboard/BatchTable";
import JourneyModal from "@/components/dashboard/JourneyModal";
import { Batch } from "@/data/mockData";
import { useBatches } from "@/context/BatchContext";

const Index = () => {
  const { batches } = useBatches();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Monitor your supply chain in real time
        </p>
      </div>

      <StatCards />
      <BatchTable batches={batches} onViewBatch={setSelectedBatch} />

      {selectedBatch && (
        <JourneyModal batch={selectedBatch} onClose={() => setSelectedBatch(null)} />
      )}
    </div>
  );
};

export default Index;
