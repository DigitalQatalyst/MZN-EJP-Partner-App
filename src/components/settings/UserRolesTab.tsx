import React, { useEffect, useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon, ChevronDownIcon, ChevronUpIcon, MoreVerticalIcon } from 'lucide-react';
// Mock data for users
const mockUsers = [{
  id: 1,
  name: 'Ahmed Al Mansoori',
  email: 'ahmed@example.com',
  role: 'Admin',
  status: 'Active',
  lastLogin: '2023-09-15 10:30 AM'
}, {
  id: 2,
  name: 'Fatima Al Hashimi',
  email: 'fatima@example.com',
  role: 'Editor',
  status: 'Active',
  lastLogin: '2023-09-14 02:15 PM'
}, {
  id: 3,
  name: 'Mohammed Al Qasimi',
  email: 'mohammed@example.com',
  role: 'Viewer',
  status: 'Inactive',
  lastLogin: '2023-08-30 09:45 AM'
}, {
  id: 4,
  name: 'Aisha Al Zaabi',
  email: 'aisha@example.com',
  role: 'Admin',
  status: 'Active',
  lastLogin: '2023-09-15 08:20 AM'
}, {
  id: 5,
  name: 'Omar Al Suwaidi',
  email: 'omar@example.com',
  role: 'Editor',
  status: 'Active',
  lastLogin: '2023-09-13 04:30 PM'
}, {
  id: 6,
  name: 'Sara Al Farsi',
  email: 'sara@example.com',
  role: 'Advisor',
  status: 'Active',
  lastLogin: '2023-09-12 01:45 PM'
}];
// Mock data for roles
const mockRoles = [{
  id: 1,
  name: 'Admin',
  description: 'Full access to all features',
  permissions: [{
    name: 'User Management',
    access: 'Full'
  }, {
    name: 'Content Management',
    access: 'Full'
  }, {
    name: 'Settings',
    access: 'Full'
  }, {
    name: 'Reports',
    access: 'Full'
  }]
}, {
  id: 2,
  name: 'Editor',
  description: 'Can edit content but cannot manage users',
  permissions: [{
    name: 'User Management',
    access: 'View Only'
  }, {
    name: 'Content Management',
    access: 'Full'
  }, {
    name: 'Settings',
    access: 'View Only'
  }, {
    name: 'Reports',
    access: 'Full'
  }]
}, {
  id: 3,
  name: 'Viewer',
  description: 'View-only access to content',
  permissions: [{
    name: 'User Management',
    access: 'None'
  }, {
    name: 'Content Management',
    access: 'View Only'
  }, {
    name: 'Settings',
    access: 'None'
  }, {
    name: 'Reports',
    access: 'View Only'
  }]
}, {
  id: 4,
  name: 'Advisor',
  description: 'Can provide advice and recommendations',
  permissions: [{
    name: 'User Management',
    access: 'None'
  }, {
    name: 'Content Management',
    access: 'View Only'
  }, {
    name: 'Settings',
    access: 'None'
  }, {
    name: 'Reports',
    access: 'Full'
  }]
}];
export default function UserRolesTab() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [expandedRoleId, setExpandedRoleId] = useState<number | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);
  const toggleRoleExpand = (roleId: number) => {
    if (expandedRoleId === roleId) {
      setExpandedRoleId(null);
    } else {
      setExpandedRoleId(roleId);
    }
  };
  const toggleActionMenu = (userId: number) => {
    if (openActionMenuId === userId) {
      setOpenActionMenuId(null);
    } else {
      setOpenActionMenuId(userId);
    }
  };
  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return <div className="space-y-6">
      {/* User Management Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            User Management
          </h2>
          <button onClick={() => setShowUserModal(true)} className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Invite New User</span>
            <span className="sm:hidden">Invite</span>
          </button>
        </div>
        {/* Desktop Table View */}
        <div className="hidden md:block bg-white overflow-hidden border border-gray-200 rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map(user => <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 mr-3">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <KeyIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {mockUsers.map(user => <div key={user.id} className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="px-4 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-600">{user.role}</p>
                  </div>
                  <div className="relative">
                    <button onClick={e => {
                  e.stopPropagation();
                  toggleActionMenu(user.id);
                }} className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                      <MoreVerticalIcon className="h-5 w-5" />
                    </button>
                    {/* Action Menu */}
                    {openActionMenuId === user.id && <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <PencilIcon className="h-4 w-4 mr-2 text-blue-600" />
                            Edit User
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <TrashIcon className="h-4 w-4 mr-2 text-red-600" />
                            Delete User
                          </button>
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <KeyIcon className="h-4 w-4 mr-2 text-gray-600" />
                            Reset Password
                          </button>
                        </div>
                      </div>}
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Last Login:</span>{' '}
                    {user.lastLogin}
                  </p>
                </div>
              </div>
            </div>)}
        </div>
      </section>
      {/* Roles & Permissions Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Roles & Permissions
          </h2>
          <button className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Create New Role</span>
            <span className="sm:hidden">New Role</span>
          </button>
        </div>
        <div className="space-y-3">
          {mockRoles.map(role => <div key={role.id} className="border border-gray-200 rounded-md bg-white overflow-hidden">
              <div className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50" onClick={() => toggleRoleExpand(role.id)}>
                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
                <div>
                  {expandedRoleId === role.id ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
                </div>
              </div>
              {expandedRoleId === role.id && <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Permissions:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {role.permissions.map((permission, index) => <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {permission.name}:
                        </span>
                        <span className={`font-medium ${permission.access === 'Full' ? 'text-green-600' : permission.access === 'View Only' ? 'text-blue-600' : 'text-red-600'}`}>
                          {permission.access}
                        </span>
                      </div>)}
                  </div>
                </div>}
            </div>)}
        </div>
      </section>
      {/* External Identities & SSO Section (Coming Soon) */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              External Identities & SSO
            </h2>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              Coming Soon
            </span>
          </div>
          <button className="md:hidden" onClick={() => toggleRoleExpand(999)} // Using a special ID for this section
        >
            {expandedRoleId === 999 ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
        </div>
        {/* Desktop: Show with reduced opacity */}
        <div className="hidden md:block opacity-50 cursor-not-allowed">
          <div className="bg-white p-4 border border-gray-200 rounded-md">
            <p className="text-gray-500">
              Configure Single Sign-On and manage external identity providers.
            </p>
          </div>
        </div>
        {/* Mobile: Collapsed by default */}
        {(expandedRoleId === 999 || window.innerWidth >= 768) && <div className="md:hidden opacity-50 cursor-not-allowed">
            <div className="bg-white p-4 border border-gray-200 rounded-md">
              <p className="text-gray-500">
                Configure Single Sign-On and manage external identity providers.
              </p>
            </div>
          </div>}
      </section>
      {/* User Invite Modal */}
      {showUserModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Invite New User
              </h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Full Name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="email@example.com" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select id="role" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                    <option value="advisor">Advisor</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
              <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={() => setShowUserModal(false)}>
                Cancel
              </button>
              <button type="button" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={() => setShowUserModal(false)}>
                Send Invitation
              </button>
            </div>
          </div>
        </div>}
    </div>;
}