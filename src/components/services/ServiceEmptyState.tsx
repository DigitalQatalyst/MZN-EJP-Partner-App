import React from 'react';
import { PlusIcon, PackageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface ServiceEmptyStateProps {
  onAddService?: () => void;
}
export default function ServiceEmptyState({
  onAddService
}: ServiceEmptyStateProps) {
  const navigate = useNavigate();
  const handleAddService = () => {
    if (onAddService) {
      onAddService();
    } else {
      navigate('/services/new');
    }
  };
  return <div className="text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div className="p-12 rounded-lg">
        <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-blue-100">
          <PackageIcon className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
          No services yet
        </h2>
        <p className="mt-2 text-base text-gray-500">
          Get started by adding your first service to the platform.
        </p>
        <div className="mt-8">
          <button type="button" onClick={handleAddService} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add your first service
          </button>
        </div>
      </div>
    </div>;
}