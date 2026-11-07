import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Icon from "../components/Icon";
import PhoneInput from "../components/PhoneInput";
import { useAuth } from "../context/AuthContext";
import { inputClasses } from "../lib/formStyles";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", company: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit mobile number (cannot start with 0-5)");
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      navigate("/verify", { state: { email: form.email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard eyebrow="Create Account" title="Join JE Bags" subtitle="Sign up to order, track, and manage your bulk requests.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}
        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Full Name</label>
          <input required name="name" value={form.name} onChange={handleChange} className={inputClasses} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Email Address</label>
          <input required type="email" name="email" value={form.email} onChange={handleChange} className={inputClasses} placeholder="you@company.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Phone Number</label>
          <PhoneInput value={form.phone} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Company (optional)</label>
          <input name="company" value={form.company} onChange={handleChange} className={inputClasses} placeholder="Your organization" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Password</label>
          <input required type="password" minLength={6} name="password" value={form.password} onChange={handleChange} className={inputClasses} placeholder="At least 6 characters" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
          {!loading && <Icon name="arrow-right" size={16} />}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink-700 text-center">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-700">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
