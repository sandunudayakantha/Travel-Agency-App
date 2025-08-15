import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CubeIcon, 
  CalendarIcon, 
  UsersIcon, 
  TruckIcon,
  UserGroupIcon,
  ChartBarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const adminFeatures = [
    {
      title: 'Packages',
      description: 'Manage travel packages and tours',
      icon: CubeIcon,
      href: '/admin/packages',
      color: 'bg-blue-500'
    },
    {
      title: 'Bookings',
      description: 'View and manage customer bookings',
      icon: CalendarIcon,
      href: '/admin/bookings',
      color: 'bg-green-500'
    },
    {
      title: 'Users',
      description: 'Manage customer accounts',
      icon: UsersIcon,
      href: '/admin/users',
      color: 'bg-purple-500'
    },
    {
      title: 'Vehicles',
      description: 'Manage transportation fleet',
      icon: TruckIcon,
      href: '/admin/vehicles',
      color: 'bg-orange-500'
    },
    {
      title: 'Tour Guides',
      description: 'Manage tour guides and staff',
      icon: UserGroupIcon,
      href: '/admin/tour-guides',
      color: 'bg-indigo-500'
    },
    {
      title: 'Drivers',
      description: 'Manage drivers and transportation staff',
      icon: TruckIcon,
      href: '/admin/drivers',
      color: 'bg-teal-500'
    },
    {
      title: 'Places',
      description: 'Manage destinations and locations',
      icon: MapPinIcon,
      href: '/admin/places',
      color: 'bg-emerald-500'
    },
    {
      title: 'Analytics',
      description: 'View business analytics and reports',
      icon: ChartBarIcon,
      href: '/admin/analytics',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage your travel agency
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.href}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 