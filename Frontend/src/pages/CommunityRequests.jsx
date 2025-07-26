import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  MessageCircle, 
  ChevronDown, 
  Menu, 
  Home, 
  Users, 
  Package, 
  Truck, 
  Plus,
  HelpCircle,
  User
} from 'lucide-react';
import Navbar from '../components/Navbar';

// Dummy data
const requestsData = [
  {
    id: 1,
    user: {
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      location: "Brooklyn, NY",
      distance: "2.3 miles away"
    },
    title: "Steel Reinforcement Bars",
    category: "Construction",
    quantity: "500 units (12mm x 6m)",
    description: "Need these for a foundation project starting next week. Willing to pick up or arrange delivery. Prefer Grade 60.",
    timestamp: "15 minutes ago",
    isNew: true
  },
  {
    id: 2,
    user: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
      location: "Manhattan, NY",
      distance: "4.1 miles away"
    },
    title: "Reclaimed Wood Planks",
    category: "Woodworking",
    quantity: "200 sq ft (oak preferred)",
    description: "Looking for reclaimed wood for an interior design project. Need consistent color and thickness. Can arrange pickup.",
    timestamp: "2 hours ago",
    isNew: false
  },
  {
    id: 3,
    user: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      location: "Queens, NY",
      distance: "7.8 miles away"
    },
    title: "Copper Wiring",
    category: "Electrical",
    quantity: "1000 ft (12 AWG)",
    description: "Need copper wiring for residential rewiring project. Must be up to code and in good condition. Can collect or arrange delivery.",
    timestamp: "5 hours ago",
    isNew: false
  }
];

const vendorsData = [
  { id: 1, name: "SteelWorks Inc.", initial: "S", color: "bg-blue-500" },
  { id: 2, name: "Green Materials Co.", initial: "G", color: "bg-green-500" },
  { id: 3, name: "Timber Supplies Ltd.", initial: "T", color: "bg-purple-500" }
];

const RequestCard = ({ request }) => {
  const categoryColors = {
    Construction: "bg-blue-100 text-blue-700",
    Woodworking: "bg-green-100 text-green-700",
    Electrical: "bg-red-100 text-red-700"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={request.user.avatar}
            alt={request.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{request.user.name}</h3>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="text-orange-400 mr-1">📍</span>
              {request.user.location} • {request.user.distance}
            </p>
          </div>
        </div>
        {request.isNew && (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            New
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">{request.title}</h2>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[request.category]}`}>
            {request.category}
          </span>
        </div>
        <p className="font-medium text-gray-700 mb-2">Quantity: {request.quantity}</p>
        <p className="text-gray-600 text-sm leading-relaxed">{request.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Posted {request.timestamp}</span>
        <button className="bg-white-400 hover:bg-orange-400 text-orange-400 hover:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <MessageCircle size={16} />
          <span>Private Message</span>
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => (
  <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
    <div className="flex items-center px-6 py-4 border-b border-gray-200">
      <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center mr-3">
        <span className="text-white font-bold text-sm">R</span>
      </div>
      <span className="font-semibold text-gray-900">Raw</span>
    </div>

    <nav className="flex-1 px-4 py-6 space-y-2">
      <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <Home size={20} className="mr-3" />
        Dashboard
      </a>
      <a href="#" className="flex items-center px-3 py-2 bg-orange-50 text-orange-700 rounded-lg">
        <Users size={20} className="mr-3" />
        Community Requests
      </a>
      <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <MessageCircle size={20} className="mr-3" />
        Private Messages
      </a>
      <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <Package size={20} className="mr-3" />
        My Inventory
      </a>
      <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <Truck size={20} className="mr-3" />
        Shipments
      </a>
    </nav>

    <div className="px-4 py-6">
      <button className="w-full bg-orange-400 hover:bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 mb-6 transition-colors">
        <Plus size={20} />
        <span>New Request</span>
      </button>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recent Vendors</h3>
        <div className="space-y-2">
          {vendorsData.map(vendor => (
            <div key={vendor.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${vendor.color} rounded-full flex items-center justify-center`}>
                <span className="text-white font-semibold text-sm">{vendor.initial}</span>
              </div>
              <span className="text-sm text-gray-700">{vendor.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face"
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">John Carpenter</p>
          <p className="text-xs text-gray-500">Building Contractor</p>
        </div>
      </div>
    </div>
  </div>
);

const BottomNavigation = () => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
    <div className="flex justify-around">
      <button className="flex flex-col items-center py-2 text-gray-400">
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button className="flex flex-col items-center py-2 text-orange-400">
        <Users size={20} />
        <span className="text-xs mt-1">Requests</span>
      </button>
      <button className="flex flex-col items-center py-2 text-gray-400">
        <Plus size={20} />
        <span className="text-xs mt-1">New</span>
      </button>
      <button className="flex flex-col items-center py-2 text-gray-400">
        <User size={20} />
        <span className="text-xs mt-1">Profile</span>
      </button>
      <button className="flex flex-col items-center py-2 text-gray-400 relative">
        <Bell size={20} />
        <span className="text-xs mt-1">Alerts</span>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          3
        </span>
      </button>
    </div>
  </div>
);

const CommunityRequests = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [location, setLocation] = useState('New York, NY');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <Navbar location={location} />
        
        {/* Tabs and Filters */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-orange-400 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Requests
              </button>
              <button
                onClick={() => setActiveTab('following')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'following'
                    ? 'bg-orange-400 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Following
              </button>
              <button
                onClick={() => setActiveTab('nearby')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hidden md:block ${
                  activeTab === 'nearby'
                    ? 'bg-orange-400 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Nearby
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden md:block">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option>Most Recent</option>
                  <option>Nearest</option>
                  <option>Popular</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <main className="px-4 lg:px-6 py-6 pb-20 lg:pb-6">
          <div className="max-w-4xl">
            {requestsData.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </main>
      </div>

      {/* Help Button (Mobile) */}
      <button className="lg:hidden fixed bottom-20 right-4 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors group">
        <HelpCircle size={24} />
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Need Help?
        </div>
      </button>

      <BottomNavigation />
    </div>
  );
};

export default CommunityRequests;