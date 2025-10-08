import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useQuery, useMutation } from '@apollo/client' // Uncomment when using GraphQL
import {
  SearchIcon,
  PlusIcon,
  EyeIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  CheckIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  FilterIcon,
  StarIcon,
  ExternalLinkIcon,
  AlertCircleIcon,
  LoaderIcon,
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Footer } from '../components/Footer'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import ServiceEmptyState from '../components/services/ServiceEmptyState'
import AddServiceModal from '../components/services/AddServiceModal'
// Import the GraphQL queries/mutations and mock service
// import {
//   GET_SERVICES,
//   UPDATE_SERVICE_STATUS,
//   DELETE_SERVICE
// } from '../services/serviceAPI' // Uncomment when using GraphQL
import { localStorageServiceAPI, mockServices } from '../services/serviceAPI'
// Mock service categories
const serviceCategories = [
  'Consulting',
  'Training',
  'Implementation',
  'Support',
  'Managed Service',
  'Integration',
  'Custom Development',
  'Data Migration',
]
// Mock service data
const mockServices = [
  {
    id: '1',
    name: 'Enterprise Cloud Migration',
    category: 'Consulting',
    status: 'Published',
    createdAt: '2023-06-12T10:30:00Z',
    updatedAt: '2023-07-15T14:45:00Z',
    rating: 4.8,
    popularity: 87,
    description:
      'Help enterprises migrate their infrastructure to cloud platforms securely and efficiently.',
  },
  {
    id: '2',
    name: 'Data Analytics Workshop',
    category: 'Training',
    status: 'Published',
    createdAt: '2023-05-20T09:15:00Z',
    updatedAt: '2023-06-18T11:20:00Z',
    rating: 4.5,
    popularity: 64,
    description:
      'Hands-on workshop for teams to learn advanced data analytics techniques and tools.',
  },
  {
    id: '3',
    name: 'Custom API Development',
    category: 'Custom Development',
    status: 'Draft',
    createdAt: '2023-08-05T15:45:00Z',
    updatedAt: '2023-08-05T15:45:00Z',
    rating: 0,
    popularity: 0,
    description:
      'Development of custom APIs to connect existing systems and enable data exchange.',
  },
  {
    id: '4',
    name: 'Security Compliance Audit',
    category: 'Consulting',
    status: 'Published',
    createdAt: '2023-04-10T13:20:00Z',
    updatedAt: '2023-07-22T09:30:00Z',
    rating: 4.9,
    popularity: 92,
    description:
      'Comprehensive security audit to ensure compliance with industry regulations.',
  },
  {
    id: '5',
    name: 'DevOps Pipeline Setup',
    category: 'Implementation',
    status: 'Published',
    createdAt: '2023-07-01T11:10:00Z',
    updatedAt: '2023-07-25T16:40:00Z',
    rating: 4.6,
    popularity: 78,
    description:
      'Implementation of CI/CD pipelines to streamline software development and deployment.',
  },
  {
    id: '6',
    name: 'Legacy System Integration',
    category: 'Integration',
    status: 'Draft',
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2023-08-11T14:20:00Z',
    rating: 0,
    popularity: 0,
    description:
      'Connect legacy systems with modern applications for seamless data flow.',
  },
  {
    id: '7',
    name: '24/7 Technical Support',
    category: 'Support',
    status: 'Archived',
    createdAt: '2022-11-15T08:30:00Z',
    updatedAt: '2023-05-20T09:45:00Z',
    rating: 4.2,
    popularity: 56,
    description:
      'Round-the-clock technical support for critical enterprise systems.',
  },
]
// Status badge component
const StatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100'
  let textColor = 'text-gray-800'
  let icon = null
  switch (status) {
    case 'Published':
      bgColor = 'bg-green-100'
      textColor = 'text-green-800'
      icon = <CheckIcon className="w-3 h-3 mr-1" />
      break
    case 'Draft':
      bgColor = 'bg-yellow-100'
      textColor = 'text-yellow-800'
      icon = <EditIcon className="w-3 h-3 mr-1" />
      break
    case 'Archived':
      bgColor = 'bg-gray-100'
      textColor = 'text-gray-800'
      icon = <XIcon className="w-3 h-3 mr-1" />
      break
    default:
      break
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {icon}
      {status}
    </span>
  )
}
// Rating stars component
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  if (rating === 0) {
    return <span className="text-xs text-gray-500">No ratings yet</span>
  }
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400 fill-current"
        />
      ))}
      {hasHalfStar && (
        <div className="relative w-4 h-4">
          <StarIcon className="absolute w-4 h-4 text-gray-300 fill-current" />
          <div className="absolute overflow-hidden w-2 h-4">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300 fill-current"
        />
      ))}
      <span className="ml-1 text-xs text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )
}
// Format date function
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
export default function ServicesPage() {
  const navigate = useNavigate()
  // Uncomment the following when using GraphQL
  // const { loading: isLoadingServices, error: servicesError, data: servicesData, refetch: refetchServices } = useQuery(GET_SERVICES)
  // const [updateServiceStatus] = useMutation(UPDATE_SERVICE_STATUS, {
  //   onCompleted: () => {
  //     setNotification({
  //       type: 'success',
  //       message: 'Service status updated successfully.',
  //     })
  //     refetchServices()
  //   },
  //   onError: (error) => {
  //     console.error('Error updating service status:', error)
  //     setNotification({
  //       type: 'error',
  //       message: `Failed to update service: ${error.message}`,
  //     })
  //   }
  // })
  // const [deleteService] = useMutation(DELETE_SERVICE, {
  //   onCompleted: () => {
  //     setNotification({
  //       type: 'success',
  //       message: 'Service deleted successfully.',
  //     })
  //     refetchServices()
  //   },
  //   onError: (error) => {
  //     console.error('Error deleting service:', error)
  //     setNotification({
  //       type: 'error',
  //       message: `Failed to delete service: ${error.message}`,
  //     })
  //   }
  // })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [services, setServices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [sortOrder, setSortOrder] = useState('desc')
  const [notification, setNotification] = useState(null)
  // Fetch services from API or use localStorage as fallback
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true)
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1200))
        // When using GraphQL, uncomment this:
        // if (servicesData && servicesData.services) {
        //   setServices(servicesData.services)
        // } else {
        //   // Fallback to localStorage if GraphQL data is not available
        //   setServices(localStorageServiceAPI.getServices())
        // }
        // For now, use localStorage
        setServices(localStorageServiceAPI.getServices())
      } catch (error) {
        console.error('Error fetching services:', error)
        // Fallback to mock data if localStorage fails
        setServices(mockServices)
      } finally {
        setIsLoading(false)
      }
    }
    fetchServices()
    // When using GraphQL, add these dependencies: [servicesData, refetchServices]
  }, [])
  // Handle service deletion
  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        // GraphQL API call (commented out)
        // When implementing GraphQL, uncomment and use this:
        // deleteService({
        //   variables: { id: serviceId }
        // })
        // For now, use localStorage
        localStorageServiceAPI.deleteService(serviceId)
        // Update UI immediately without waiting for refetch
        const updatedServices = services.filter(
          (service) => service.id !== serviceId,
        )
        setServices(updatedServices)
        setNotification({
          type: 'success',
          message: 'Service deleted successfully.',
        })
      } catch (error) {
        console.error('Error deleting service:', error)
        setNotification({
          type: 'error',
          message: 'Failed to delete service. Please try again.',
        })
      }
      setTimeout(() => {
        setNotification(null)
      }, 4000)
    }
  }
  // Handle status change
  const handleStatusChange = (serviceId, newStatus) => {
    try {
      // GraphQL API call (commented out)
      // When implementing GraphQL, uncomment and use this:
      // updateServiceStatus({
      //   variables: {
      //     id: serviceId,
      //     status: newStatus
      //   }
      // })
      // For now, use localStorage
      localStorageServiceAPI.updateServiceStatus(serviceId, newStatus)
      // Update UI immediately without waiting for refetch
      const updatedServices = services.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : service,
      )
      setServices(updatedServices)
      setNotification({
        type: 'success',
        message: `Service ${newStatus === 'Published' ? 'published' : newStatus === 'Archived' ? 'archived' : 'saved as draft'} successfully.`,
      })
    } catch (error) {
      console.error('Error updating service status:', error)
      setNotification({
        type: 'error',
        message: 'Failed to update service status. Please try again.',
      })
    }
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }
  // Filter and sort services
  const filteredAndSortedServices = services
    .filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'All' || service.status === statusFilter
      const matchesCategory =
        categoryFilter === 'All' || service.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'newest':
          comparison = new Date(b.createdAt) - new Date(a.createdAt)
          break
        case 'popularity':
          comparison = b.popularity - a.popularity
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'rating':
          comparison = b.rating - a.rating
          break
        default:
          comparison = new Date(b.updatedAt) - new Date(a.updatedAt)
      }
      return sortOrder === 'asc' ? -comparison : comparison
    })
  // Toggle sort order
  const toggleSortOrder = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }
  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? (
      <ArrowUpIcon className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 ml-1" />
    )
  }
  // Handle view published services
  const handleViewPublishedServices = () => {
    // In a real app, this would navigate to a public view
    // For now, we'll just filter to show only published services
    setStatusFilter('Published')
    setNotification({
      type: 'info',
      message:
        'Showing only published services. In a real app, this would navigate to the public view.',
    })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }
  // If the data is still loading, show a skeleton UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardHeader
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="flex flex-1">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeSection="services"
            onSectionChange={(section) => navigate(`/${section}`)}
          />
          <div className="flex-1 p-8 ml-0 md:ml-64">
            <div className="max-w-7xl mx-auto">
              <div className="p-8 flex flex-col items-center justify-center">
                <LoaderIcon className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Loading services...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer isLoggedIn={true} />
      </div>
    )
  } else if (services.length === 0) {
    // Empty state
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardHeader
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="flex flex-1">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeSection="services"
            onSectionChange={(section) => navigate(`/${section}`)}
          />
          <div className="flex-1 p-8 ml-0 md:ml-64">
            <div className="max-w-7xl mx-auto">
              <ServiceEmptyState
                onAddService={() => navigate('/services/new')}
              />
            </div>
          </div>
        </div>
        <Footer isLoggedIn={true} />
      </div>
    )
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection="services"
          onSectionChange={(section) => navigate(`/${section}`)}
        />
        <div className="flex-1 p-8 ml-0 md:ml-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    My Services
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Manage and publish services visible to enterprise users.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleViewPublishedServices}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Published Services
                  </button>
                  <button
                    onClick={() => navigate('/services/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add New Service
                  </button>
                </div>
              </div>
            </div>
            {/* Filter and search section */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search services by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div>
                    <label
                      htmlFor="status-filter"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="status-filter"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="category-filter"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="category-filter"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      {serviceCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="sort-by"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Sort By
                    </label>
                    <select
                      id="sort-by"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value)
                        // Reset sort order when changing sort field
                        setSortOrder('desc')
                      }}
                    >
                      <option value="newest">Newest</option>
                      <option value="popularity">Most Popular</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Notification */}
            {notification && (
              <div
                className={`mb-6 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : notification.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}
              >
                <div className="flex items-center">
                  {notification.type === 'success' && (
                    <CheckIcon className="h-5 w-5 mr-2" />
                  )}
                  {notification.type === 'error' && (
                    <AlertCircleIcon className="h-5 w-5 mr-2" />
                  )}
                  {notification.type === 'info' && (
                    <ExternalLinkIcon className="h-5 w-5 mr-2" />
                  )}
                  <p>{notification.message}</p>
                </div>
              </div>
            )}
            {/* Main content */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              {isLoading ? (
                // Loading state
                <div className="p-8 flex flex-col items-center justify-center">
                  <LoaderIcon className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-600">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                // Empty state
                <ServiceEmptyState
                  onAddService={() => navigate('/services/new')}
                />
              ) : filteredAndSortedServices.length === 0 ? (
                // No results state
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-gray-100 rounded-full mb-4">
                    <FilterIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No matching services
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filter criteria to find what
                    you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('All')
                      setCategoryFilter('All')
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                // Service table
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSortOrder('name')}
                        >
                          <div className="flex items-center">
                            Service Name
                            {renderSortIndicator('name')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSortOrder('newest')}
                        >
                          <div className="flex items-center">
                            Created
                            {renderSortIndicator('newest')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSortOrder('rating')}
                        >
                          <div className="flex items-center">
                            Rating
                            {renderSortIndicator('rating')}
                          </div>
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedServices.map((service) => (
                        <tr
                          key={service.id}
                          className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-0">
                                <div className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                  {service.name}
                                </div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {service.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {service.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={service.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(service.createdAt)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Updated: {formatDate(service.updatedAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RatingStars rating={service.rating} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() =>
                                  navigate(`/services/${service.id}/edit`)
                                }
                              >
                                <EditIcon className="w-4 h-4" />
                                <span className="sr-only">Edit</span>
                              </button>
                              {service.status !== 'Published' ? (
                                <button
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() =>
                                    handleStatusChange(service.id, 'Published')
                                  }
                                >
                                  <CheckIcon className="w-4 h-4" />
                                  <span className="sr-only">Publish</span>
                                </button>
                              ) : (
                                <button
                                  className="text-yellow-600 hover:text-yellow-900"
                                  onClick={() =>
                                    handleStatusChange(service.id, 'Draft')
                                  }
                                >
                                  <XIcon className="w-4 h-4" />
                                  <span className="sr-only">Unpublish</span>
                                </button>
                              )}
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteService(service.id)}
                              >
                                <TrashIcon className="w-4 h-4" />
                                <span className="sr-only">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer isLoggedIn={true} />
    </div>
  )
}
