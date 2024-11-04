
import React, { useState } from "react"; // Import React and useState
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards, HiMenu } from "react-icons/hi";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Diary from './Diary'; // Your diary component
import Cattle from './Cattle'; // Your cattle component
import Dashboard from "./Dashboard";
import Employee from "./Employee";
import Wholesale from "./Wholesale";
import Products from "./Products";
import Stores from "./Stores";

export default function Home() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [, , removeCookie] = useCookies(["access_token"]); // Use cookies
  const navigate = useNavigate(); // Initialize navigate
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu

  const onSidebarClick = (component) => {
    setActiveComponent(component);
    setIsDropdownOpen(false); // Close dropdown when navigating
  };

  const handleLogout = () => {
    removeCookie("access_token"); // Remove the access token cookie
    navigate("/"); // Navigate to the login page
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev); // Toggle dropdown menu
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
          <div className="absolute left-0 right-0 top-16 md:hidden bg-black z-20 flex flex-col items-center">
            <div className="flex flex-col ml-3 gap-2 items-center">
              <div onClick={() => onSidebarClick('dashboard')} className="text-white p-2 cursor-pointer">Dashboard</div>
              <div onClick={() => onSidebarClick('diary')} className="text-white p-2 cursor-pointer">Diary</div>
              <div onClick={() => onSidebarClick('cattle')} className="text-white p-2 cursor-pointer">Cattle</div>
              <div onClick={() => onSidebarClick('stores')} className="text-white p-2 cursor-pointer">Stores</div>
              <div onClick={() => onSidebarClick('products')} className="text-white p-2 cursor-pointer">Products</div>
              <div onClick={() => onSidebarClick('employee')} className="text-white p-2 cursor-pointer">Employee</div>
              <div onClick={() => onSidebarClick('wholesale')} className="text-white p-2 cursor-pointer">Wholesale</div>
              <div onClick={handleLogout} className="text-white p-2 cursor-pointer">Logout</div>
            </div>
          </div>
        )}

        <div className="flex flex-row">
          <div className="hidden md:flex top-0 left-0 w-1/3 md:w-1/6 md:min-h-screen md:bg-black z-10 bg-gray-100">
            <Sidebar aria-label="Default sidebar example">
              <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col ml-3 gap-8 md:ml-10 items-center">
                  <Sidebar.Item onClick={() => onSidebarClick('dashboard')} icon={HiChartPie} className="mt-8 text-white hover:text-black">
                    Dashboard
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('diary')} icon={HiViewBoards} className='text-white hover:text-black'>
                    Diary
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('cattle')} icon={HiInbox} className='text-white hover:text-black'>
                    Cattle
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('stores')} icon={HiUser} className='text-white hover:text-black'>
                    Stores
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('products')} icon={HiShoppingBag} className='text-white hover:text-black'>
                    Products
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('employee')} icon={HiArrowSmRight} className='text-white hover:text-black'>
                    Employee
                  </Sidebar.Item>
                  <Sidebar.Item onClick={() => onSidebarClick('wholesale')} icon={HiTable} className='text-white hover:text-black'>
                    Wholesale
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
          </div>
        </div>
      </div>
    </>
  );
}
