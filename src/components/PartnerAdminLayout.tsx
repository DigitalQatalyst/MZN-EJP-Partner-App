import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './Sidebar';
interface PartnerAdminLayoutProps {
  children: React.ReactNode;
}
const PartnerAdminLayout: React.FC<PartnerAdminLayoutProps> = ({
  children
}) => {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const handleNavigation = (path: string) => {
    setCurrentPath(path);
    // In a real app, you'd use router navigation here
    console.log(`Navigating to: ${path}`);
  };
  return <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar onNavigate={handleNavigation} />
        <div className="flex-1 md:ml-64">
          <main className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              {currentPath.split('/').pop()?.charAt(0).toUpperCase() + currentPath.split('/').pop()?.slice(1) || 'Dashboard'}
            </h1>
            {children}
          </main>
        </div>
      </div>
    </Router>;
};
export default PartnerAdminLayout;