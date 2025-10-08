import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, PackageIcon, PlusIcon, StarIcon, InboxIcon, ClockIcon, CheckCircleIcon, BarChart3Icon, FileTextIcon, UserIcon, CreditCardIcon, BookOpenIcon, LifeBuoyIcon, ChevronDownIcon, ChevronRightIcon, LogOutIcon, XIcon, MenuIcon } from 'lucide-react';
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onboardingComplete?: boolean;
  companyName?: string;
}
export function Sidebar({
  isOpen,
  onClose,
  activeSection = 'dashboard',
  onSectionChange = () => {},
  onboardingComplete = false,
  companyName = 'Partner Admin'
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    services: true,
    requests: true,
    analytics: true,
    account: true,
    help: true
  });
  // Update active section based on URL path
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    if (path !== activeSection) {
      onSectionChange(path);
    }
  }, [location, activeSection, onSectionChange]);
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const handleNavigation = (section: string) => {
    onSectionChange(section);
    navigate(`/${section}`);
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  // Menu structure with sections and items
  const menuSections = [{
    id: 'main',
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
      onClick: () => handleNavigation('dashboard')
    }]
  }, {
    id: 'services',
    label: 'Services Management',
    isExpandable: true,
    items: [{
      id: 'services',
      label: 'My Services',
      icon: PackageIcon,
      onClick: () => handleNavigation('services')
    }, {
      id: 'add-service',
      label: 'Add New Service',
      icon: PlusIcon,
      onClick: () => handleNavigation('services/new')
    }, {
      id: 'reviews',
      label: 'Service Reviews',
      icon: StarIcon,
      onClick: () => handleNavigation('reviews')
    }]
  }, {
    id: 'requests',
    label: 'Requests',
    isExpandable: true,
    items: [{
      id: 'all-requests',
      label: 'All Requests',
      icon: InboxIcon,
      onClick: () => handleNavigation('requests')
    }, {
      id: 'pending',
      label: 'Pending',
      icon: ClockIcon,
      onClick: () => handleNavigation('requests/pending'),
      badge: 3
    }, {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircleIcon,
      onClick: () => handleNavigation('requests/completed')
    }]
  }, {
    id: 'analytics',
    label: 'Analytics & Insights',
    isExpandable: true,
    items: [{
      id: 'performance',
      label: 'Performance',
      icon: BarChart3Icon,
      onClick: () => handleNavigation('analytics/performance')
    }, {
      id: 'reports',
      label: 'Reports',
      icon: FileTextIcon,
      onClick: () => handleNavigation('analytics/reports')
    }]
  }, {
    id: 'account',
    label: 'Account & Organization',
    isExpandable: true,
    items: [{
      id: 'settings',
      label: 'Profile Settings',
      icon: UserIcon,
      onClick: () => handleNavigation('settings')
    }, {
      id: 'billing',
      label: 'Billing & Payments',
      icon: CreditCardIcon,
      onClick: () => handleNavigation('billing')
    }]
  }, {
    id: 'help',
    label: 'Help & Support',
    isExpandable: true,
    items: [{
      id: 'knowledge-base',
      label: 'Knowledge Base',
      icon: BookOpenIcon,
      onClick: () => handleNavigation('knowledge-base')
    }, {
      id: 'support',
      label: 'Contact Support',
      icon: LifeBuoyIcon,
      onClick: () => handleNavigation('support')
    }]
  }];
  const isActive = (id: string): boolean => {
    // Check if the current path matches the menu item
    if (id === 'dashboard' && activeSection === 'dashboard') return true;
    return location.pathname.includes(id);
  };
  return <>
      {/* Mobile backdrop */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={onClose} aria-hidden="true" />}
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 flex flex-col`} aria-label="Sidebar Navigation">
        {/* Header with logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="font-semibold text-gray-900">{companyName}</h1>
          </div>
          <button onClick={onClose} className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100" aria-label="Close sidebar">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Navigation menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuSections.map(section => <div key={section.id} className="mb-4">
              {section.label && <div className={`flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider ${section.isExpandable ? 'cursor-pointer hover:text-gray-700' : ''}`} onClick={section.isExpandable ? () => toggleSection(section.id) : undefined}>
                  <span>{section.label}</span>
                  {section.isExpandable && (expandedSections[section.id] ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />)}
                </div>}
              {(!section.isExpandable || expandedSections[section.id]) && <div className="mt-1 space-y-1">
                  {section.items.map(item => {
              const active = isActive(item.id);
              return <button key={item.id} onClick={item.onClick} className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors group ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`} aria-current={active ? 'page' : undefined}>
                        <item.icon className={`mr-3 flex-shrink-0 w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.badge}
                          </span>}
                      </button>;
            })}
                </div>}
            </div>)}
        </nav>
        {/* Footer with profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="h-8 w-8 rounded-full border border-gray-300" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                John Smith
              </p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
            <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700" aria-label="Log out">
              <LogOutIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
      {/* Mobile toggle button */}
      <button onClick={() => onClose()} className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-20" aria-label="Toggle sidebar">
        <MenuIcon className="w-6 h-6" />
      </button>
    </>;
}
export default Sidebar;