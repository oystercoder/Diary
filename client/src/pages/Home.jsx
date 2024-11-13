import React, { useState } from "react"; 
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards, HiMenu } from "react-icons/hi";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Diary from './Diary'; 
import Cattle from './Cattle'; 
import Dashboard from "./Dashboard";
import Employee from "./Employee";
import Wholesale from "./Wholesale";
import Products from "./Products";
import Stores from "./Stores";
import useAuth from './Auth.jsx';
import Stock from "./Stock.jsx";


export default function Home() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [, , removeCookie] = useCookies(["access_token"]); 
  const navigate = useNavigate(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  useAuth();

  const onSidebarClick = (component) => {
    setActiveComponent(component);
    setIsDropdownOpen(false); 
  };

  const handleLogout = () => {
    removeCookie("access_token");
    navigate("/"); 
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const getItemClass = (component) => {
    return activeComponent === component ? 'text-black bg-gray-300' : 'text-white hover:bg-gray-700';
  };

  return (
    <>
      <div className="flex flex-col bg-gray-100">
        {/* Navbar */}
        <div className="bg-black flex justify-between items-center p-4 min-w-full">
          <div className="text-white text-2xl lg:ml-14">Diary</div>
          <div className="md:hidden">
            <HiMenu className="text-white text-2xl" onClick={toggleDropdown} />
          </div>
          <div className="hidden md:flex">
            <button onClick={handleLogout} className="text-white">Sign Out</button>
          </div>
        </div>

        {/* Dropdown Menu for small screens */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-16 md:hidden bg-black z-20 flex flex-col items-start">
            <div className="flex flex-col ml-3 gap-2 items-start">
              <div onClick={() => onSidebarClick('dashboard')} className={`p-2 cursor-pointer ${getItemClass('dashboard')}`}>Dashboard</div>
              <div onClick={() => onSidebarClick('diary')} className={`p-2 cursor-pointer ${getItemClass('diary')}`}>Diary</div>
              <div onClick={() => onSidebarClick('cattle')} className={`p-2 cursor-pointer ${getItemClass('cattle')}`}>Cattle</div>
              <div onClick={() => onSidebarClick('stores')} className={`p-2 cursor-pointer ${getItemClass('stores')}`}>Stores</div>
              <div onClick={() => onSidebarClick('products')} className={`p-2 cursor-pointer ${getItemClass('products')}`}>Products</div>
              <div onClick={() => onSidebarClick('employee')} className={`p-2 cursor-pointer ${getItemClass('employee')}`}>Employee</div>
              <div onClick={() => onSidebarClick('wholesale')} className={`p-2 cursor-pointer ${getItemClass('wholesale')}`}>Wholesale</div>
              <div onClick={handleLogout} className="text-white p-2 cursor-pointer">Logout</div>
            </div>
          </div>
        )}

        <div className="flex flex-row">
          <div className="hidden md:flex top-0 left-0 w-1/4 lg:w-1/6 md:min-h-screen md:bg-black z-10 bg-gray-100">
            <Sidebar aria-label="Default sidebar example">
              <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col ml-3 gap-5 md:ml-10 items-start">
                  <Sidebar.Item onClick={() => onSidebarClick('dashboard')} icon={HiChartPie} className={`mt-8 gap-3 ${getItemClass('dashboard')}`}>
                    Dashboard
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('diary')} icon={HiViewBoards} className={`gap-3 ${getItemClass('diary')}`}>
                    Diary
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('cattle')} icon={HiInbox} className={`gap-3 ${getItemClass('cattle')}`}>
                    Cattle
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('stores')} icon={HiUser} className={`gap-3 ${getItemClass('stores')}`}>
                    Stores
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('products')} icon={HiShoppingBag} className={`gap-3 ${getItemClass('products')}`}>
                    Products
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('employee')} icon={HiArrowSmRight} className={`gap-3 ${getItemClass('employee')}`}>
                    Employee
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('wholesale')} icon={HiTable} className={`gap-3 ${getItemClass('wholesale')}`}>
                    Wholesale
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('stock')} icon={HiTable} className={`gap-3 ${getItemClass('stock')}`}>
                    Stock
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          </div>

          <div className="w-full bg-gray-100">
            {activeComponent === 'dashboard' && <Dashboard />}
            {activeComponent === 'diary' && <Diary />}
            {activeComponent === 'cattle' && <Cattle />}
            {activeComponent === 'employee' && <Employee />}
            {activeComponent === 'wholesale' && <Wholesale />}
            {activeComponent === 'products' && <Products />}
            {activeComponent === 'stores' && <Stores />}
            {activeComponent === 'stock' && <Stock />}
          </div>
        </div>
      </div>
    </>
  );
}
