import { ArrowRight, BadgeCheck, BrainCircuit, CircleDot, FileText, Globe2, Network, SearchCheck, ShieldAlert, Waypoints } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "../components/common/BrandMark";
import { useAuth } from "../hooks/useAuth";

const capabilities = [
  [SearchCheck, "IOC intelligence", "Normalize and enrich IPs, domains, URLs, and hashes with transparent evidence."],
  [ShieldAlert, "Explainable risk scoring", "See why an indicator is scored, not just a number without context."],
  [BrainCircuit, "Attack DNA", "Correlate techniques, behavior, and infrastructure into analyst-ready profiles."],
  [Network, "Relationship graph", "Follow evidence-backed infrastructure and indicator relationships visually."],
  [Globe2, "Infrastructure map", "Understand where related infrastructure is observed without claiming attribution."],
  [FileText, "Investigation reports", "Preserve the evidence trail in a concise, shareable investigation record."],
] as const;
const flow = ["IOC", "Enrichment", "Risk scoring", "Correlation", "Attack DNA", "Graph + map", "Report"];

export function LandingPage() {
  const { session } = useAuth();
  const destination = session ? "/dashboard" : "/login";
  const action = session ? "Open Dashboard" : "Launch CyberTrace";
  return <div className="landing-shell">
    <header className="landing-nav"><div className="site-width"><BrandMark/>
      <nav aria-label="Landing navigation"><a href="#overview">Overview</a><a href="#capabilities">Capabilities</a><a href="#how-it-works">How it works</a><a href="#architecture">Architecture</a></nav>
      <Link className="btn btn-small" to={destination}>{action}<ArrowRight size={16}/></Link>
    </div></header>
    <main>
      <section className="hero site-width" id="overview"><div className="hero-copy"><p className="eyebrow"><CircleDot size={14}/> Threat intelligence, connected</p><h1>Turn indicators into <span>intelligence.</span></h1><p className="hero-lede">CyberTrace turns raw indicators into enriched, correlated evidence—so analysts can understand the risk, behavior, and associated infrastructure behind an investigation.</p><div className="hero-actions"><Link className="btn" to={destination}>{action}<ArrowRight size={17}/></Link><a className="btn btn-quiet" href="#capabilities">Explore capabilities</a></div><p className="hero-note"><BadgeCheck size={15}/> Evidence-based correlation. Unknown stays unknown.</p></div>
        <div className="investigation-preview" aria-label="Illustrative CyberTrace investigation preview"><div className="preview-top"><span className="live-dot"/> Investigation preview <span>DEMO</span></div><div className="preview-body"><div><p className="preview-label">Indicator</p><strong>198.51.100.88</strong><p className="preview-meta">IP address · observed infrastructure</p></div><div className="risk-orb"><b>88</b><span>Risk score</span></div></div><div className="preview-grid"><div><p>Attack DNA</p><strong>Ransomware delivery</strong><small>95% confidence</small></div><div><p>Related domains</p><strong>04</strong><small>Evidence-backed links</small></div></div><div className="preview-graph"><i/><i/><i/><i/><i/><svg viewBox="0 0 400 105" aria-hidden="true"><path d="M35 80 L120 40 L205 72 L295 25 L365 65 M120 40 L205 15 L295 25"/></svg></div></div>
      </section>
      <section className="site-width concept-section"><div className="section-intro"><p className="eyebrow">One investigation language</p><h2>WHAT happened. HOW it connects. WHERE it was observed.</h2></div><div className="concept-grid"><Concept tag="WHAT" title="IOC Intelligence" text="Enrich indicators with reputation, risk, source intelligence, country, ASN, and related evidence."/><Concept tag="HOW" title="Attack DNA" text="Correlate indicators to reveal patterns, infrastructure relationships, and observed techniques."/><Concept tag="WHERE" title="Associated Infrastructure" text="Visualize infrastructure observations geographically without treating them as attacker attribution."/></div></section>
      <section className="site-width section-block" id="capabilities"><div className="section-intro"><p className="eyebrow">Built for investigation</p><h2>Evidence you can follow.</h2><p>Every surface is designed to help make the next investigative decision clearer.</p></div><div className="capability-grid">{capabilities.map(([Icon,title,text])=><article className="feature-card" key={title}><span className="feature-icon"><Icon size={20}/></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="site-width section-block" id="how-it-works"><div className="section-intro"><p className="eyebrow">From signal to case</p><h2>A disciplined investigation path.</h2></div><div className="flow-list">{flow.map((item,index)=><div className="flow-step" key={item}><span>{String(index + 1).padStart(2,"0")}</span><strong>{item}</strong>{index < flow.length - 1 && <ArrowRight size={16}/>}</div>)}</div></section>
      <section className="site-width trust-section" id="architecture"><div><p className="eyebrow">Built with restraint</p><h2>Technical credibility, without false certainty.</h2></div><ul><li>Explainable correlation and evidence-based scoring</li><li>PostgreSQL-backed investigation persistence</li><li>Backend-controlled intelligence handling</li><li>No fabricated intelligence for unknown indicators</li></ul><p className="trust-note">CyberTrace is a hackathon prototype for demonstrating an investigation workflow—not a production attribution system.</p></section>
      <section className="site-width final-cta"><div><p className="eyebrow">Ready to investigate</p><h2>Investigate smarter.</h2><p>Turn isolated indicators into a connected investigation.</p></div><Link className="btn" to={destination}>{action}<ArrowRight size={17}/></Link></section>
    </main>
    <footer className="site-width landing-footer"><BrandMark compact/><span>Built by Milanix · Hackathon prototype</span></footer>
  </div>;
}
function Concept({ tag, title, text }: { tag: string; title: string; text: string }) { return <article className="concept-card"><span>{tag}</span><h3>{title}</h3><p>{text}</p></article>; }
