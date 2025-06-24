import Layout from "./Layout.jsx";

import Settings from "./Settings";

import Admin from "./Admin";

import LandingPage from "./LandingPage";

import ClientDashboard from "./ClientDashboard";

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

import StatusPage from "./StatusPage";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Settings: Settings,
    
    Admin: Admin,
    
    LandingPage: LandingPage,
    
    ClientDashboard: ClientDashboard,
    
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
    
    StatusPage: StatusPage,
    
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
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Settings />} />
                
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/LandingPage" element={<LandingPage />} />
                
                <Route path="/ClientDashboard" element={<ClientDashboard />} />
                
                <Route path="/Agents" element={<Agents />} />
                
                <Route path="/Routines" element={<Routines />} />
                
                <Route path="/Integrations" element={<Integrations />} />
                
                <Route path="/AgentConfig" element={<AgentConfig />} />
                
                <Route path="/ProjectReport" element={<ProjectReport />} />
                
                <Route path="/BusinessOnboarding" element={<BusinessOnboarding />} />
                
                <Route path="/BusinessAgentConfig" element={<BusinessAgentConfig />} />
                
                <Route path="/WhatsAppIntegration" element={<WhatsAppIntegration />} />
                
                <Route path="/BusinessDashboard" element={<BusinessDashboard />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/StatusPage" element={<StatusPage />} />
                <Route path="/status" element={<StatusPage />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}