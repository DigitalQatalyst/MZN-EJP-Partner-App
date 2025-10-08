import React from 'react';
import { CheckCircleIcon, ClockIcon, InboxIcon, ChevronRightIcon } from 'lucide-react';
interface Activity {
  message: string;
  time: string;
}
interface ActivityFeedProps {
  activities: Activity[];
  onViewAll: () => void;
}
export default function ActivityFeed({
  activities,
  onViewAll
}: ActivityFeedProps) {
  // Function to determine the icon based on the message content
  const getActivityIcon = (message: string) => {
    if (message.includes('published')) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />;
    } else if (message.includes('request')) {
      return <InboxIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />;
    } else if (message.includes('pending')) {
      return <ClockIcon className="h-5 w-5 text-amber-500" aria-hidden="true" />;
    }
    return <CheckCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />;
  };
  return <section className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>
          <button onClick={onViewAll} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
            View All
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? <div className="px-6 py-4 text-center text-gray-500">
            No recent activity to display
          </div> : activities.map((activity, index) => <div key={index} className="px-6 py-4 flex items-start hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 mr-4">
                {getActivityIcon(activity.message)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>)}
      </div>
      {activities.length > 0 && <div className="px-6 py-3 bg-gray-50 text-center">
          <button onClick={onViewAll} className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all activity
          </button>
        </div>}
    </section>;
}