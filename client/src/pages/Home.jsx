// "use client"; // Ensure this is at the top if necessary for your framework

// import React from "react"; // Import React
// import { Sidebar } from "flowbite-react";
// import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
// import { FiAlignJustify } from "react-icons/fi";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Diary from './Diary'; // Your diary component
// import Cattle from './Cattle';
//  // Your cattle component
// // import Stores from './Stores'; // Your stores component
// // import Products from './Products'; // Your products component
// // import Employee from './Employee'; // Your employee component
// // import Wholesale from './Wholesale'; // Your wholesale component

// import { useState } from "react";
// import Dashboard from "./Dashboard";
// import Employee from "./Employee";
// import Wholesale from "./Wholesale";
// import Products from "./Products";
// import Stores from "./Stores";


// export default function Home() {
//   const [activeComponent, setActiveComponent] = useState('dashboard');

//   const onSidebarClick= (component) => {
//     setActiveComponent(component);
//   };
//   return (
//     <>
//     <div className="flex flex-row">
    
//    <div className=" top-0 left-0 w-1/3 md:w-1/6 min-h-screen bg-black z-10">
//    <Sidebar aria-label="Default sidebar example">
//       <Sidebar.Items>
//         <Sidebar.ItemGroup className="flex flex-col ml-3 gap-8 md:ml-10 items-center ">
//           <Sidebar.Item onClick={() => onSidebarClick('dashboard')} icon={HiChartPie} className="mt-8 text-white">
//             Dashboard
//           </Sidebar.Item>
//           <Sidebar.Item onClick={() => onSidebarClick('diary')} icon={HiViewBoards} className='text-white'>
//             Diary
//           </Sidebar.Item>
//           <Sidebar.Item onClick={() => onSidebarClick('cattle')} icon={HiInbox} className='text-white'>
//             Cattle
//           </Sidebar.Item>
//           <Sidebar.Item onClick={() => onSidebarClick('stores')} icon={HiUser} className='text-white'>
//             Stores
//           </Sidebar.Item>
//           <Sidebar.Item onClick={() => onSidebarClick('products')} icon={HiShoppingBag} className='text-white'>
//             Products
//           </Sidebar.Item>
//           <Sidebar.Item onClick={() => onSidebarClick('employee')} icon={HiArrowSmRight} className='text-white'>
//             Employee
//           </Sidebar.Item>
//           <Sidebar.Item onClick={() => onSidebarClick('wholesale')} icon={HiTable} className='text-white'>
//             Wholesale
//           </Sidebar.Item>
//         </Sidebar.ItemGroup>
//       </Sidebar.Items>
//     </Sidebar>
   
//     </div>
//     <div className="w-full bg-gray-100">
//     {activeComponent === 'dashboard' && <Dashboard />}
//         {activeComponent === 'diary' && <Diary />}
//         {activeComponent === 'cattle' && <Cattle />}
//         {activeComponent === 'employee' && <Employee />}
//         {activeComponent === 'wholesale' && <Wholesale />}
//         {activeComponent === 'products' && <Products />}
//         {activeComponent === 'stores' && <Stores />}
     
//     </div>
//     </div>
//     </>
//   );
// }



// "use client"; // Ensure this is at the top if necessary for your framework

// import React, { useState } from "react"; // Import React and useState
// import { Sidebar } from "flowbite-react";
// import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
// import { FiAlignJustify } from "react-icons/fi";
// import Diary from './Diary'; // Your diary component
// import Cattle from './Cattle'; // Your cattle component
// import Dashboard from "./Dashboard";
// import Employee from "./Employee";
// import Wholesale from "./Wholesale";
// import Products from "./Products";
// import Stores from "./Stores";

// export default function Home() {
//   const [activeComponent, setActiveComponent] = useState('dashboard');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

//   const onSidebarClick = (component) => {
//     setActiveComponent(component);
//     setIsSidebarOpen(false); // Close sidebar on component change
//   };

//   return (
//     <>
//       <div className="flex flex-row">
//         <button
//           className="md:hidden p-2 text-white bg-black rounded"
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar visibility
//         >
//           <FiAlignJustify size={24} />
//         </button>

