import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: string[];
}
export default function AddServiceModal({
  isOpen,
  onClose,
  onSubmit,
  categories
}: AddServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: categories[0],
    price: '',
    publish: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!isOpen) return null;
  const handleChange = e => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: categories[0],
        price: '',
        publish: false
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Add New Service
            </h3>
            <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose}>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="name" id="name" className={`block w-full rounded-md border ${errors.name ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2`} placeholder="e.g., Cloud Migration Consulting" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea name="description" id="description" rows={3} className={`block w-full rounded-md border ${errors.description ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2`} placeholder="Describe your service in detail..." value={formData.description} onChange={handleChange} />
                {errors.description && <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select id="category" name="category" className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2" value={formData.category} onChange={handleChange}>
                  {categories.map(category => <option key={category} value={category}>
                      {category}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input type="text" name="price" id="price" className={`block w-full rounded-md border ${errors.price ? 'border-red-300' : 'border-gray-300'} pl-7 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2`} placeholder="0.00" value={formData.price} onChange={handleChange} />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>
              <div className="flex items-center">
                <input id="publish" name="publish" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={formData.publish} onChange={handleChange} />
                <label htmlFor="publish" className="ml-2 block text-sm text-gray-700">
                  Publish immediately (otherwise saved as draft)
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
}