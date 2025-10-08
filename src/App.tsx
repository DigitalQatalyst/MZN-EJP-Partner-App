import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout, PageSection, SectionHeader, SectionContent, PrimaryButton } from './components/PageLayout';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/dashboard/DashboardHeader';
import { Footer } from './components/Footer';
export function App() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeSection="dashboard" onSectionChange={section => navigate(`/${section}`)} onboardingComplete={false} companyName="Partner Admin" />
        <div className="flex-1 transition-all duration-300 md:ml-64">
          {navigate('/dashboard')}
        </div>
      </div>
      <Footer isLoggedIn={true} />
    </div>;
}