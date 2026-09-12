import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BrandMark } from "../components/common/BrandMark";
import { useAuth } from "../hooks/useAuth";

export function RegisterPage() {
  const { register, session } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to="/dashboard" replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setBusy(true); setError("");
    try { await register(name, email, password); nav("/dashboard"); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to create the account."); }
    finally { setBusy(false); }
  };

  return <main className="auth-shell"><Link className="back-link" to="/"><ArrowLeft size={16} /> Back to CyberTrace</Link><section className="auth-copy"><BrandMark /><p className="eyebrow">Analyst onboarding</p><h1>Start a focused investigation workspace.</h1><p>Create an analyst account to investigate indicators, preserve evidence, and work through CyberTrace cases.</p><div className="auth-points"><span><ShieldCheck size={17} /> Analyst access by default</span><span><LockKeyhole size={17} /> Role permissions enforced by the API</span></div></section><form onSubmit={submit} className="auth-card"><BrandMark compact /><div className="auth-title"><p className="eyebrow">Create access</p><h2>Join CyberTrace</h2><p>New accounts are created with Analyst access.</p></div>{error && <p className="auth-error" role="alert">{error}</p>}<label className="label">Name<input className="input" value={name} onChange={event => setName(event.target.value)} autoComplete="name" minLength={2} required /></label><label className="label mt-4">Email<input className="input" value={email} onChange={event => setEmail(event.target.value)} type="email" autoComplete="email" required /></label><label className="label mt-4">Password<input className="input" value={password} onChange={event => setPassword(event.target.value)} type="password" autoComplete="new-password" minLength={8} required /></label><label className="label mt-4">Confirm password<input className="input" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} type="password" autoComplete="new-password" minLength={8} required /></label><button className="btn mt-6 w-full" disabled={busy}>{busy ? "Creating account…" : "Create analyst account"}</button><p className="mt-5 text-center text-sm text-slate-400">Already have access? <Link className="text-cyan-300 hover:text-cyan-200" to="/login">Sign in</Link></p></form></main>;
}
