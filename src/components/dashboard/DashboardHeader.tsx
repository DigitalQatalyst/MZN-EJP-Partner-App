import React from 'react';
import { BellIcon, ChevronDownIcon, MenuIcon, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface DashboardHeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  isLoading?: boolean;
}
export default function DashboardHeader({
  toggleSidebar,
  sidebarOpen,
  isLoading = false
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  return <header className="bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and hamburger */}
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden">
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center md:hidden">
              <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg" alt="Workflow" />
              <span className="ml-2 text-lg font-semibold text-gray-900 hidden sm:block">
                B2B Platform
              </span>
            </div>
          </div>
          {/* Center - Search bar */}
          <div className="w-full max-w-xl mx-auto lg:mx-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input className="block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:placeholder-gray-400 sm:text-sm transition-all duration-200" placeholder="Search services, requests, or analytics..." type="search" />
            </div>
          </div>
          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {isLoading ? <>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              </> : <>
                <button onClick={() => navigate('/notifications')} className="p-1 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <span className="sr-only">View notifications</span>
                  <div className="relative">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  </div>
                </button>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-9 w-9 rounded-full border-2 border-gray-200" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                  </div>
                  <div className="ml-3">
                    <button className="flex items-center max-w-xs text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <span className="sr-only">Open user menu</span>
                      <span className="hidden md:block">
                        TechSolutions Inc.
                      </span>
                      <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </>}
          </div>
        </div>
      </div>
    </header>;
}