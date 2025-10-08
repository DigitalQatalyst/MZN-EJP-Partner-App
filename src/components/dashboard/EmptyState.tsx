import React from 'react';
import { PlusIcon, BookOpenIcon } from 'lucide-react';
interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
}
export default function EmptyState({
  title,
  description,
  actionText,
  onAction
}: EmptyStateProps) {
  return <div className="text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div className="p-12 rounded-lg bg-white shadow-sm">
        <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100">
          <svg className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-base text-gray-500">{description}</p>
        <div className="mt-8 flex flex-col items-center">
          <button type="button" onClick={onAction} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            <PlusIcon className="h-5 w-5 mr-2" />
            {actionText}
          </button>
          <a href="/documentation" className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
            <span className="flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-1" />
              Browse Documentation
            </span>
          </a>
        </div>
      </div>
    </div>;
}