import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useMutation } from '@apollo/client' // Uncomment when using GraphQL
import { ArrowLeftIcon, SaveIcon, EyeIcon, ImageIcon, HomeIcon, ChevronRightIcon, PackageIcon, PlusIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import DashboardHeader from '../components/dashboard/DashboardHeader';
// Import the GraphQL mutations and mock service
// import { CREATE_SERVICE } from '../services/serviceAPI' // Uncomment when using GraphQL
import { localStorageServiceAPI, mockServices } from '../services/serviceAPI';
// Service categories
const SERVICE_CATEGORIES = ['Consulting', 'Training', 'Implementation', 'Support', 'Managed Service', 'Integration', 'Custom Development', 'Data Migration', 'Legal', 'Marketing', 'Financial', 'HR & Recruiting'];
// Service tags
const SERVICE_TAGS = ['Enterprise', 'SMB', 'Cloud', 'On-premise', 'AI', 'Security', 'Compliance', 'Data Analytics', 'DevOps', 'Remote', 'Onsite', 'Hybrid', 'Agile', 'Waterfall'];
// Pricing models
const PRICING_MODELS = ['Fixed', 'Hourly', 'Daily', 'Monthly', 'Annual', 'Custom Quote'];
// Initial form state
const initialFormState = {
  name: '',
  shortDescription: '',
  detailedDescription: '',
  category: '',
  tags: [],
  pricingModel: 'Fixed',
  price: '',
  duration: '',
  isActive: true,
  bannerImage: null,
  bannerImagePreview: '',
  supportingDocuments: [],
  contactEmail: '',
  visibility: 'Public',
  termsAgreed: false
};
export default function AddServicePage() {
  const navigate = useNavigate();
  // Uncomment the following when using GraphQL
  // const [createService, { loading: isCreatingService }] = useMutation(CREATE_SERVICE, {
  //   onCompleted: (data) => {
  //     setNotification({
  //       type: 'success',
  //       message: 'Your service has been saved successfully!',
  //     })
  //     setTimeout(() => {
  //       navigate('/services')
  //     }, 2000)
  //   },
  //   onError: (error) => {
  //     console.error('Error creating service:', error)
  //     setNotification({
  //       type: 'error',
  //       message: `Failed to save service: ${error.message}`,
  //     })
  //     setIsSubmitting(false)
  //   }
  // })
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [previewMode, setPreviewMode] = useState(false);
  // Refs for scrolling to sections
  const basicInfoRef = useRef(null);
  const serviceConfigRef = useRef(null);
  const mediaRef = useRef(null);
  const contactRef = useRef(null);
  // Handle input changes
  const handleInputChange = e => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  // Handle tag selection
  const handleTagToggle = tag => {
    setFormData(prev => {
      const currentTags = [...prev.tags];
      if (currentTags.includes(tag)) {
        return {
          ...prev,
          tags: currentTags.filter(t => t !== tag)
        };
      } else {
        return {
          ...prev,
          tags: [...currentTags, tag]
        };
      }
    });
  };
  // Handle image upload
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    // Check file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        bannerImage: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)'
      }));
      return;
    }
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        bannerImage: 'Image size should be less than 5MB'
      }));
      return;
    }
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      bannerImage: file,
      bannerImagePreview: previewUrl
    }));
    // Clear error
    if (errors.bannerImage) {
      setErrors(prev => ({
        ...prev,
        bannerImage: ''
      }));
    }
  };
  // Handle document upload
  const handleDocumentUpload = e => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    // Check file types
    const validDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const invalidFiles = files.filter(file => !validDocTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        supportingDocuments: 'Please upload valid document files (PDF, DOC, DOCX)'
      }));
      return;
    }
    // Check file sizes (max 10MB each)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        supportingDocuments: 'Document size should be less than 10MB each'
      }));
      return;
    }
    // Add files to the current list
    setFormData(prev => ({
      ...prev,
      supportingDocuments: [...prev.supportingDocuments, ...files]
    }));
    // Clear error
    if (errors.supportingDocuments) {
      setErrors(prev => ({
        ...prev,
        supportingDocuments: ''
      }));
    }
  };
  // Remove document
  const handleRemoveDocument = index => {
    setFormData(prev => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index)
    }));
  };
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.length > 200) {
      newErrors.shortDescription = 'Short description must be less than 200 characters';
    }
    if (!formData.detailedDescription.trim()) {
      newErrors.detailedDescription = 'Detailed description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (formData.tags.length === 0) {
      newErrors.tags = 'Please select at least one tag';
    }
    if (formData.pricingModel !== 'Custom Quote' && !formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (formData.pricingModel !== 'Custom Quote' && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    if (!formData.termsAgreed) {
      newErrors.termsAgreed = 'You must agree to the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission
  const handleSubmit = async action => {
    // Mark all fields as touched
    const allFields = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allFields);
    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      for (const section of ['basic', 'config', 'media', 'contact']) {
        const sectionRef = {
          basic: basicInfoRef,
          config: serviceConfigRef,
          media: mediaRef,
          contact: contactRef
        }[section];
        const sectionFields = {
          basic: ['name', 'shortDescription', 'detailedDescription', 'category', 'tags'],
          config: ['pricingModel', 'price', 'duration'],
          media: ['bannerImage', 'supportingDocuments'],
          contact: ['contactEmail', 'visibility', 'termsAgreed']
        }[section];
        const hasError = sectionFields.some(field => errors[field]);
        if (hasError && sectionRef.current) {
          setActiveSection(section);
          sectionRef.current.scrollIntoView({
            behavior: 'smooth'
          });
          break;
        }
      }
      // Show error notification
      setNotification({
        type: 'error',
        message: 'Please correct the errors before submitting.'
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      return;
    }
    setIsSubmitting(true);
    try {
      // Prepare service data for saving
      const newService = {
        name: formData.name,
        description: formData.shortDescription,
        detailedDescription: formData.detailedDescription,
        category: formData.category,
        tags: formData.tags,
        status: action === 'publish' ? 'Published' : 'Draft',
        pricingModel: formData.pricingModel,
        price: formData.price,
        duration: formData.duration,
        isActive: formData.isActive,
        contactEmail: formData.contactEmail,
        visibility: formData.visibility,
        bannerImageUrl: formData.bannerImagePreview || ''
      };
      // GraphQL API call (commented out)
      // When implementing GraphQL, uncomment and use this:
      // await createService({
      //   variables: {
      //     input: newService
      //   }
      // })
      // For now, use localStorage as a fallback
      localStorageServiceAPI.createService(newService);
      // Show success notification
      setNotification({
        type: 'success',
        message: action === 'publish' ? 'Your service has been published successfully!' : 'Your service has been saved as draft.'
      });
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/services');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle section navigation
  const handleSectionChange = section => {
    setActiveSection(section);
    const sectionRef = {
      basic: basicInfoRef,
      config: serviceConfigRef,
      media: mediaRef,
      contact: contactRef
    }[section];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeSection="services" onSectionChange={section => navigate(`/${section}`)} />
        <div className="flex-1 p-8 ml-0 md:ml-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-4 flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <button onClick={() => navigate('/dashboard')} className="hover:text-gray-700 flex items-center">
                    <HomeIcon className="h-4 w-4 mr-1" />
                    Dashboard
                  </button>
                </li>
                <li className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 mx-1" />
                  <button onClick={() => navigate('/services')} className="hover:text-gray-700">
                    Services
                  </button>
                </li>
                <li className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 mx-1" />
                  <span className="text-gray-900 font-medium">
                    Add New Service
                  </span>
                </li>
              </ol>
            </nav>
            {/* Header */}
            <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center">
                  <button onClick={() => navigate('/services')} className="mr-4 p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go back to services">
                    <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Add New Service
                  </h1>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Provide key details to create and publish a new service.
                </p>
              </div>
              <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                <button onClick={togglePreview} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <EyeIcon className="mr-2 h-4 w-4" />
                  {previewMode ? 'Exit Preview' : 'Preview'}
                </button>
                <button onClick={() => handleSubmit('draft')} disabled={isSubmitting} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save as Draft
                </button>
                <button onClick={() => handleSubmit('publish')} disabled={isSubmitting} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                  {isSubmitting ? <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircleIcon className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Publishing...' : 'Publish Service'}
                </button>
              </div>
            </div>
            {/* Notification */}
            {notification && <div className={`mb-6 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                <div className="flex items-center">
                  {notification.type === 'success' && <CheckCircleIcon className="h-5 w-5 mr-2" />}
                  {notification.type === 'error' && <XCircleIcon className="h-5 w-5 mr-2" />}
                  {notification.type === 'warning' && <AlertTriangleIcon className="h-5 w-5 mr-2" />}
                  <p>{notification.message}</p>
                </div>
              </div>}
            <div className={`flex flex-col ${previewMode ? 'lg:flex-row lg:gap-6' : ''}`}>
              {/* Main form content */}
              <div className={`${previewMode ? 'lg:w-2/3' : 'w-full'}`}>
                {/* Section navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleSectionChange('basic')} className={`px-4 py-2 text-sm rounded-md ${activeSection === 'basic' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                      Basic Information
                    </button>
                    <button onClick={() => handleSectionChange('config')} className={`px-4 py-2 text-sm rounded-md ${activeSection === 'config' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                      Service Configuration
                    </button>
                    <button onClick={() => handleSectionChange('media')} className={`px-4 py-2 text-sm rounded-md ${activeSection === 'media' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                      Media & Attachments
                    </button>
                    <button onClick={() => handleSectionChange('contact')} className={`px-4 py-2 text-sm rounded-md ${activeSection === 'contact' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                      Contact & Visibility
                    </button>
                  </div>
                </div>
                {/* Form sections */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div ref={basicInfoRef} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${activeSection !== 'basic' && !previewMode ? 'opacity-60' : ''}`}>
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        Basic Information
                      </h2>
                      {activeSection !== 'basic' && <button onClick={() => handleSectionChange('basic')} className="text-sm text-blue-600 hover:text-blue-800">
                          Edit
                        </button>}
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Service Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Service Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={`block w-full rounded-md shadow-sm sm:text-sm ${touched.name && errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="e.g., Enterprise Cloud Migration Consulting" />
                        {touched.name && errors.name && <p className="mt-1 text-sm text-red-600">
                            {errors.name}
                          </p>}
                      </div>
                      {/* Short Description */}
                      <div>
                        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Short Description{' '}
                          <span className="text-red-500">*</span>
                          <span className="ml-1 text-xs text-gray-500">
                            ({formData.shortDescription.length}/200 characters)
                          </span>
                        </label>
                        <textarea id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} rows={2} className={`block w-full rounded-md shadow-sm sm:text-sm ${touched.shortDescription && errors.shortDescription ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="Briefly describe your service in a compelling way (max 200 characters)" maxLength={200} />
                        {touched.shortDescription && errors.shortDescription && <p className="mt-1 text-sm text-red-600">
                              {errors.shortDescription}
                            </p>}
                      </div>
                      {/* Detailed Description */}
                      <div>
                        <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Detailed Description{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea id="detailedDescription" name="detailedDescription" value={formData.detailedDescription} onChange={handleInputChange} rows={6} className={`block w-full rounded-md shadow-sm sm:text-sm ${touched.detailedDescription && errors.detailedDescription ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="Provide a comprehensive description of your service, including benefits, process, and deliverables..." />
                        {touched.detailedDescription && errors.detailedDescription && <p className="mt-1 text-sm text-red-600">
                              {errors.detailedDescription}
                            </p>}
                        <p className="mt-2 text-xs text-gray-500">
                          Tip: Provide detailed information about what the
                          service includes, the process, and expected outcomes.
                        </p>
                      </div>
                      {/* Category */}
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select id="category" name="category" value={formData.category} onChange={handleInputChange} className={`block max-w-xs rounded-md shadow-sm sm:text-sm ${touched.category && errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}>
                          <option value="">Select a category</option>
                          {SERVICE_CATEGORIES.map(category => <option key={category} value={category}>
                              {category}
                            </option>)}
                        </select>
                        {touched.category && errors.category && <p className="mt-1 text-sm text-red-600">
                            {errors.category}
                          </p>}
                      </div>
                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {SERVICE_TAGS.map(tag => <button key={tag} type="button" onClick={() => handleTagToggle(tag)} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${formData.tags.includes(tag) ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'}`}>
                              {tag}
                              {formData.tags.includes(tag) && <XCircleIcon className="ml-1 h-4 w-4" />}
                            </button>)}
                        </div>
                        {touched.tags && errors.tags && <p className="mt-1 text-sm text-red-600">
                            {errors.tags}
                          </p>}
                        <p className="mt-2 text-xs text-gray-500">
                          Select all tags that apply to your service to improve
                          discoverability.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Service Configuration */}
                  <div ref={serviceConfigRef} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${activeSection !== 'config' && !previewMode ? 'opacity-60' : ''}`}>
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        Service Configuration
                      </h2>
                      {activeSection !== 'config' && <button onClick={() => handleSectionChange('config')} className="text-sm text-blue-600 hover:text-blue-800">
                          Edit
                        </button>}
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Pricing Model */}
                      <div>
                        <label htmlFor="pricingModel" className="block text-sm font-medium text-gray-700 mb-1">
                          Pricing Model <span className="text-red-500">*</span>
                        </label>
                        <select id="pricingModel" name="pricingModel" value={formData.pricingModel} onChange={handleInputChange} className="block max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                          {PRICING_MODELS.map(model => <option key={model} value={model}>
                              {model}
                            </option>)}
                        </select>
                      </div>
                      {/* Price */}
                      {formData.pricingModel !== 'Custom Quote' && <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price <span className="text-red-500">*</span>
                          </label>
                          <div className="relative rounded-md shadow-sm max-w-xs">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input type="text" id="price" name="price" value={formData.price} onChange={handleInputChange} className={`block w-full pl-7 rounded-md sm:text-sm ${touched.price && errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="0.00" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                {formData.pricingModel === 'Hourly' ? '/ hour' : formData.pricingModel === 'Daily' ? '/ day' : formData.pricingModel === 'Monthly' ? '/ month' : formData.pricingModel === 'Annual' ? '/ year' : ''}
                              </span>
                            </div>
                          </div>
                          {touched.price && errors.price && <p className="mt-1 text-sm text-red-600">
                              {errors.price}
                            </p>}
                        </div>}
                      {/* Duration */}
                      <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} className="block max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="e.g., 2 weeks, 3-6 months, Ongoing" />
                        <p className="mt-1 text-xs text-gray-500">
                          Specify the typical duration or timeframe for this
                          service.
                        </p>
                      </div>
                      {/* Availability Status */}
                      <div>
                        <div className="flex items-center">
                          <label htmlFor="isActive" className="text-sm font-medium text-gray-700 mr-3">
                            Availability Status
                          </label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only" />
                            <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                            <div className={`absolute left-0 top-0 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out transform ${formData.isActive ? 'translate-x-full border-green-500 bg-green-500' : 'border-gray-300'}`}></div>
                          </div>
                          <span className={`text-sm ${formData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                            {formData.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Toggle to indicate if this service is currently
                          available for booking.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Media & Attachments */}
                  <div ref={mediaRef} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${activeSection !== 'media' && !previewMode ? 'opacity-60' : ''}`}>
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        Media & Attachments
                      </h2>
                      {activeSection !== 'media' && <button onClick={() => handleSectionChange('media')} className="text-sm text-blue-600 hover:text-blue-800">
                          Edit
                        </button>}
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Banner Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Banner Image
                        </label>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                          {formData.bannerImagePreview ? <div className="relative w-full">
                              <img src={formData.bannerImagePreview} alt="Banner preview" className="mx-auto max-h-48 object-contain rounded-md" />
                              <button type="button" onClick={() => setFormData(prev => ({
                            ...prev,
                            bannerImage: null,
                            bannerImagePreview: ''
                          }))} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200">
                                <XCircleIcon className="w-5 h-5" />
                              </button>
                            </div> : <>
                              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-4 flex text-sm text-gray-600">
                                <label htmlFor="banner-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                  <span>Upload an image</span>
                                  <input id="banner-image-upload" name="banner-image" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </>}
                        </div>
                        {errors.bannerImage && <p className="mt-1 text-sm text-red-600">
                            {errors.bannerImage}
                          </p>}
                      </div>
                      {/* Supporting Documents */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Supporting Documents (Optional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                          <div className="flex items-center justify-center">
                            <label htmlFor="document-upload" className="relative cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload documents</span>
                              <input id="document-upload" name="documents" type="file" className="sr-only" accept=".pdf,.doc,.docx" multiple onChange={handleDocumentUpload} />
                            </label>
                          </div>
                          <p className="text-xs text-center text-gray-500 mt-2">
                            PDF, DOC, DOCX up to 10MB each
                          </p>
                          {/* Document list */}
                          {formData.supportingDocuments.length > 0 && <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Uploaded Documents
                              </h4>
                              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                                {formData.supportingDocuments.map((doc, index) => <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                      <div className="w-0 flex-1 flex items-center">
                                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-2 flex-1 w-0 truncate">
                                          {doc.name}
                                        </span>
                                      </div>
                                      <div className="ml-4 flex-shrink-0">
                                        <button type="button" onClick={() => handleRemoveDocument(index)} className="font-medium text-red-600 hover:text-red-500">
                                          Remove
                                        </button>
                                      </div>
                                    </li>)}
                              </ul>
                            </div>}
                        </div>
                        {errors.supportingDocuments && <p className="mt-1 text-sm text-red-600">
                            {errors.supportingDocuments}
                          </p>}
                      </div>
                    </div>
                  </div>
                  {/* Contact & Visibility */}
                  <div ref={contactRef} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${activeSection !== 'contact' && !previewMode ? 'opacity-60' : ''}`}>
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        Contact & Visibility
                      </h2>
                      {activeSection !== 'contact' && <button onClick={() => handleSectionChange('contact')} className="text-sm text-blue-600 hover:text-blue-800">
                          Edit
                        </button>}
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Contact Email */}
                      <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Email <span className="text-red-500">*</span>
                        </label>
                        <input type="email" id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className={`block max-w-md rounded-md shadow-sm sm:text-sm ${touched.contactEmail && errors.contactEmail ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="contact@yourcompany.com" />
                        {touched.contactEmail && errors.contactEmail && <p className="mt-1 text-sm text-red-600">
                            {errors.contactEmail}
                          </p>}
                        <p className="mt-1 text-xs text-gray-500">
                          This email will receive service inquiries and
                          requests.
                        </p>
                      </div>
                      {/* Visibility */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Visibility
                        </label>
                        <div className="space-y-4 max-w-md">
                          <div className="flex items-center">
                            <input id="visibility-public" name="visibility" type="radio" value="Public" checked={formData.visibility === 'Public'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <label htmlFor="visibility-public" className="ml-3 block text-sm font-medium text-gray-700">
                              Public{' '}
                              <span className="text-xs text-gray-500">
                                (Visible to all platform users)
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input id="visibility-private" name="visibility" type="radio" value="Private" checked={formData.visibility === 'Private'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <label htmlFor="visibility-private" className="ml-3 block text-sm font-medium text-gray-700">
                              Private{' '}
                              <span className="text-xs text-gray-500">
                                (Visible only to your team)
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input id="visibility-invite" name="visibility" type="radio" value="Invite-only" checked={formData.visibility === 'Invite-only'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <label htmlFor="visibility-invite" className="ml-3 block text-sm font-medium text-gray-700">
                              Invite-only{' '}
                              <span className="text-xs text-gray-500">
                                (Only invited enterprises can view)
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      {/* Terms & Conditions */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="termsAgreed" name="termsAgreed" type="checkbox" checked={formData.termsAgreed} onChange={handleInputChange} className={`h-4 w-4 text-blue-600 focus:ring-blue-500 ${touched.termsAgreed && errors.termsAgreed ? 'border-red-300' : 'border-gray-300'}`} />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="termsAgreed" className="font-medium text-gray-700">
                              Terms and Conditions{' '}
                              <span className="text-red-500">*</span>
                            </label>
                            <p className="text-gray-500">
                              I agree to the{' '}
                              <a href="#" className="text-blue-600 hover:text-blue-800">
                                Terms of Service
                              </a>{' '}
                              and{' '}
                              <a href="#" className="text-blue-600 hover:text-blue-800">
                                Partner Agreement
                              </a>
                              .
                            </p>
                            {touched.termsAgreed && errors.termsAgreed && <p className="mt-1 text-sm text-red-600">
                                {errors.termsAgreed}
                              </p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Footer Actions */}
                <div className="mt-8 flex justify-between items-center">
                  <button onClick={() => navigate('/services')} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Cancel and return to Services
                  </button>
                  <div className="flex space-x-3">
                    <button onClick={() => handleSubmit('draft')} disabled={isSubmitting} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                      <SaveIcon className="mr-2 h-4 w-4" />
                      Save as Draft
                    </button>
                    <button onClick={() => handleSubmit('publish')} disabled={isSubmitting} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                      {isSubmitting ? <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircleIcon className="mr-2 h-4 w-4" />}
                      {isSubmitting ? 'Publishing...' : 'Publish Service'}
                    </button>
                  </div>
                </div>
              </div>
              {/* Preview panel */}
              {previewMode && <div className="lg:w-1/3 mt-6 lg:mt-0">
                  <div className="sticky top-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h2 className="text-lg font-medium text-gray-900">
                          Service Preview
                        </h2>
                      </div>
                      <div className="p-6">
                        <div className="rounded-lg border border-gray-200 overflow-hidden">
                          {/* Preview Banner */}
                          {formData.bannerImagePreview ? <div className="w-full h-48 bg-gray-100 relative">
                              <img src={formData.bannerImagePreview} alt={formData.name || 'Service banner'} className="w-full h-full object-cover" />
                            </div> : <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                              <div className="text-center">
                                <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">
                                  No banner image
                                </p>
                              </div>
                            </div>}
                          {/* Preview Content */}
                          <div className="p-6">
                            {/* Status Badge */}
                            <div className="mb-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {formData.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {formData.visibility}
                              </span>
                            </div>
                            {/* Title & Category */}
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {formData.name || 'Service Name'}
                            </h3>
                            <p className="text-sm text-blue-600 mb-4">
                              {formData.category || 'Category'}
                            </p>
                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-6">
                              {formData.shortDescription || 'Short description of the service will appear here.'}
                            </p>
                            {/* Pricing */}
                            <div className="flex items-baseline mb-6">
                              <span className="text-2xl font-bold text-gray-900">
                                {formData.pricingModel === 'Custom Quote' ? 'Custom Quote' : formData.price ? `$${formData.price}` : '$0.00'}
                              </span>
                              {formData.pricingModel !== 'Custom Quote' && formData.pricingModel !== 'Fixed' && <span className="ml-1 text-gray-500 text-sm">
                                    / {formData.pricingModel.toLowerCase()}
                                  </span>}
                            </div>
                            {/* Tags */}
                            {formData.tags.length > 0 && <div className="mb-6">
                                <p className="text-xs text-gray-500 mb-2">
                                  Tags
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {formData.tags.map(tag => <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {tag}
                                    </span>)}
                                </div>
                              </div>}
                            {/* Duration */}
                            {formData.duration && <div className="mb-6">
                                <p className="text-xs text-gray-500 mb-1">
                                  Duration
                                </p>
                                <p className="text-sm text-gray-900">
                                  {formData.duration}
                                </p>
                              </div>}
                            {/* Contact */}
                            {formData.contactEmail && <div className="mb-6">
                                <p className="text-xs text-gray-500 mb-1">
                                  Contact
                                </p>
                                <p className="text-sm text-gray-900">
                                  {formData.contactEmail}
                                </p>
                              </div>}
                            {/* CTA Button */}
                            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium">
                              Request Service
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          <p>
                            This is how your service will appear to users on the
                            platform.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
      <Footer isLoggedIn={true} />
    </div>;
}