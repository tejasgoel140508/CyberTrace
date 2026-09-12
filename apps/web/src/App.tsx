import { Navigate, Route, Routes } from "react-router-dom";
import { ComparisonPage } from "./components/investigation/AdvancedPanels";
import { CaseWorkspaceEnhanced } from "./pages/CaseWorkspaceEnhanced";
import { useAuth } from "./hooks/useAuth";
import { AppLayout } from "./layouts/AppLayout";
import { AttackDNAPage, CrimeMapPage, DashboardPage, IOCDetailsPage, IOCsPage, InvestigatePage, ReportsPage } from "./pages/AppPages";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { InnovationHub } from "./pages/InnovationHub";
import { AdminAccessManagementPage } from "./pages/AdminAccessManagementPage";

function Guard() { const { session } = useAuth(); return session ? <AppLayout /> : <Navigate to="/login" replace />; }

export default function App() {
  return <Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route element={<Guard />}><Route path="/dashboard" element={<DashboardPage />} /><Route path="/iocs" element={<IOCsPage />} /><Route path="/iocs/:id" element={<IOCDetailsPage />} /><Route path="/investigate" element={<InvestigatePage />} /><Route path="/demo" element={<InnovationHub />} /><Route path="/compare" element={<ComparisonPage />} /><Route path="/cases" element={<CaseWorkspaceEnhanced />} /><Route path="/attack-dna" element={<AttackDNAPage />} /><Route path="/crime-map" element={<CrimeMapPage />} /><Route path="/reports" element={<ReportsPage />} /><Route path="/admin/users" element={<AdminAccessManagementPage />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
