// import React, { useState } from 'react';
// import axios from 'axios'

// const Employee = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [name, setName] = useState('');
//   const [location, setLocation] = useState('');
//   const [contactNumber, setContactNumber] = useState('');
//   const [role, setRole] = useState('');
//   const [joiningDate, setJoiningDate] = useState('');
//   const [salary, setSalary] = useState('');
//   const [idProof, setIdProof] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const toggleForm = () => {
//     setShowForm(!showForm);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('name', name);
    
//     formData.append('location', location);
//     formData.append('contactNumber', contactNumber);
//     formData.append('role', role);
//     formData.append('joiningDate', joiningDate);
//     formData.append('salary', salary);
//     formData.append('idProof', idProof);

//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('http://localhost:3001/employees', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.status!=201) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       console.log(data);

//       // Resetting the form
//       setName('');
//       setLocation('');
//       setContactNumber('');
//       setRole('');
//       setJoiningDate('');
//       setSalary('');
//       setIdProof(null);
//     } catch (error) {
//       setError('Error adding employee: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="flex justify-between w-full">
//         <span className="text-center mt-8 ml-11 items-start">Employee Details:</span>
//         <span className='text-center mt-8 bg-gray-500 p-3 rounded-lg mr-14'>
//           <button onClick={toggleForm} className="font-semibold items-end text-white">
//             ADD EMPLOYEE
//           </button>
//         </span>
//       </div>

//       {/* Form Container */}
//       {showForm && (
//         <div className="flex justify-center mt-4 w-full">
//           <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full m-11">
//             <div className="mb-4">
//               <label className="block text-gray-700">Name:</label>
//               <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-lg w-full p-2" required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Location:</label>
//               <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="border rounded-lg w-full p-2" required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Contact Number:</label>
//               <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="border rounded-lg w-full p-2" required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Role:</label>
//               <select value={role} onChange={(e) => setRole(e.target.value)} className="border rounded-lg w-full p-2" required>
//                 <option value="" disabled>Select a role</option>
//                 <option value="manager">Manager</option>
//                 <option value="labour">Labour</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-900">ID Proof:</label>
//               <input type="file" accept="image/*" onChange={(e) => setIdProof(e.target.files[0])} className='border border-gray-300 rounded-lg w-full p-2 text-gray-700' required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-900">Joining Date:</label>
//               <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500' required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Salary:</label>
//               <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="border rounded-lg w-full p-2" required />
//             </div>
//             {error && <div className="text-red-500 font-semibold">{error}</div>}
//             <div className="flex justify-center mt-4">
//               <button type="submit" className="bg-black flex items-center text-white p-2 rounded-lg" disabled={loading}>
//                 {loading ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </>
//   );
// };

// export default Employee;





// import React, { useState, useEffect } from 'react';

// const Employee = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [showView, setShowView] = useState(false); // State to control employee view
//   const [name, setName] = useState('');
//   const [location, setLocation] = useState('');
//   const [contactNumber, setContactNumber] = useState('');
//   const [role, setRole] = useState('');
//   const [joiningDate, setJoiningDate] = useState('');
//   const [salary, setSalary] = useState('');
//   const [idProof, setIdProof] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   const toggleForm = () => {
//     setShowForm(!showForm);
//     setShowView(false); // Hide view when adding employee
//   };

//   const toggleView = () => {
//     setShowView(!showView);
//     setShowForm(false); // Hide form when viewing employees
//     fetchEmployees(); // Fetch employees when viewing
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('location', location);
//     formData.append('contactNumber', contactNumber);
//     formData.append('role', role);
//     formData.append('joiningDate', joiningDate);
//     formData.append('salary', salary);
//     formData.append('idProof', idProof);

//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('http://localhost:3001/employees', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.status !== 201) {
//         throw new Error('Network response was not ok');
//       }

//       // Fetch updated employee list
//       await fetchEmployees();

//       // Resetting the form
//       setName('');
//       setLocation('');
//       setContactNumber('');
//       setRole('');
//       setJoiningDate('');
//       setSalary('');
//       setIdProof(null);
//     } catch (error) {
//       setError('Error adding employee: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/employees');
//       const data = await response.json();
//       setEmployees(data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const handleCardClick = (employee) => {
//     setSelectedEmployee(employee);
//   };

//   return (
//     <>
//       <div className="flex justify-between w-full">
//         <span className="text-center mt-8 ml-11 items-start">Employee Details:</span>
//         <div className="flex space-x-4">
//           <span className='text-center mt-8 bg-gray-500 p-3 rounded-lg mr-14'>
//             <button onClick={toggleForm} className="font-semibold items-end text-white">
//               ADD EMPLOYEE
//             </button>
//           </span>
//           <span className='text-center mt-8 bg-gray-500 p-3 rounded-lg mr-5'>
//             <button onClick={toggleView} className="font-semibold items-end text-white ">
//               VIEW EMPLOYEES
//             </button>
//           </span>
//         </div>
//       </div>