//         <div className={`fixed top-0 left-0 w-2/3 md:w-1/6 min-h-screen bg-black z-10 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
//           <Sidebar aria-label="Default sidebar example">
//             <Sidebar.Items>
//               <Sidebar.ItemGroup className="flex flex-col ml-3 gap-8 md:ml-10 items-center ">
//                 <Sidebar.Item onClick={() => onSidebarClick('dashboard')} icon={HiChartPie} className="mt-8 text-white">
//                   Dashboard
//                 </Sidebar.Item>
//                 <Sidebar.Item onClick={() => onSidebarClick('diary')} icon={HiViewBoards} className='text-white'>
//                   Diary
//                 </Sidebar.Item>
//                 <Sidebar.Item onClick={() => onSidebarClick('cattle')} icon={HiInbox} className='text-white'>
//                   Cattle
//                 </Sidebar.Item>
//                 <Sidebar.Item onClick={() => onSidebarClick('stores')} icon={HiUser} className='text-white'>
//                   Stores
//                 </Sidebar.Item>
//                 <Sidebar.Item onClick={() => onSidebarClick('products')} icon={HiShoppingBag} className='text-white'>
//                   Products
//                 </Sidebar.Item>
//                 <Sidebar.Item onClick={() => onSidebarClick('employee')} icon={HiArrowSmRight} className='text-white'>
//                   Employee
//                 </Sidebar.Item>
//                 <Sidebar.Item onClick={() => onSidebarClick('wholesale')} icon={HiTable} className='text-white'>
//                   Wholesale
//                 </Sidebar.Item>
//               </Sidebar.ItemGroup>
//             </Sidebar.Items>
//           </Sidebar>
//         </div>

//         <div className="w-full bg-gray-100">
//           {activeComponent === 'dashboard' && <Dashboard />}
//           {activeComponent === 'diary' && <Diary />}
//           {activeComponent === 'cattle' && <Cattle />}
//           {activeComponent === 'employee' && <Employee />}
//           {activeComponent === 'wholesale' && <Wholesale />}
//           {activeComponent === 'products' && <Products />}
//           {activeComponent === 'stores' && <Stores />}
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState } from "react"; // Import React and useState
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
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

  const onSidebarClick = (component) => {
    setActiveComponent(component);
  };

  const handleLogout = () => {
    removeCookie("access_token"); // Remove the access token cookie
    navigate("/"); // Navigate to the login page
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="hidden md:flex top-0 left-0 w-1/3 md:w-1/6 min-h-screen bg-black z-10">
          <Sidebar aria-label="Default sidebar example">
            <Sidebar.Items>
              <Sidebar.ItemGroup className="flex flex-col ml-3 gap-8 md:ml-10 items-center ">
                <Sidebar.Item onClick={() => onSidebarClick('dashboard')} icon={HiChartPie} className="mt-8 text-white">
                  Dashboard
                </Sidebar.Item>
                <Sidebar.Item onClick={() => onSidebarClick('diary')} icon={HiViewBoards} className='text-white'>
                  Diary
                </Sidebar.Item>
                <Sidebar.Item onClick={() => onSidebarClick('cattle')} icon={HiInbox} className='text-white'>
                  Cattle
                </Sidebar.Item>
                <Sidebar.Item onClick={() => onSidebarClick('stores')} icon={HiUser} className='text-white'>
                  Stores
                </Sidebar.Item>
                <Sidebar.Item onClick={() => onSidebarClick('products')} icon={HiShoppingBag} className='text-white'>
                  Products
                </Sidebar.Item>
                <Sidebar.Item onClick={() => onSidebarClick('employee')} icon={HiArrowSmRight} className='text-white'>
                  Employee
                </Sidebar.Item>
                <Sidebar.Item onClick={() => onSidebarClick('wholesale')} icon={HiTable} className='text-white'>
                  Wholesale
                </Sidebar.Item>
                <Sidebar.Item onClick={handleLogout} icon={HiArrowSmRight} className='text-white'>
                  Logout
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
    </>
  );
}
