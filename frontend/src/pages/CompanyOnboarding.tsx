import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  UserCog,
  ShieldCheck,
  BadgeCheck,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Phone,
  FileText,
} from "lucide-react";
import { companies } from "@/data/companies";

type CompanyStep = "company" | "admin" | "verification" | "complete";

const CompanyOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CompanyStep>("company");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("");
  const [adminPhone, setAdminPhone] = useState("+91 ");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
  };

  const handleContinueFromCompany = () => {
    setCurrentStep("admin");
  };

  const handleSendCode = async () => {
    setIsSendingCode(true);
    await new Promise((r) => setTimeout(r, 2000));
    setCodeSent(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSendingCode(false);
    setCurrentStep("verification");
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 2500));
    setVerified(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsVerifying(false);
    setCurrentStep("complete");
  };

  const handleResendCode = () => {
    setVerificationCode(['', '', '', '', '', '']);
    setCodeSent(false);
    setVerified(false);
    handleSendCode();
  };

  const steps = [
    { id: "company", label: "Company Selection", icon: Building2 },
    { id: "admin", label: "Admin Details", icon: UserCog },
    { id: "verification", label: "Verification Code", icon: ShieldCheck },
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/15 mb-4">
            <Building2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Company Onboarding
          </h1>
          <p className="text-muted-foreground">
            Verify your company identity to access the ClearPath dashboard
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
                        backgroundColor: isCompleted || isActive
                          ? "hsl(var(--accent))"
                          : "hsl(var(--muted))",
                      }}
                      className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-white" />
                      )}
                    </motion.div>
                    <span className="text-xs font-medium mt-2 text-foreground text-center max-w-[80px]">
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
                        className="h-full bg-accent"
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
          {currentStep === "company" && (
            <motion.div
              key="company"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-card rounded-xl border border-border p-8 space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/15 mb-4">
                    <Building2 className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Select Your Company
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose your company from the list of registered organizations
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

                <button
                  onClick={handleContinueFromCompany}
                  disabled={!selectedCompany}
                  className="w-full py-3 px-4 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-xl border border-border p-8 space-y-6"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/15 mb-4">
                  <UserCog className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Admin Information
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter the administrator details for your company account
                </p>
              </div>

              {!codeSent ? (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Administrator Name
                      </label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        disabled={isSendingCode}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Administrator Phone Number
                      </label>
                      <input
                        type="tel"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        disabled={isSendingCode}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Company Registration Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="CIN: U12345AB2020PTC123456"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        disabled={isSendingCode}
                      />
                    </div>
                  </div>

                  {!isSendingCode ? (
                    <button
                      onClick={handleSendCode}
                      disabled={!adminName || adminPhone === "+91 "}
                      className="w-full py-3 px-4 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3 py-3">
                        <Loader2 className="w-5 h-5 text-accent animate-spin" />
                        <span className="text-foreground font-medium">
                          Sending verification code...
                        </span>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Please wait while we send the code to {adminPhone}
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
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10"
                  >
                    <CheckCircle2 className="w-10 h-10 text-accent" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-accent mb-2">
                      Verification Code Sent!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Check your phone for the verification code
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === "verification" && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-xl border border-border p-8 space-y-6"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/15 mb-4">
                  <ShieldCheck className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Verify Your Identity
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit verification code sent to {adminPhone}
                </p>
              </div>

              {!verified ? (
                <>
                  <div className="flex gap-2 justify-center">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border-2 border-border rounded-lg focus:border-accent focus:outline-none bg-card"
                        disabled={isVerifying}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleResendCode}
                      className="text-sm text-accent hover:underline"
                      disabled={isVerifying}
                    >
                      Didn't receive code? Resend Code
                    </button>
                  </div>

                  {!isVerifying ? (
                    <button
                      onClick={handleVerifyCode}
                      disabled={verificationCode.some(digit => digit === '')}
                      className="w-full py-3 px-4 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <span>Verify & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3 py-3">
                        <Loader2 className="w-5 h-5 text-accent animate-spin" />
                        <span className="text-foreground font-medium">
                          Verifying code...
                        </span>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Authenticating your company account
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
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10"
                  >
                    <CheckCircle2 className="w-10 h-10 text-accent" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-accent mb-2">
                      Verification Successful!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Setting up your company dashboard...
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
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl border-2 border-accent/30 p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.3,
                  }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 mb-4"
                >
                  <BadgeCheck className="w-12 h-12 text-accent" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-accent mb-2"
                >
                  Company Verified Successfully!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground"
                >
                  Your company account is now active on ClearPath
                </motion.p>
              </motion.div>

              {/* Company Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-card rounded-xl border border-border p-6 space-y-4"
              >
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {selectedCompany}
                      </h3>
                      <BadgeCheck className="w-5 h-5 text-accent" />
                    </div>
                    <div className="inline-block mt-1 px-2 py-1 rounded-md bg-accent/10 text-xs font-medium text-accent">
                      Company Account Active
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserCog className="w-5 h-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Administrator</p>
                      <p className="text-sm font-medium text-foreground">{adminName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                      <p className="text-sm font-medium text-foreground">{adminPhone}</p>
                    </div>
                  </div>
                  {registrationNumber && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-accent flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Registration Number</p>
                        <p className="text-sm font-medium text-foreground">{registrationNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-card rounded-xl border border-border p-6 space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  Next Steps
                </h3>
                <div className="space-y-3">
                  {[
                    "View all verified supply chain actors in your network",
                    "Monitor product batches and inventory in real-time",
                    "Access detailed supply chain analytics and reports",
                  ].map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm text-foreground">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/actors')}
                className="w-full py-3 px-4 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-opacity flex items-center justify-center space-x-2"
              >
                <span>Go to Company Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyOnboarding;
