import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { companies } from "@/data/companies";

const VerifiedActorDashboard = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
  };

  const handleContinue = () => {
    if (selectedCompany) {
      // Navigate to unverified products page with selected company
      navigate("/unverified-products", { state: { company: selectedCompany } });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/15 mb-4">
          <ShieldCheck className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Select Your Company
        </h1>
        <p className="text-muted-foreground">
          Choose the company you're working with to view their unverified products
        </p>
      </motion.div>

      {/* Company Selection Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border p-8 space-y-6"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/15 mb-4">
            <Building2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Select Company
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose the company from the list of registered organizations
          </p>
        </div>

        <div className="space-y-3">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCompanySelect(company.name)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedCompany === company.name
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">
                  {company.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {company.industry}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedCompany === company.name
                      ? "border-accent bg-accent"
                      : "border-border"
                  }`}
                >
                  {selectedCompany === company.name && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={handleContinue}
          disabled={!selectedCompany}
          whileHover={{ scale: selectedCompany ? 1.02 : 1 }}
          whileTap={{ scale: selectedCompany ? 0.98 : 1 }}
          className="w-full py-3 px-4 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default VerifiedActorDashboard;
