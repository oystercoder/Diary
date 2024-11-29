import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { FaHome, FaStore, FaWarehouse, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { GiCow, GiMilkCarton } from "react-icons/gi";
import { MdInventory } from "react-icons/md";
import Stock from "./Stock";
import Cattle from "./Cattle";
import Diary from "./Diary";
import Employee from "./Employee";
import Products from "./Products";
import Stores from "./Stores";
import Wholesale from "./Wholesale";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { path: "dashboard", icon: <FaHome size={20} />, text: "Home" },
    { path: "cattle", icon: <GiCow size={20} />, text: "Cattle" },
    { path: "diary", icon: <GiMilkCarton size={20} />, text: "Diary" },
    { path: "employee", icon: <FaUsers size={20} />, text: "Employee" },
    { path: "products", icon: <MdInventory size={20} />, text: "Products" },
    { path: "stores", icon: <FaStore size={20} />, text: "Stores" },
    { path: "stock", icon: <MdInventory size={20} />, text: "Stock" },
    { path: "wholesale", icon: <FaWarehouse size={20} />, text: "Wholesale" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 text-center text-white">
            Dairy Farm
          </h1>
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white"
                  >
                    <span className="text-gray-400 group-hover:text-white">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.text}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white text-left"
                >
                  <span className="text-gray-400 group-hover:text-white">
                    <FaSignOutAlt size={20} />
                  </span>
                  <span className="font-medium">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        {/* Footer */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
              <FaUsers className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin Panel</p>
              <p className="text-xs text-gray-400">Dairy Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cattle" element={<Cattle />} />
            <Route path="diary" element={<Diary />} />
            <Route path="employee" element={<Employee />} />
            <Route path="products" element={<Products />} />
            <Route path="stores" element={<Stores />} />
            <Route path="stock" element={<Stock />} />
            <Route path="wholesale" element={<Wholesale />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const stats = [
    { title: "Total Cattle", value: "124", change: "+12%", icon: <GiCow size={24} /> },
    { title: "Daily Production", value: "2,450 L", change: "+5%", icon: <GiMilkCarton size={24} /> },
    { title: "Active Stores", value: "48", change: "+8%", icon: <FaStore size={24} /> },
    { title: "Employees", value: "32", change: "+3%", icon: <FaUsers size={24} /> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-green-500">{stat.change}</span>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: "New cattle added", time: "2 hours ago", type: "addition" },
            { action: "Milk production updated", time: "4 hours ago", type: "update" },
            { action: "Store inventory checked", time: "6 hours ago", type: "check" },
            { action: "Employee shift updated", time: "8 hours ago", type: "update" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'addition' ? 'bg-green-500' :
                  activity.type === 'update' ? 'bg-blue-500' : 'bg-yellow-500'
                }`} />
                <span className="font-medium">{activity.action}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
