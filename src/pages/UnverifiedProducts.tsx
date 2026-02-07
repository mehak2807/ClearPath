import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Building2,
  Package,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { batches, Batch } from "@/data/mockData";

const UnverifiedProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCompany = location.state?.company;
  const [selectedProduct, setSelectedProduct] = useState<Batch | null>(null);

  // Redirect to company selection if no company is selected
  useEffect(() => {
    if (!selectedCompany) {
      navigate("/verified-actor-dashboard", { replace: true });
    }
  }, [selectedCompany, navigate]);

  // Filter batches to show only non-verified products
  const unverifiedBatches = batches.filter(
    (batch) => batch.status !== "Verified"
  );

  const handleProceedToERP = () => {
    if (selectedProduct) {
      navigate("/erp", { state: { product: selectedProduct } });
    }
  };

  const handleProductSelect = (batch: Batch) => {
    setSelectedProduct(batch);
  };

  const statusColors: Record<string, string> = {
    Harvested: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
    "In-Transit": "bg-blue-500/15 text-blue-600 border-blue-500/30",
    Processed: "bg-purple-500/15 text-purple-600 border-purple-500/30",
    Delivered: "bg-green-500/15 text-green-600 border-green-500/30",
  };

  // If no company selected, return null (useEffect will handle redirect)
  if (!selectedCompany) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/15">
            <Building2 className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {selectedCompany}
            </h1>
            <p className="text-muted-foreground">
              Unverified products pending blockchain verification
            </p>
          </div>
        </div>
      </motion.div>

      {/* Products Count Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30"
      >
        <Package className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-accent">
          {unverifiedBatches.length} Products Pending Verification
        </span>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {unverifiedBatches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleProductSelect(batch)}
            className={`bg-card rounded-xl border-2 p-5 space-y-4 hover:shadow-lg transition-all cursor-pointer ${
              selectedProduct?.id === batch.id
                ? "border-accent bg-accent/10"
                : "border-border hover:border-accent/50"
            }`}
          >
            {/* Product Header */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-foreground line-clamp-2">
                  {batch.productName}
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${
                      statusColors[batch.status] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {batch.status}
                  </div>
                  {selectedProduct?.id === batch.id && (
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {batch.id}
              </p>
            </div>

            {/* Product Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="line-clamp-1">{batch.origin}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Created: {batch.createdAt}</span>
              </div>
            </div>

            {/* Journey Steps Count */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Journey Steps: {batch.journey.length}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {unverifiedBatches.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-xl border border-border p-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cp-verified/10 mb-4">
            <Package className="w-8 h-8 text-cp-verified" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            All Products Verified
          </h3>
          <p className="text-muted-foreground">
            All products from {selectedCompany} have been verified on the blockchain
          </p>
        </motion.div>
      )}

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-6 z-10"
      >
        <div className="bg-background/80 backdrop-blur-sm rounded-xl border border-border p-4">
          <button
            onClick={handleProceedToERP}
            disabled={!selectedProduct}
            className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>Proceed to ERP Connect</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UnverifiedProducts;
