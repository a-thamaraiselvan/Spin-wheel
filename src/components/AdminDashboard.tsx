import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  RotateCw,
  Eye,
  Gamepad2,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Staff {
  id: number;
  name: string;
  department: string;
  favorite_thing_1: string;
  favorite_thing_2: string;
  favorite_thing_3: string;
  status: 'pending' | 'completed';
  spin_count: number;
}

interface Analytics {
  totalStaff: number;
  pendingStaff: number;
  completedStaff: number;
  totalSpins: number;
}

const AdminDashboard = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
    fetchStaff();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/analytics`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/staff`);
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleSpin = (staffId: number) => {
    navigate(`/admin/spin/${staffId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin';
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'hall-mode', label: 'Hall Mode', icon: Gamepad2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <RotateCw className="w-6 h-6 mr-2 text-purple-600" />
            Professor Spin
          </h1>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-purple-50 transition-colors ${
                  activeTab === item.id ? 'bg-purple-50 border-r-2 border-purple-600 text-purple-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'staff' && 'Staff Management'}
              {activeTab === 'hall-mode' && 'Hall Mode'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'dashboard' && 'Monitor your spin wheel activities and statistics'}
              {activeTab === 'staff' && 'Manage registered staff and spin activities'}
              {activeTab === 'hall-mode' && 'Live event mode for group activities'}
              {activeTab === 'settings' && 'Configure your application settings'}
            </p>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Staff</p>
                      <p className="text-3xl font-bold">{analytics?.totalStaff || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-200" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Pending</p>
                      <p className="text-3xl font-bold">{analytics?.pendingStaff || 0}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-200" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Completed</p>
                      <p className="text-3xl font-bold">{analytics?.completedStaff || 0}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-200" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Spins</p>
                      <p className="text-3xl font-bold">{analytics?.totalSpins || 0}</p>
                    </div>
                    <RotateCw className="w-8 h-8 text-purple-200" />
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('staff')}
                    className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Users className="w-6 h-6 text-purple-600 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Manage Staff</p>
                      <p className="text-sm text-gray-600">View and spin for registered staff</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigate('/admin/hall-mode')}
                    className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Gamepad2 className="w-6 h-6 text-blue-600 mr-3" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Hall Mode</p>
                      <p className="text-sm text-gray-600">Full-screen event mode</p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Staff Tab */}
          {activeTab === 'staff' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-semibold text-gray-800">Registered Staff</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Staff Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Favorite Things
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staff.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-800">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.department}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {[member.favorite_thing_1, member.favorite_thing_2, member.favorite_thing_3].map((thing, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {thing}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                member.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {member.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                            {member.spin_count > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {member.spin_count} spin{member.spin_count > 1 ? 's' : ''}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSpin(member.id)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center"
                              >
                                <RotateCw className="w-4 h-4 mr-1" />
                                Spin
                              </motion.button>
                              {member.spin_count > 0 && (
                                <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  History
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {staff.length === 0 && (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No staff registered yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Staff members can register at the main page
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Hall Mode Tab */}
          {activeTab === 'hall-mode' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <Gamepad2 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Hall Mode</h3>
                <p className="text-gray-600 mb-6">
                  Full-screen presentation mode for live events. Perfect for staff appreciation ceremonies!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin/hall-mode')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Enter Hall Mode
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Application Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Database Connection</p>
                      <p className="text-sm text-gray-600">MySQL database status</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Connected
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">AI Integration</p>
                      <p className="text-sm text-gray-600">Gemini API for quote generation</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;