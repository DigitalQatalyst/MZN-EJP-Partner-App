import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3Icon, PlusIcon, ClockIcon, TrendingUpIcon, BellIcon, SearchIcon, PackageIcon, InboxIcon, UserIcon, LayersIcon, CheckCircleIcon, MessageSquareIcon, ArrowRightIcon, ArrowUpIcon, StarIcon, DollarSignIcon, UserPlusIcon, TrendingDownIcon } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import PerformanceOverview from '../components/dashboard/PerformanceOverview';
import EmptyState from '../components/dashboard/EmptyState';
// Mock API data
const mockData = {
  summary: {
    totalServices: 5,
    published: 3,
    pending: 1,
    requests: 12
  },
  insights: {
    responseTime: {
      value: '2.3',
      unit: 'hours',
      change: -15,
      previous: '2.7'
    },
    satisfaction: {
      value: '4.8',
      scale: '5.0',
      reviews: 24
    },
    completion: {
      value: 96,
      completed: 23,
      total: 24
    }
  },
  viewsOverTime: [{
    day: 'Day 1',
    views: 50
  }, {
    day: 'Day 2',
    views: 72
  }, {
    day: 'Day 3',
    views: 120
  }, {
    day: 'Day 4',
    views: 180
  }, {
    day: 'Day 5',
    views: 140
  }, {
    day: 'Day 6',
    views: 200
  }, {
    day: 'Day 7',
    views: 250
  }],
  requestsByCategory: [{
    category: 'Consulting',
    requests: 5
  }, {
    category: 'Training',
    requests: 3
  }, {
    category: 'Digital Tools',
    requests: 4
  }],
  recentActivity: [{
    id: 1,
    message: "Service 'Cloud Migration' published",
    time: '2h ago',
    type: 'success'
  }, {
    id: 2,
    message: 'New request from Acme Corp',
    time: '4h ago',
    type: 'info',
    priority: 'high'
  }, {
    id: 3,
    message: "Service 'Analytics Workshop' pending review",
    time: '1d ago',
    type: 'warning'
  }, {
    id: 4,
    message: 'Payment received: $2,500',
    time: '2d ago',
    type: 'payment'
  }, {
    id: 5,
    message: 'New enterprise client: GlobalTech Industries',
    time: '3d ago',
    type: 'client'
  }]
};
export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<typeof mockData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  // Refs for animation
  const kpiCardsRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);
  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockData);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  // Animation effect for staggered appearance
  useEffect(() => {
    if (!isLoading && kpiCardsRef.current) {
      const cards = kpiCardsRef.current.querySelectorAll('.kpi-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-in');
        }, 100 * index);
      });
    }
    if (!isLoading && activityRef.current) {
      const items = activityRef.current.querySelectorAll('.activity-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('fade-in');
        }, 100 * index);
      });
    }
  }, [isLoading]);
  // Prepare KPI cards data
  const kpiCards = [{
    id: 'total',
    label: 'Total Services',
    value: dashboardData?.summary.totalServices || 0,
    icon: LayersIcon,
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
    subtitle: '+2 from last month',
    subtitleColor: 'text-green-600',
    subtitleIcon: TrendingUpIcon
  }, {
    id: 'published',
    label: 'Published Services',
    value: dashboardData?.summary.published || 0,
    icon: CheckCircleIcon,
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-green-400 to-green-600',
    subtitle: '60% of total',
    subtitleColor: 'text-gray-600',
    progress: 60
  }, {
    id: 'pending',
    label: 'Pending Approvals',
    value: dashboardData?.summary.pending || 0,
    icon: ClockIcon,
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-amber-400 to-amber-600',
    subtitle: 'Awaiting review',
    subtitleColor: 'text-gray-600',
    action: 'View'
  }, {
    id: 'requests',
    label: 'New Requests This Week',
    value: dashboardData?.summary.requests || 0,
    icon: InboxIcon,
    iconColor: 'text-white',
    iconBgColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
    subtitle: '+4 from last week',
    subtitleColor: 'text-green-600',
    subtitleIcon: ArrowUpIcon
  }];
  // Insight cards data
  const insightCards = [{
    id: 'response',
    title: 'Avg Response Time',
    value: dashboardData?.insights.responseTime.value || '0',
    unit: 'hours',
    icon: ClockIcon,
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    change: {
      value: dashboardData?.insights.responseTime.change || 0,
      label: (dashboardData?.insights.responseTime.change || 0) < 0 ? 'faster than last week' : 'slower than last week',
      icon: (dashboardData?.insights.responseTime.change || 0) < 0 ? TrendingDownIcon : TrendingUpIcon,
      color: (dashboardData?.insights.responseTime.change || 0) < 0 ? 'text-green-600' : 'text-red-600'
    }
  }, {
    id: 'satisfaction',
    title: 'Client Satisfaction',
    value: dashboardData?.insights.satisfaction.value || '0',
    unit: `/${dashboardData?.insights.satisfaction.scale || '5.0'}`,
    icon: StarIcon,
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    subtitle: `Based on ${dashboardData?.insights.satisfaction.reviews || 0} reviews`
  }, {
    id: 'completion',
    title: 'Completion Rate',
    value: `${dashboardData?.insights.completion.value || 0}%`,
    icon: CheckCircleIcon,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    subtitle: `${dashboardData?.insights.completion.completed || 0} of ${dashboardData?.insights.completion.total || 0} delivered`
  }];
  // Quick actions data
  const quickActions = [{
    id: 'add-service',
    title: 'Add New Service',
    description: 'Create and publish a new service offering',
    icon: <PlusIcon className="h-5 w-5 text-blue-600" />,
    benefits: ['Quick setup', 'Immediate visibility', 'Increase portfolio'],
    ctaText: 'Create Service',
    onClick: () => navigate('/services/new'),
    iconBgColor: 'bg-gradient-to-br from-blue-100 to-blue-200'
  }, {
    id: 'view-requests',
    title: 'View Requests',
    description: 'Check and respond to client service requests',
    icon: <InboxIcon className="h-5 w-5 text-purple-600" />,
    benefits: ['Manage inquiries', 'Track status', 'Prioritize responses'],
    ctaText: 'Open Requests',
    onClick: () => navigate('/requests'),
    iconBgColor: 'bg-gradient-to-br from-purple-100 to-purple-200'
  }, {
    id: 'view-analytics',
    title: 'View Analytics',
    description: 'Detailed insights about your service performance',
    icon: <BarChart3Icon className="h-5 w-5 text-green-600" />,
    benefits: ['Performance trends', 'Engagement metrics', 'Conversion data'],
    ctaText: 'See Analytics',
    onClick: () => navigate('/analytics'),
    iconBgColor: 'bg-gradient-to-br from-green-100 to-green-200'
  }, {
    id: 'manage-profile',
    title: 'Manage Profile',
    description: 'Update your organization profile and settings',
    icon: <UserIcon className="h-5 w-5 text-orange-600" />,
    benefits: ['Company details', 'Team members', 'Visibility settings'],
    ctaText: 'Edit Profile',
    onClick: () => navigate('/settings/profile'),
    iconBgColor: 'bg-gradient-to-br from-orange-100 to-orange-200'
  }];
  // Activity icon mapping
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="p-2 bg-green-50 rounded-full">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          </div>;
      case 'info':
        return <div className="p-2 bg-blue-50 rounded-full">
            <MessageSquareIcon className="h-5 w-5 text-blue-500" />
          </div>;
      case 'warning':
        return <div className="p-2 bg-amber-50 rounded-full">
            <ClockIcon className="h-5 w-5 text-amber-500" />
          </div>;
      case 'payment':
        return <div className="p-2 bg-green-50 rounded-full">
            <DollarSignIcon className="h-5 w-5 text-green-500" />
          </div>;
      case 'client':
        return <div className="p-2 bg-purple-50 rounded-full">
            <UserPlusIcon className="h-5 w-5 text-purple-500" />
          </div>;
      default:
        return <div className="p-2 bg-gray-50 rounded-full">
            <BellIcon className="h-5 w-5 text-gray-500" />
          </div>;
    }
  };
  // If the data is still loading, show a skeleton UI
  if (isLoading) {
    return <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} isLoading={true} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeSection="dashboard" onSectionChange={section => navigate(`/${section}`)} onboardingComplete={false} />
          <div className="flex-1 p-8 ml-0 md:ml-64">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse space-y-8">
                {/* Welcome Section Skeleton */}
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                {/* KPI Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => <div key={i} className="bg-white h-28 rounded-xl shadow-sm"></div>)}
                </div>
                {/* Insights Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => <div key={i} className="bg-white h-28 rounded-xl shadow-sm"></div>)}
                </div>
                {/* Charts Skeleton */}
                <div className="bg-white rounded-xl shadow-sm h-64"></div>
                {/* Quick Actions Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => <div key={i} className="bg-white h-40 rounded-xl shadow-sm"></div>)}
                </div>
                {/* Activity Feed Skeleton */}
                <div className="bg-white rounded-xl shadow-sm h-64"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer isLoggedIn={true} />
      </div>;
  }
  // If there's no services, show an empty state
  if (dashboardData && dashboardData.summary.totalServices === 0) {
    return <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeSection="dashboard" onSectionChange={section => navigate(`/${section}`)} onboardingComplete={false} />
          <div className="flex-1 p-8 ml-0 md:ml-64">
            <div className="max-w-7xl mx-auto">
              <EmptyState title="No services yet" description="Get started by adding your first service offering to the platform" actionText="Add Your First Service" onAction={() => navigate('/services/new')} />
            </div>
          </div>
        </div>
        <Footer isLoggedIn={true} />
      </div>;
  }
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeSection="dashboard" onSectionChange={section => navigate(`/${section}`)} onboardingComplete={false} companyName="Partner Admin" />
        <div className="flex-1 p-8 ml-0 md:ml-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, Partner
              </h1>
              <p className="text-gray-600 mt-1">
                Here's an overview of your services and performance
              </p>
            </div>
            {/* KPI Cards */}
            <div ref={kpiCardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiCards.map(card => <div key={card.id} className="kpi-card bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 opacity-0" style={{
              transform: 'translateY(20px)'
            }}>
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg ${card.iconBgColor} mr-4 w-12 h-12 flex items-center justify-center`}>
                      <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">
                        {card.label}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {card.value}
                      </h3>
                      {card.progress ? <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs ${card.subtitleColor}`}>
                              {card.subtitle}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{
                        width: `${card.progress}%`
                      }}></div>
                          </div>
                        </div> : card.action ? <div className="mt-1 group">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${card.subtitleColor}`}>
                              {card.subtitle}
                            </span>
                            <button className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {card.action}
                            </button>
                          </div>
                        </div> : <div className={`flex items-center mt-1 ${card.subtitleColor}`}>
                          {card.subtitleIcon && <card.subtitleIcon className="h-3 w-3 mr-1" />}
                          <span className="text-xs">{card.subtitle}</span>
                        </div>}
                    </div>
                  </div>
                </div>)}
            </div>
            {/* At a Glance Insights */}
            <div ref={insightsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {insightCards.map((card, index) => <div key={card.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300" style={{
              opacity: 0,
              transform: 'translateY(20px)',
              animation: `fadeInUp 0.5s ease-out ${index * 0.1 + 0.3}s forwards`
            }}>
                  <div className="flex items-start">
                    <div className={`${card.iconBgColor} p-3 rounded-full mr-4`}>
                      <card.icon className={`h-5 w-5 ${card.iconColor}`} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{card.title}</p>
                      <div className="flex items-baseline">
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                          {card.value}
                        </h3>
                        <span className="ml-1 text-sm text-gray-600">
                          {card.unit}
                        </span>
                      </div>
                      {card.change ? <div className={`flex items-center mt-1 ${card.change.color} text-xs`}>
                          <card.change.icon className="h-3 w-3 mr-1" />
                          <span>
                            {Math.abs(card.change.value)}% {card.change.label}
                          </span>
                        </div> : <p className="text-xs text-gray-500 mt-1">
                          {card.subtitle}
                        </p>}
                    </div>
                  </div>
                </div>)}
            </div>
            {/* Performance Overview */}
            <PerformanceOverview viewsData={dashboardData?.viewsOverTime || []} categoryData={dashboardData?.requestsByCategory || []} />
            {/* Quick Actions */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => <div key={action.id} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group" onClick={action.onClick} style={{
                opacity: 0,
                transform: 'translateY(20px)',
                animation: `fadeInUp 0.5s ease-out ${index * 0.1 + 0.5}s forwards`
              }}>
                    <div className={`${action.iconBgColor} p-4 rounded-full w-14 h-14 flex items-center justify-center mb-4`}>
                      {action.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      {action.description}
                    </p>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowRightIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>)}
              </div>
            </section>
            {/* Recent Activity */}
            <section ref={activityRef} className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Recent Activity
                </h2>
                <button onClick={() => navigate('/activities')} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center transition-colors duration-200">
                  View All
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4 mt-4">
                {dashboardData?.recentActivity.map((activity, index) => <div key={activity.id} className="activity-item flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200 opacity-0" style={{
                transitionDelay: `${index * 100}ms`
              }}>
                    <div className="flex items-start">
                      <div className="mr-4 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-800">
                            {activity.message}
                          </p>
                          {activity.priority === 'high' && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                              High Priority
                            </span>}
                        </div>
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>)}
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer isLoggedIn={true} />
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fadeInUp 0.5s ease forwards;
        }
        .fade-in {
          opacity: 1 !important;
          transition: opacity 0.5s ease;
        }
      `}</style>
    </div>;
}