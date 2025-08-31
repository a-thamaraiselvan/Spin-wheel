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
  LogOut,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
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
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [paginatedStaff, setPaginatedStaff] = useState<Staff[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
    fetchStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [staff, searchTerm, departmentFilter, statusFilter]);

  useEffect(() => {
    paginateStaff();
  }, [filteredStaff, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, departmentFilter, statusFilter]);

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

  const filterStaff = () => {
    let filtered = staff;

    // Filter by search term (name or favorite things)
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.favorite_thing_1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.favorite_thing_2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.favorite_thing_3.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by department
    if (departmentFilter) {
      filtered = filtered.filter(member =>
        member.department.toLowerCase().includes(departmentFilter.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    setFilteredStaff(filtered);
  };

  const paginateStaff = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedStaff(filteredStaff.slice(startIndex, endIndex));
  };

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSpin = (staffId: number) => {
    navigate(`/admin/spin/${staffId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
  };

  // Get unique departments for filter dropdown
  const uniqueDepartments = [...new Set(staff.map(member => member.department))];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'hall-mode', label: 'Hall Mode', icon: Gamepad2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Pagination component
  const Pagination = () => {
    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of{' '}
            {filteredStaff.length} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* First Page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          
          {/* Previous Page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                disabled={pageNumber === '...'}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pageNumber === currentPage
                    ? 'bg-purple-600 text-white'
                    : pageNumber === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          {/* Next Page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {/* Last Page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg relative"
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
              {/* Search and Filter Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name or favorite things..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Department Filter */}
                  <div className="relative">
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-w-[150px]"
                    >
                      <option value="">All Departments</option>
                      {uniqueDepartments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-w-[120px]"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* Clear Filters Button */}
                  {(searchTerm || departmentFilter || statusFilter) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Clear Filters
                    </motion.button>
                  )}
                </div>

                {/* Filter Results Summary */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <p>
                    Showing {filteredStaff.length} of {staff.length} staff members
                    {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                  </p>
                  {(searchTerm || departmentFilter || statusFilter) && (
                    <div className="flex items-center space-x-2">
                      {searchTerm && (
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                          Search: "{searchTerm}"
                        </span>
                      )}
                      {departmentFilter && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          Dept: {departmentFilter}
                        </span>
                      )}
                      {statusFilter && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          Status: {statusFilter}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Staff Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-purple-600" />
                    Registered Staff
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Staff Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Favorite Things
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status & Activity
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {paginatedStaff.map((member, index) => (
                        <motion.tr 
                          key={member.id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gradient-to-r hover:from-purple-25 hover:to-blue-25 transition-all duration-200"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-lg">{member.name}</p>
                                <p className="text-sm text-gray-600 font-medium">{member.department}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap gap-2">
                              {[member.favorite_thing_1, member.favorite_thing_2, member.favorite_thing_3].map((thing, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium border border-purple-200"
                                >
                                  {thing}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col space-y-2">
                              <span
                                className={`inline-flex w-fit px-3 py-1 text-xs font-semibold rounded-full ${
                                  member.status === 'completed'
                                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                                    : 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border border-orange-200'
                                }`}
                              >
                                {member.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                              </span>
                              {member.spin_count > 0 && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <RotateCw className="w-3 h-3 mr-1" />
                                  {member.spin_count} spin{member.spin_count > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSpin(member.id)}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm flex items-center"
                              >
                                <RotateCw className="w-4 h-4 mr-2" />
                                Spin
                              </motion.button>
                              {member.spin_count > 0 && (
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm flex items-center border border-gray-300"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  History
                                </motion.button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <Pagination />

                {filteredStaff.length === 0 && staff.length > 0 && (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">No staff found</h4>
                    <p className="text-gray-500 mb-4">
                      No staff members match your current search and filter criteria
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
                    >
                      Clear All Filters
                    </motion.button>
                  </div>
                )}

                {staff.length === 0 && (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">No staff registered yet</h4>
                    <p className="text-gray-500">
                      Staff members can register at the main page to get started
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