import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, ReferenceLine, Label, Area } from 'recharts';
import { CalendarIcon } from 'lucide-react';
interface PerformanceOverviewProps {
  viewsData: {
    day: string;
    views: number;
  }[];
  categoryData: {
    category: string;
    requests: number;
  }[];
}
export default function PerformanceOverview({
  viewsData,
  categoryData
}: PerformanceOverviewProps) {
  const [timeRange, setTimeRange] = useState('week');
  return <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Performance Overview
        </h2>
        <div className="mt-3 md:mt-0 flex items-center">
          <div className="flex gap-2">
            <button type="button" className={`inline-flex justify-center rounded-lg border shadow-sm px-4 py-2 text-sm font-medium transition-all duration-200 ${timeRange === 'week' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`} onClick={() => setTimeRange('week')}>
              This Week
            </button>
            <button type="button" className={`inline-flex justify-center rounded-lg border shadow-sm px-4 py-2 text-sm font-medium transition-all duration-200 ${timeRange === 'month' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`} onClick={() => setTimeRange('month')}>
              Last Month
            </button>
            <button type="button" className={`inline-flex justify-center items-center rounded-lg border shadow-sm px-4 py-2 text-sm font-medium transition-all duration-200 ${timeRange === 'custom' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`} onClick={() => setTimeRange('custom')}>
              <CalendarIcon className="h-4 w-4 mr-1" />
              Custom
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Service Views Line Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Service Views (Last 30 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 260]} />
                <Tooltip contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }} wrapperStyle={{
                transition: 'transform 0.2s ease',
                transform: 'scale(1.05)'
              }} />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" strokeWidth={0} />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} dot={{
                r: 4,
                fill: 'white',
                stroke: '#3b82f6',
                strokeWidth: 2
              }} activeDot={{
                r: 6,
                fill: '#3b82f6'
              }} animationDuration={1500} animationEasing="ease-in-out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Service Requests by Category Bar Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Service Requests by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#9ca3af" tick={{
                fill: '#374151',
                fontWeight: 500
              }} />
                <YAxis stroke="#9ca3af" domain={[0, 8]} />
                <Tooltip contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }} />
                <Legend />
                <Bar dataKey="requests" name="Requests" fill="url(#barGradient)" radius={[4, 4, 0, 0]} animationDuration={1500} animationEasing="ease-in-out" label={{
                position: 'top',
                fill: '#4b5563',
                fontSize: 12
              }}>
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} className="hover:opacity-80 transition-opacity duration-200" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>;
}