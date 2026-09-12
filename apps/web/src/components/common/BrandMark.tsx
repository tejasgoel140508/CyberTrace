import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return <Link to="/" className="brand-mark" aria-label="CyberTrace home"><span className="brand-icon"><ShieldCheck size={compact ? 17 : 20}/></span><span><strong>CyberTrace</strong>{!compact && <small>From Indicators to Intelligence.</small>}</span></Link>;
}
