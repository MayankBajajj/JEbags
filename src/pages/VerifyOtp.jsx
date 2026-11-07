import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { inputClasses } from "../lib/formStyles";

export default function VerifyOtp() {
  const { verifyOtp, requestOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtp(email, code);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    try {
      await requestOtp(email, "signup");
      setNotice("A new code has been sent.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthCard
      eyebrow="Verify Email"
      title="Enter Verification Code"
      subtitle={`We emailed a 6-digit code to ${email || "your email"}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}
        {notice && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{notice}</p>
        )}
        {!location.state?.email && (
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-2">Email Address</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} placeholder="you@company.com" />
          </div>
        )}
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
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
          {!loading && <Icon name="arrow-right" size={16} />}
        </button>
      </form>
      <div className="mt-6 flex items-center justify-between text-sm">
        <button onClick={handleResend} className="font-semibold text-gold-600 hover:text-gold-700">
          Resend code
        </button>
        <Link to="/login" className="text-ink-700 hover:text-ink-900">
          Back to login
        </Link>
      </div>
    </AuthCard>
  );
}
