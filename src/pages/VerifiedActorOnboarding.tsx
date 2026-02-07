import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Upload,
  BadgeCheck,
  CheckCircle2,
  Loader2,
  FileText,
  User,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

// Mock actor data - used as placeholder for demonstration
const MOCK_ACTOR_DATA = {
  id: "ACT-101",
  name: "Your Organization",
  role: "Verified Actor",
  organization: "Your Company Ltd.",
  location: "Your Location",
  verified: true,
};

type Step = "phone" | "identity" | "complete";

const VerifiedActorOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isVerifyingIdentity, setIsVerifyingIdentity] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePhoneVerification = async () => {
    setIsVerifyingPhone(true);
    await new Promise((r) => setTimeout(r, 2500));
    setIsVerifyingPhone(false);
    setPhoneVerified(true);
    await new Promise((r) => setTimeout(r, 800));
    setCurrentStep("identity");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleIdentitySubmit = async () => {
    setIsVerifyingIdentity(true);
    setVerificationProgress(0);

    // Animate progress bar
    progressIntervalRef.current = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    await new Promise((r) => setTimeout(r, 3000));
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setVerificationProgress(100);
    setIsVerifyingIdentity(false);
    setIdentityVerified(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStep("complete");
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const steps = [
    { id: "phone", label: "Phone", icon: Phone },
    { id: "identity", label: "Identity", icon: Upload },
    { id: "complete", label: "Complete", icon: BadgeCheck },
  ];

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cp-verified/10 mb-4">
            <ShieldCheck className="w-8 h-8 text-cp-verified" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verified Actor Onboarding
          </h1>
          <p className="text-muted-foreground">
            Complete the verification process to join the ClearPath network
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === stepIndex;
              const isCompleted = index < stepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted
                          ? "hsl(var(--cp-verified))"
                          : isActive
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted))",
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </motion.div>
                    <span className="text-xs font-medium mt-2 text-foreground">
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-2 bg-border relative overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: index < stepIndex ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-cp-verified"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-xl border border-border p-8 space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Phone Number Verification
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your phone number to receive a verification code
                </p>
              </div>

              {!phoneVerified ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isVerifyingPhone}
                    />
                  </div>

                  {!isVerifyingPhone ? (
                    <button
                      onClick={handlePhoneVerification}
                      disabled={!phoneNumber}
                      className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify Phone Number
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3 py-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="text-foreground font-medium">
                          Verifying phone number...
                        </span>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Sending verification code
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-4 text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cp-verified/10"
                  >
                    <CheckCircle2 className="w-10 h-10 text-cp-verified" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-cp-verified mb-2">
                      Phone Verified!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Proceeding to identity verification...
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === "identity" && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-xl border border-border p-8 space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Identity Proof Upload
                </h2>
                <p className="text-sm text-muted-foreground">
                  Upload a government-issued ID or business registration document
                </p>
              </div>

              {!identityVerified ? (
                <>
                  <div
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isVerifyingIdentity}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer space-y-3 block"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PDF, JPG, or PNG (max 10MB)
                        </p>
                      </div>
                    </label>
                  </div>

                  {uploadedFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-3 p-4 rounded-lg bg-muted"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(uploadedFile.size)}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {!isVerifyingIdentity ? (
                    <button
                      onClick={handleIdentitySubmit}
                      disabled={!uploadedFile}
                      className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit for Verification
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground font-medium">
                            Verifying identity document...
                          </span>
                          <span className="text-muted-foreground">
                            {verificationProgress}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${verificationProgress}%` }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Authenticating with blockchain verification...
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-4 text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cp-verified/10"
                  >
                    <CheckCircle2 className="w-10 h-10 text-cp-verified" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-cp-verified mb-2">
                      Identity Verified!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Loading your verified actor profile...
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Success Message */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.2,
                  }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cp-verified/10 mb-4"
                >
                  <BadgeCheck className="w-12 h-12 text-cp-verified" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-cp-verified mb-2"
                >
                  Verification Complete!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  You are now a verified actor in the ClearPath supply chain network
                </motion.p>
              </motion.div>

              {/* Actor Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card rounded-xl border border-border p-6 space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.6 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <User className="w-8 h-8 text-primary" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <h3 className="text-xl font-semibold text-foreground">
                        {MOCK_ACTOR_DATA.name}
                      </h3>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.8 }}
                      >
                        <BadgeCheck className="w-5 h-5 text-cp-verified" />
                      </motion.div>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="text-sm text-muted-foreground"
                    >
                      {MOCK_ACTOR_DATA.role}
                    </motion.p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="space-y-3 pt-4 border-t border-border"
                >
                  <div className="flex items-center space-x-3 text-sm">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {MOCK_ACTOR_DATA.organization}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{MOCK_ACTOR_DATA.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <BadgeCheck className="w-4 h-4 text-cp-verified" />
                    <span className="text-foreground">
                      Actor ID: {MOCK_ACTOR_DATA.id}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-card rounded-xl border border-border p-6 space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  Next Steps
                </h3>
                <div className="space-y-3">
                  {[
                    "Connect your ERP system to start sealing supply chain data",
                    "View your digital identity and cryptographic credentials",
                    "Join the verified actors network and start collaborating",
                  ].map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-cp-verified flex-shrink-0" />
                      <span className="text-sm text-foreground">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/erp")}
                className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <span>Go to ERP Connect</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerifiedActorOnboarding;
