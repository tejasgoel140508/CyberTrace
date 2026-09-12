import { Navigate, Route, Routes } from "react-router-dom";
import { CaseWorkspacePage, ComparisonPage } from "./components/investigation/AdvancedPanels";
import { useAuth } from "./hooks/useAuth";
import { AppLayout } from "./layouts/AppLayout";
import { AttackDNAPage, CrimeMapPage, DashboardPage, IOCDetailsPage, IOCsPage, InvestigatePage, ReportsPage } from "./pages/AppPages";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
function Guard(){const {session}=useAuth();return session?<AppLayout/>:<Navigate to="/login" replace/>}
export default function App(){return <Routes><Route path="/" element={<LandingPage/>}/><Route path="/login" element={<LoginPage/>}/><Route element={<Guard/>}><Route path="/dashboard" element={<DashboardPage/>}/><Route path="/iocs" element={<IOCsPage/>}/><Route path="/iocs/:id" element={<IOCDetailsPage/>}/><Route path="/investigate" element={<InvestigatePage/>}/><Route path="/compare" element={<ComparisonPage/>}/><Route path="/cases" element={<CaseWorkspacePage/>}/><Route path="/attack-dna" element={<AttackDNAPage/>}/><Route path="/crime-map" element={<CrimeMapPage/>}/><Route path="/reports" element={<ReportsPage/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
