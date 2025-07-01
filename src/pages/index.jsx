import Layout from "./Layout.jsx";
import Settings from "./Settings";
import Admin from "./Admin";
import LandingPage from "./LandingPage";
import Login from "./Login";
import SignUp from "./SignUp";
import ClientPage from "./ClientPage";
import Agents from "./Agents";
import Routines from "./Routines";
import Integrations from "./Integrations";
import AgentConfig from "./AgentConfig";
import ProjectReport from "./ProjectReport";
import BusinessOnboarding from "./BusinessOnboarding";
import BusinessAgentConfig from "./BusinessAgentConfig";
import WhatsAppIntegration from "./WhatsAppIntegration";
import BusinessDashboard from "./BusinessDashboard";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import Profile from "./Profile";
import TestNavigation from "./TestNavigation";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RedirectHandler from '@/components/auth/RedirectHandlerFixed';

const PAGES = {
    Settings: Settings,
    Admin: Admin,
    LandingPage: LandingPage,
    Login: Login,
    SignUp: SignUp,
    client: ClientPage,
    Agents: Agents,
    Routines: Routines,
    Integrations: Integrations,
    AgentConfig: AgentConfig,
    ProjectReport: ProjectReport,
    BusinessOnboarding: BusinessOnboarding,
    BusinessAgentConfig: BusinessAgentConfig,
    WhatsAppIntegration: WhatsAppIntegration,
    BusinessDashboard: BusinessDashboard,
    PrivacyPolicy: PrivacyPolicy,
    TermsOfService: TermsOfService,
    Profile: Profile,
    TestNavigation: TestNavigation,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <RedirectHandler>
            <Routes>            
                {/* Rota principal - LANDING PAGE PRIMEIRO */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Páginas públicas - SEM LAYOUT */}
                <Route path="/LandingPage" element={<LandingPage />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/TermsOfService" element={<TermsOfService />} />
                <Route path="/TestNavigation" element={<TestNavigation />} />
            
            {/* Páginas protegidas - COM LAYOUT */}
            <Route path="/Settings" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Settings />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/client" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <ClientPage />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Agents" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Agents />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Routines" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Routines />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Integrations" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Integrations />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/AgentConfig" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <AgentConfig />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/ProjectReport" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <ProjectReport />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/BusinessOnboarding" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <BusinessOnboarding />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/BusinessAgentConfig" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <BusinessAgentConfig />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/WhatsAppIntegration" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <WhatsAppIntegration />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/BusinessDashboard" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <BusinessDashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            
            <Route path="/Profile" element={
                <ProtectedRoute>
                    <Layout currentPageName={currentPage}>
                        <Profile />
                    </Layout>
                </ProtectedRoute>
            } />
            
            {/* Páginas que requerem admin - SEM LAYOUT PADRÃO */}
            <Route path="/Admin" element={
                <ProtectedRoute requireAdmin={true}>
                    <Admin />
                </ProtectedRoute>
            } />
        </Routes>
        </RedirectHandler>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
