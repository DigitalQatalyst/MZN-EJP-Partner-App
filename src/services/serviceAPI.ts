// Mock implementation of gql for development without Apollo
export const gql = (strings, ...values) => {
  return strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || '');
  }, '');
};
// GraphQL Queries
export const GET_SERVICES = gql`
  query GetServices {
    services {
      id
      name
      description
      detailedDescription
      category
      tags
      status
      createdAt
      updatedAt
      rating
      popularity
      pricingModel
      price
      duration
      isActive
      bannerImageUrl
      contactEmail
      visibility
    }
  }
`;
export const GET_SERVICE_BY_ID = gql`
  query GetServiceById($id: ID!) {
    service(id: $id) {
      id
      name
      description
      detailedDescription
      category
      tags
      status
      createdAt
      updatedAt
      rating
      popularity
      pricingModel
      price
      duration
      isActive
      bannerImageUrl
      contactEmail
      visibility
    }
  }
`;
// GraphQL Mutations
export const CREATE_SERVICE = gql`
  mutation CreateService($input: ServiceInput!) {
    createService(input: $input) {
      id
      name
      description
      status
      createdAt
    }
  }
`;
export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: ServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      name
      description
      status
      updatedAt
    }
  }
`;
export const UPDATE_SERVICE_STATUS = gql`
  mutation UpdateServiceStatus($id: ID!, $status: String!) {
    updateServiceStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;
export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
      success
    }
  }
`;
// Service input type definition - this would match your GraphQL schema
export interface ServiceInput {
  name: string;
  description: string;
  detailedDescription: string;
  category: string;
  tags: string[];
  pricingModel: string;
  price?: string;
  duration?: string;
  isActive: boolean;
  bannerImageUrl?: string;
  contactEmail: string;
  visibility: string;
  status?: string;
}
// Mock data service - fallback when GraphQL is not available
export const mockServices = [{
  id: '1',
  name: 'Enterprise Cloud Migration',
  category: 'Consulting',
  status: 'Published',
  createdAt: '2023-06-12T10:30:00Z',
  updatedAt: '2023-07-15T14:45:00Z',
  rating: 4.8,
  popularity: 87,
  description: 'Help enterprises migrate their infrastructure to cloud platforms securely and efficiently.',
  detailedDescription: 'Our enterprise cloud migration service helps organizations transition their infrastructure, applications, and data to cloud platforms. We provide end-to-end support including assessment, planning, migration, and post-migration optimization.',
  tags: ['Cloud', 'Enterprise', 'Security'],
  pricingModel: 'Fixed',
  price: '15000',
  duration: '3-6 months',
  isActive: true,
  bannerImagePreview: 'https://source.unsplash.com/random/1200x600/?cloud',
  contactEmail: 'cloud@example.com',
  visibility: 'Public'
}, {
  id: '2',
  name: 'Data Analytics Workshop',
  category: 'Training',
  status: 'Published',
  createdAt: '2023-05-20T09:15:00Z',
  updatedAt: '2023-06-18T11:20:00Z',
  rating: 4.5,
  popularity: 64,
  description: 'Hands-on workshop for teams to learn advanced data analytics techniques and tools.',
  detailedDescription: 'This intensive workshop covers modern data analytics techniques, tools, and best practices. Participants will learn through hands-on exercises and real-world case studies.',
  tags: ['Data Analytics', 'Training', 'Remote'],
  pricingModel: 'Fixed',
  price: '2500',
  duration: '2 days',
  isActive: true,
  bannerImagePreview: 'https://source.unsplash.com/random/1200x600/?data',
  contactEmail: 'training@example.com',
  visibility: 'Public'
}, {
  id: '3',
  name: 'Custom API Development',
  category: 'Custom Development',
  status: 'Draft',
  createdAt: '2023-08-05T15:45:00Z',
  updatedAt: '2023-08-05T15:45:00Z',
  rating: 0,
  popularity: 0,
  description: 'Development of custom APIs to connect existing systems and enable data exchange.',
  detailedDescription: 'We design and develop custom APIs that connect your existing systems, enabling seamless data exchange and integration with third-party platforms.',
  tags: ['API', 'Development', 'Integration'],
  pricingModel: 'Hourly',
  price: '150',
  duration: 'Varies by project',
  isActive: true,
  bannerImagePreview: 'https://source.unsplash.com/random/1200x600/?api',
  contactEmail: 'dev@example.com',
  visibility: 'Private'
}
// Additional mock services...
];
// Service for localStorage operations (fallback)
export const localStorageServiceAPI = {
  getServices: () => {
    const services = localStorage.getItem('services');
    return services ? JSON.parse(services) : mockServices;
  },
  createService: service => {
    const newService = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 0,
      popularity: 0
    };
    const existingServices = localStorageServiceAPI.getServices();
    const updatedServices = [newService, ...existingServices];
    localStorage.setItem('services', JSON.stringify(updatedServices));
    return newService;
  },
  updateService: (id, serviceData) => {
    const existingServices = localStorageServiceAPI.getServices();
    const updatedServices = existingServices.map(service => service.id === id ? {
      ...service,
      ...serviceData,
      updatedAt: new Date().toISOString()
    } : service);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    return updatedServices.find(service => service.id === id);
  },
  updateServiceStatus: (id, status) => {
    return localStorageServiceAPI.updateService(id, {
      status
    });
  },
  deleteService: id => {
    const existingServices = localStorageServiceAPI.getServices();
    const updatedServices = existingServices.filter(service => service.id !== id);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    return {
      id,
      success: true
    };
  }
};