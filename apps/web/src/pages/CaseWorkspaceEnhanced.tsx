import { useEffect, useState } from "react";
import type { CaseStatus, CaseVerdict, InvestigationCase } from "@cybertrace/shared";
import { cases, updateCase } from "../services/data.api";

const statusLabels: Record<CaseStatus, string> = { OPEN: "Open", MONITORING: "Monitoring", ESCALATED: "Escalated", CLOSED: "Closed" };
const verdictLabels: Record<CaseVerdict, string> = { PENDING_REVIEW: "Pending review", MALICIOUS: "Malicious", SUSPICIOUS: "Suspicious", BENIGN: "Benign", INSUFFICIENT_EVIDENCE: "Insufficient evidence" };
type Draft = Pick<InvestigationCase, "title" | "status" | "verdict" | "notes">;
const draftFor = (item: InvestigationCase): Draft => ({ title: item.title, status: item.status, verdict: item.verdict, notes: item.notes });

export function CaseWorkspaceEnhanced() {
  const [items, setItems] = useState<InvestigationCase[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cases().then(result => {
      setItems(result);
      setDrafts(Object.fromEntries(result.map(item => [item.id, draftFor(item)])));
    }).catch(reason => setError(reason instanceof Error ? reason.message : "Unable to load cases.")).finally(() => setLoading(false));
  }, []);

  const updateDraft = <K extends keyof Draft>(id: string, field: K, value: Draft[K]) => {
    setDrafts(current => ({ ...current, [id]: { ...current[id], [field]: value } }));
    setMessage("");
  };

  const save = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSaving(id); setError(""); setMessage("");
    try {
      const saved = await updateCase(id, draft);
      setItems(current => current.map(item => item.id === id ? saved : item));
      setDrafts(current => ({ ...current, [id]: draftFor(saved) }));
      setMessage("Case changes saved to the persistent workspace.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save the case.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="card text-slate-400">Loading investigation cases…</div>;

  return <>
    <div className="mb-6"><h1 className="text-2xl font-bold">Case workspace</h1><p className="text-sm text-slate-400">Persistent analyst cases, findings, and workflow status.</p></div>
    {error && <div className="card mb-5 border-rose-900 text-rose-200">{error}</div>}
    {message && <div className="card mb-5 border-cyan-900 text-cyan-100">{message}</div>}
    {items.length ? <div className="space-y-5">{items.map(item => {
      const draft = drafts[item.id] ?? draftFor(item);
      return <article className="card" key={item.id}>
        <div className="flex flex-wrap justify-between gap-3"><div><input aria-label="Case title" className="input max-w-xl font-semibold" value={draft.title} onChange={event => updateDraft(item.id, "title", event.target.value)} /><p className="mt-2 text-sm text-slate-400">{item.ioc?.value ?? "IOC no longer available"} · Created {new Date(item.createdAt).toLocaleString()}</p></div><select aria-label="Case status" className="input max-w-44" value={draft.status} onChange={event => updateDraft(item.id, "status", event.target.value as CaseStatus)}>{(Object.keys(statusLabels) as CaseStatus[]).map(value => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></div>
        <div className="mt-4 grid gap-4 md:grid-cols-2"><label className="label">Analyst verdict<select className="input mt-1" value={draft.verdict} onChange={event => updateDraft(item.id, "verdict", event.target.value as CaseVerdict)}>{(Object.keys(verdictLabels) as CaseVerdict[]).map(value => <option key={value} value={value}>{verdictLabels[value]}</option>)}</select></label><label className="label">Case notes<textarea className="input mt-1 min-h-24" value={draft.notes} onChange={event => updateDraft(item.id, "notes", event.target.value)} placeholder="Add findings, owners, or response actions…" /></label></div>
        <div className="mt-4 flex items-center gap-3"><button className="btn" disabled={saving === item.id} onClick={() => save(item.id)}>{saving === item.id ? "Saving…" : "Save changes"}</button><span className="text-xs text-slate-500">Last updated {new Date(item.updatedAt).toLocaleString()}</span></div>
      </article>;
    })}</div> : <div className="card text-slate-400">Investigate an indicator, then save it to create your first persistent case.</div>}
  </>;
}
