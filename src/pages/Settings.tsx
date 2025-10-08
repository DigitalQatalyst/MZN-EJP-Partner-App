import React, { useEffect, useState, useRef } from 'react';
import { Header, AuthProvider } from '../components/Header';
import { Footer } from '../components/Footer';
import { Sidebar } from '../components/AppSidebar';
import UserRolesTab from '../components/settings/UserRolesTab';
import SecurityComplianceTab from '../components/settings/SecurityComplianceTab';
import PreferencesNotificationsTab from '../components/settings/PreferencesNotificationsTab';
import IntegrationsBillingTab from '../components/settings/IntegrationsBillingTab';
import { ChevronRightIcon, HomeIcon, ChevronLeftIcon, ChevronRightIcon as ChevronRightArrow, InfoIcon } from 'lucide-react';
import { PageLayout, PageSection, SectionHeader, SectionContent } from '../components/PageLayout';
export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabs = [{
    id: 'users-roles',
    title: 'Users & Roles',
    completion: 0,
    mandatoryCompletion: {
      percentage: 0
    }
  }, {
    id: 'security-compliance',
    title: 'Security & Compliance',
    completion: 0,
    mandatoryCompletion: {
      percentage: 0
    }
  }, {
    id: 'preferences-notifications',
    title: 'Preferences & Notifications',
    completion: 0,
    mandatoryCompletion: {
      percentage: 0
    }
  }, {
    id: 'integrations-billing',
    title: 'Integrations & Billing',
    completion: 0,
    mandatoryCompletion: {
      percentage: 0
    },
    comingSoon: true
  }];
  // Check if tabs overflow and need scrolling
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  useEffect(() => {
    const checkOverflow = () => {
      if (tabsRef.current) {
        const {
          scrollWidth,
          clientWidth
        } = tabsRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tabs]);
  const scrollTabsLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };
  const scrollTabsRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };
  const renderTabContent = () => {
    switch (activeTabIndex) {
      case 0:
        return <UserRolesTab />;
      case 1:
        return <SecurityComplianceTab />;
      case 2:
        return <PreferencesNotificationsTab />;
      case 3:
        return <IntegrationsBillingTab />;
      default:
        return <UserRolesTab />;
    }
  };
  // Close sidebar when screen size is small and user clicks outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);
  return <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex flex-1">
          {/* Sidebar - hidden by default on mobile */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeSection="settings" onSectionChange={section => console.log(`Changed to ${section}`)} />
          {/* Main content area - takes full width on mobile */}
          <div className="flex-1 w-full">
            {/* Breadcrumbs - simplified on mobile */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-2">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 text-sm text-gray-500 overflow-hidden">
                    <li className="hidden sm:block">
                      <a href="/" className="hover:text-gray-700 flex items-center">
                        Home
                      </a>
                    </li>
                    <li className="hidden sm:flex items-center">
                      <ChevronRightIcon className="h-4 w-4 mx-1" />
                      <a href="/dashboard" className="hover:text-gray-700 flex items-center">
                        Dashboard
                      </a>
                    </li>
                    <li className="flex items-center">
                      {/* Only show previous level on mobile */}
                      <span className="sm:hidden">
                        <a href="/dashboard" className="hover:text-gray-700 flex items-center">
                          <HomeIcon className="h-4 w-4 mr-1" />
                        </a>
                      </span>
                      <ChevronRightIcon className="h-4 w-4 mx-1" />
                      <span className="text-gray-900 font-medium truncate">
                        Settings
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <PageLayout title="Settings">
              <PageSection>
                <SectionHeader title="Settings" description="Configure your organization's settings, manage users, and control security preferences." />
                <SectionContent className="p-0">
                  {/* Tabs with scroll controls for mobile */}
                  <div className="border-b border-gray-200 relative">
                    <div className="px-4 md:px-8 pt-4 flex items-center">
                      {/* Mobile scroll controls - only show if needed */}
                      {showScrollButtons && <button onClick={scrollTabsLeft} className="md:hidden flex-shrink-0 p-1 mr-1 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Scroll tabs left">
                          <ChevronLeftIcon className="h-5 w-5" />
                        </button>}
                      {/* Scrollable tabs container */}
                      <div ref={tabsRef} className="flex justify-start gap-2 md:gap-6 overflow-x-auto scrollbar-hide" style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}>
                        {tabs.map((tab, index) => <div key={tab.id} className="relative group">
                            <button onClick={() => setActiveTabIndex(index)} className={`relative flex-shrink-0 flex items-center py-4 px-2 border-b-2 whitespace-nowrap text-sm ${activeTabIndex === index ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} ${tab.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={tab.comingSoon}>
                              <span className="truncate max-w-[120px]" title={tab.title}>
                                {tab.title}
                              </span>
                              {tab.comingSoon && <span className="ml-1 sm:ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  Soon
                                </span>}
                            </button>
                            {/* Tooltip for truncated text */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10">
                              <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                {tab.title}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          </div>)}
                      </div>
                      {/* Mobile scroll controls - only show if needed */}
                      {showScrollButtons && <button onClick={scrollTabsRight} className="md:hidden flex-shrink-0 p-1 ml-1 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Scroll tabs right">
                          <ChevronRightArrow className="h-5 w-5" />
                        </button>}
                    </div>
                  </div>
                  {/* Tab Content - adjust padding for mobile/desktop */}
                  <div className="p-4 md:p-6 max-w-7xl mx-auto">
                    {renderTabContent()}
                  </div>
                </SectionContent>
              </PageSection>
            </PageLayout>
          </div>
        </div>
        <Footer isLoggedIn={true} />
      </div>
      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
    </AuthProvider>;
}