//       {/* Form Container */}
//       {showForm && (
//         <div className="flex justify-center mt-4 w-full">
//           <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full m-11">
//             {/* Form Fields */}
//             <div className="mb-4">
//               <label className="block text-gray-700">Name:</label>
//               <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-lg w-full p-2" required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Location:</label>
//               <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="border rounded-lg w-full p-2" required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Contact Number:</label>
//               <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="border rounded-lg w-full p-2" required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Role:</label>
//               <select value={role} onChange={(e) => setRole(e.target.value)} className="border rounded-lg w-full p-2" required>
//                 <option value="" disabled>Select a role</option>
//                 <option value="manager">Manager</option>
//                 <option value="labour">Labour</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-900">ID Proof:</label>
//               <input type="file" accept="image/*" onChange={(e) => setIdProof(e.target.files[0])} className='border border-gray-300 rounded-lg w-full p-2 text-gray-700' required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-900">Joining Date:</label>
//               <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500' required />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700">Salary:</label>
//               <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="border rounded-lg w-full p-2" required />
//             </div>
//             {error && <div className="text-red-500 font-semibold">{error}</div>}
//             <div className="flex justify-center mt-4">
//               <button type="submit" className="bg-black flex items-center text-white p-2 rounded-lg" disabled={loading}>
//                 {loading ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Employee List */}
//       {showView && (
//         <div className="flex flex-col items-center mt-4">
//           {employees.map((employee) => (
//             <div
//               key={employee._id}
//               onClick={() => handleCardClick(employee)}
//               className="border p-4 rounded-lg shadow-md m-2 cursor-pointer w-1/3 hover:bg-gray-100"
//             >
//               <h3 className="font-bold">{employee.name}</h3>
//               <p>Role: {employee.role}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Display Selected Employee Details */}
//       {selectedEmployee && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg">
//             <h2 className="font-bold text-lg">{selectedEmployee.name}</h2>
//             <p>Location: {selectedEmployee.location}</p>
//             <p>Contact Number: {selectedEmployee.contactNumber}</p>
//             <p>Role: {selectedEmployee.role}</p>
//             <p>Joining Date: {selectedEmployee.joiningDate}</p>
//             <p>Salary: {selectedEmployee.salary}</p>
//             <button onClick={() => setSelectedEmployee(null)} className="mt-4 bg-black text-white p-2 rounded">
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Employee;



import React, { useState, useEffect } from 'react';

const Employee = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [role, setRole] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [salary, setSalary] = useState('');
  const [idProof, setIdProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('contactNumber', contactNumber);
    formData.append('role', role);
    formData.append('joiningDate', joiningDate);
    formData.append('salary', salary);
    formData.append('idProof', idProof);

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/employees', {
        method: 'POST',
        body: formData,
      });

      if (response.status !== 201) {
        throw new Error('Network response was not ok');
      }

      // Fetch updated employee list
      await fetchEmployees();

      // Resetting the form
      setName('');
      setLocation('');
      setContactNumber('');
      setRole('');
      setJoiningDate('');
      setSalary('');
      setIdProof(null);
    } catch (error) {
      setError('Error adding employee: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3001/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <div className="flex justify-between w-full">
        <span className="text-center mt-8 ml-11 items-start">Employee Details:</span>
        <div className="flex space-x-4">
          <span className='text-center mt-8 bg-black p-3 rounded-lg mr-14'>
            <button onClick={toggleForm} className="text-xs md:text-lgmd:font-semibold items-end text-white">
              {showForm ? 'CANCEL' : 'ADD EMPLOYEE'}
            </button>
          </span>
        </div>
      </div>

      {/* Form Container */}
      {showForm && (
        <div className="flex justify-center mt-4 w-full">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full m-11">
            {/* Form Fields */}
            <div className="mb-4">
              <label className="block text-gray-700">Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-lg w-full p-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Location:</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="border rounded-lg w-full p-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact Number:</label>
              <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="border rounded-lg w-full p-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="border rounded-lg w-full p-2" required>
                <option value="" disabled>Select a role</option>
                <option value="manager">Manager</option>
                <option value="labour">Labour</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">ID Proof:</label>
              <input type="file" accept="image/*" onChange={(e) => setIdProof(e.target.files[0])} className='border border-gray-300 rounded-lg w-full p-2 text-gray-700' required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">Joining Date:</label>
              <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500' required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Salary:</label>
              <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="border rounded-lg w-full p-2" required />
            </div>
            {error && <div className="text-red-500 font-semibold">{error}</div>}
            <div className="flex justify-center mt-4">
              <button type="submit" className="bg-black flex items-center text-white p-2 rounded-lg" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee List in Table Format */}
      <div className="flex flex-col items-center mt-4 ml-5 mr-5">
  <div className="overflow-x-auto w-full"> {/* Add this wrapper for horizontal scroll */}
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className=''>
          <th className="py-2 border-b">S.no</th>
          <th className="py-2 border-b">Name</th>
          <th className="py-2 border-b">Location</th>
          <th className="py-2 border-b">Contact Number</th>
          <th className="py-2 border-b">Role</th>
          <th className="py-2 border-b">Joining Date</th>
          <th className="py-2 border-b">Salary</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee, index) => (
          <tr key={employee._id} className="text-center">
            <td className="py-4 border-b">{index + 1}</td>
            <td className="py-4 border-b">{employee.name}</td>
            <td className="py-4 border-b">{employee.location}</td>
            <td className="py-4 border-b">{employee.contactNumber}</td>
            <td className="py-4 border-b">{employee.role}</td>
            <td className="py-4 border-b">{new Date(employee.joiningDate).toLocaleDateString()}</td>
            <td className="py-4 border-b">{employee.salary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


    </>
  );
};

export default Employee;
