import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Using Font Awesome for icons as Lucide React was used in the dynamic version
// For a static page, we can assume Font Awesome CSS is loaded globally or use inline SVGs.
// For this example, we'll assume Font Awesome is available via a CDN as in the HTML version.

function Creategroup() {
  // Dummy data for the static page
  const currentUser = {
    uid: 'static-user-id-12345',
    profession: 'Vada Pav Vendor',
    location: 'Mumbai',
  };

  const myGroups = [
    { name: 'Mumbai Vada Pav Masters', profession: 'Vada Pav Vendor', members: 5 },
    { name: 'Street Food Innovators', profession: 'Vada Pav Vendor', members: 3 },
  ];

  const allProfessions = [
    'Vada Pav Vendor',
    'Pani Puri Vendor',
    'Dosa Vendor',
    'Chai Seller',
    'Juice Stall Owner'
  ];

  const staticPeers = [
    { uid: 'static-peer-1', profession: 'Vada Pav Vendor', location: 'Mumbai' },
    { uid: 'static-peer-2', profession: 'Vada Pav Vendor', location: 'Pune' },
    { uid: 'static-peer-3', profession: 'Vada Pav Vendor', location: 'Nagpur' },
    { uid: 'static-peer-4', profession: 'Pani Puri Vendor', location: 'Delhi' },
    { uid: 'static-peer-5', profession: 'Dosa Vendor', location: 'Bengaluru' },
  ];

  const chatMessages = [
    { sender: 'ai', text: 'Hello! How can I help you create a group or find people in your sector?' },
    { sender: 'user', text: 'How do I find other Vada Pav vendors near me?' },
    { sender: 'ai', text: 'You can use the "Find Peers" section and filter by "Vada Pav Vendor" to see others in your profession. For location-based search, you\'d typically need a more dynamic application.' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-white font-inter flex flex-col md:flex-row">
        {/* Left Sidebar / User & Group Management */}
        <div className="w-full md:w-1/3 bg-gray-900 p-6 space-y-8 rounded-lg shadow-lg m-4">
          {/* User Info */}
          <div className="text-center pb-4 border-b border-gray-700">
            {/* Using Font Awesome icon */}
            <i className="fas fa-user-circle text-orange-500 text-5xl mb-2"></i>
            <h2 className="text-2xl font-bold text-orange-400">Welcome!</h2>
            <p className="text-sm text-gray-400 break-all">Your User ID: <span className="font-mono text-xs">{currentUser.uid}</span></p>
          </div>
          {/* Profession Input (Static) */}
          <div className="space-y-3">
            <label htmlFor="profession" className="block text-lg font-medium text-gray-300">
              Your Profession:
            </label>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                id="profession"
                className="flex-1 block w-full rounded-l-md border-gray-700 bg-gray-800 text-white p-3 focus:ring-orange-500 focus:border-orange-500"
                placeholder="e.g., Vada Pav Vendor"
                value={currentUser.profession}
                readOnly // Make it read-only for static page
              />
              <button
                className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-black bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
                disabled // Disable for static page
              >
                Update
              </button>
            </div>
            <p className="text-sm text-gray-400">Current: <span className="font-semibold text-orange-300">{currentUser.profession}</span></p>
          </div>
          {/* Create Group (Static) */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-300 flex items-center">
              <i className="fas fa-plus-circle text-orange-500 text-lg mr-2"></i> Create New Group
            </h3>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                className="flex-1 block w-full rounded-l-md border-gray-700 bg-gray-800 text-white p-3 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Group Name"
                value="Mumbai Vada Pav Masters"
                readOnly // Make it read-only for static page
              />
              <button
                className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-black bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
                disabled // Disable for static page
              >
                Create
              </button>
            </div>
          </div>
          {/* My Groups */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-300 flex items-center">
              <i className="fas fa-users text-orange-500 text-lg mr-2"></i> My Groups
            </h3>
            <ul className="space-y-2">
              {myGroups.map((group, index) => (
                <li key={index} className="bg-gray-800 p-3 rounded-md shadow-sm border border-gray-700">
                  <p className="font-medium text-orange-300">{group.name}</p>
                  <p className="text-sm text-gray-400">Profession: {group.profession}</p>
                  <p className="text-xs text-gray-500">Members: {group.members}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Right Content Area */}
        <div className="flex-1 flex flex-col m-4">
          {/* Peers Section */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mb-4 flex-1">
            <h3 className="text-xl font-semibold text-gray-300 flex items-center mb-4">
              <i className="fas fa-search text-orange-500 text-lg mr-2"></i> Find Peers
            </h3>
            <div className="mb-4">
              <label htmlFor="profession-filter" className="block text-sm font-medium text-gray-400 mb-1">
                Filter by Profession:
              </label>
              <select
                id="profession-filter"
                className="block w-full rounded-md border-gray-700 bg-gray-800 text-white p-2 focus:ring-orange-500 focus:border-orange-500"
                defaultValue={currentUser.profession} // Set default selected value
                disabled // Disable for static page
              >
                <option value="">All Professions</option>
                {allProfessions.map((prof, index) => (
                  <option key={index} value={prof}>{prof}</option>
                ))}
              </select>
            </div>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {staticPeers.filter(peer => peer.profession === currentUser.profession || !peer.profession).map((peer, index) => (
                <li key={index} className="bg-gray-800 p-3 rounded-md shadow-sm border border-gray-700 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">User: {peer.uid}</p>
                    <p className="text-sm text-gray-400">Profession: <span className="text-orange-300">{peer.profession}</span></p>
                    <p className="text-xs text-gray-500">Location: {peer.location}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* AI Chatbox (Static Placeholder) */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg mt-4 flex-1 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-300 flex items-center mb-4">
              <i className="fas fa-robot text-orange-500 text-lg mr-2"></i> AI Group Assistant (Static)
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-4 bg-gray-800 p-3 rounded-md">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-orange-600 text-white ml-auto' : 'bg-gray-700 text-white mr-auto'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </div>
            <form className="flex">
              <input
                type="text"
                className="flex-1 block w-full rounded-l-md border-gray-700 bg-gray-800 text-white p-3 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Type your message..."
                readOnly // Make it read-only for static page
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-black bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
                disabled // Disable for static page
              >
                <i className="fas fa-paper-plane mr-2"></i> Send
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Creategroup;
