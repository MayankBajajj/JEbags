import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../../components/AuthCard";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { inputClasses } from "../../lib/formStyles";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard eyebrow="Admin" title="Dashboard Login" subtitle="Log in with your admin email and password.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}
        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Email Address</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} placeholder="admin@jebags.in" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} placeholder="Your password" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
          {!loading && <Icon name="arrow-right" size={16} />}
        </button>
      </form>
    </AuthCard>
  );
}
