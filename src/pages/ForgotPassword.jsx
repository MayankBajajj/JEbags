import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { inputClasses } from "../lib/formStyles";

export default function ForgotPassword() {
  const { requestOtp, verifyOtp, setPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("request"); // request -> verify -> reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestOtp(email, "reset");
      setStep("verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtp(email, code);
      setStep("reset");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await setPassword(newPassword);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      eyebrow="Reset Password"
      title={step === "reset" ? "Set a New Password" : "Forgot Your Password?"}
      subtitle={
        step === "request"
          ? "Enter your account email and we'll send a verification code."
          : step === "verify"
          ? `Enter the code we emailed to ${email}.`
          : "Choose a new password for your account."
      }
    >
      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {step === "request" && (
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-2">Email Address</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} placeholder="you@company.com" />
          </div>
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-60">
            {loading ? "Sending..." : "Send Code"}
            {!loading && <Icon name="arrow-right" size={16} />}
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-2">Verification Code</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className={`${inputClasses} tracking-[0.5em] text-center text-lg`}
              placeholder="000000"
              inputMode="numeric"
            />
          </div>
          <button type="submit" disabled={loading || code.length !== 6} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-60">
            {loading ? "Verifying..." : "Verify Code"}
            {!loading && <Icon name="arrow-right" size={16} />}
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-2">New Password</label>
            <input required type="password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClasses} placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save New Password"}
            {!loading && <Icon name="arrow-right" size={16} />}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-ink-700 text-center">
        <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-700">
          Back to login
        </Link>
      </p>
    </AuthCard>
  );
}
