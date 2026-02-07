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
  ArrowRight,
  ShieldCheck,
  Hash,
} from "lucide-react";

type Step = "phone" | "otp" | "identity" | "complete";

const VerifiedActorOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("+91 ");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isVerifyingIdentity, setIsVerifyingIdentity] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    await new Promise((r) => setTimeout(r, 2000));
    setOtpSent(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSendingOtp(false);
    setCurrentStep("otp");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
      
      // Auto-submit when all 6 digits entered
      if (index === 5 && value && newOtp.every(digit => digit !== '')) {
        handleVerifyOtp();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    await new Promise((r) => setTimeout(r, 2000));
    setOtpVerified(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsVerifyingOtp(false);
    setCurrentStep("identity");
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setOtpSent(false);
    setOtpVerified(false);
    handleSendOtp();
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
    { id: "otp", label: "OTP", icon: Hash },
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
                  Phone Number Entry
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your phone number to receive a verification code
                </p>
              </div>

              {!otpSent ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={isSendingOtp}
                    />
                  </div>

                  {!isSendingOtp ? (
                    <button
                      onClick={handleSendOtp}
                      disabled={!phoneNumber || phoneNumber === "+91 "}
                      className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3 py-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="text-foreground font-medium">
                          Sending OTP...
                        </span>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Please wait while we send the verification code
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
                      OTP Sent Successfully!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Check your phone for the verification code
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-xl border border-border p-8 space-y-6"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cp-verified/10 mb-4">
                  <Hash className="w-8 h-8 text-cp-verified" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Verify OTP
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to your phone
                </p>
              </div>

              {!otpVerified ? (
                <>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-card"
                        disabled={isVerifyingOtp}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleResendOtp}
                      className="text-sm text-primary hover:underline"
                      disabled={isVerifyingOtp}
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  </div>

                  {!isVerifyingOtp ? (
                    <button
                      onClick={handleVerifyOtp}
                      disabled={otp.some(digit => digit === '')}
                      className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <span>Verify OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3 py-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="text-foreground font-medium">
                          Verifying OTP...
                        </span>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Authenticating your phone number
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
                      Phone Verified Successfully!
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

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                      transition={{ delay: 0.6 + index * 0.1 }}
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
                transition={{ delay: 0.9 }}
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
