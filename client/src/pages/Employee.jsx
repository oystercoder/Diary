import React, { useState, useEffect } from "react";
import axios from "axios";

const Employee = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [salary, setSalary] = useState("");
  const [idProof, setIdProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [credentialsModal, setCredentialsModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };
  const apiUrl = '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("contactNumber", contactNumber);
    formData.append("role", role);
    formData.append("joiningDate", joiningDate);
    formData.append("salary", salary);
    formData.append("idProof", idProof);

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${apiUrl}:/employees`, formData);

      if (response.status === 201) {
        fetchEmployees();  // Fetch updated employee list
        resetForm();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      setError("Error adding employee: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/employees`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setContactNumber("");
    setRole("");
    setJoiningDate("");
    setSalary("");
    setIdProof(null);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenCredentialsModal = (employee) => {
    setCurrentEmployee(employee);
    setEmail(employee.email || "");
    setPassword(employee.password || "");
    setCredentialsModal(true);
  };

  const handleCloseCredentialsModal = () => {
    setCredentialsModal(false);
    setEmail("");
    setPassword("");
  };

  const handleUpdateCredentials = async () => {
    // Only include the password field in the updatedEmployee object
    const updatedEmployee = { email,password };
    const loginEmployee={email,password};
  
    try {
      // Update the employee's password in the employee database (keep email unchanged)
      const employeeResponse = await axios.put(
        `${apiUrl}/employees/${currentEmployee._id}`,
        updatedEmployee
      );
  
      if (employeeResponse.status !== 200) {
        throw new Error("Failed to update employee credentials");
      }
  
      // Update the login credentials (user authentication database) with the new password only
    
  
      if (loginResponse.status !== 200) {
        throw new Error("Failed to update login credentials");
      }
  
      // Update employee in the local state, only modifying the password field
      setEmployees(
        employees.map((emp) =>
          emp._id === currentEmployee._id ? { ...emp, password } : emp
        )
      );
  
      handleCloseCredentialsModal();
      alert("Password updated successfully in both employee and login databases");
    } catch (error) {
      console.error("Error updating credentials:", error);
      alert(`Failed to update credentials: ${error.message}`);
    }
  };
  

  const handleAddCredentials = async () => {
    const newCredentials = { email, password };

    try {
      // Add credentials to the Authentication Database
      const response = await axios.post(`${apiUrl}/auth/register`, newCredentials);

      if (response.status === 200) {
        // Update the Employee Database with the new credentials
        const updatedEmployee = { email, password };

        // Sending the updated employee data to the employee API
        const employeeUpdateResponse = await axios.put(
          `${apiUrl}/employees/${currentEmployee._id}`,
          updatedEmployee
        );

        if (employeeUpdateResponse.status === 200) {
          // Update the employee list in the UI
          setEmployees(
            employees.map((emp) =>
              emp._id === currentEmployee._id ? { ...emp, email, password } : emp
            )
          );
          handleCloseCredentialsModal();
          alert("Credentials added and Employee database updated successfully");
        } else {
          throw new Error("Failed to update employee in the database");
        }
      } else {
        throw new Error("Failed to add credentials to the authentication database");
      }
    } catch (error) {
      console.error("Error adding credentials:", error);
      alert("Failed to add credentials");
    }
  };

  return (
    <>
      <div className="flex justify-between w-full">
        <span className="text-center mt-8 ml-11 items-start font-bold text-2xl">Employee Details:</span>
        <div className="flex space-x-4">
          <span className="text-center mt-8 bg-black p-3 rounded-lg mr-14">
            <button
              onClick={toggleForm}
              className="text-xs md:text-lg md:font-semibold items-end text-white"
            >
              {showForm ? "CANCEL" : "ADD EMPLOYEE"}
            </button>
          </span>
        </div>
      </div>

      {showForm && (
  <div className="mt-12 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className='relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-auto max-h-[90vh]'>
      {/* Close Button */}
      <button 
        onClick={() => setShowForm(false)} 
        className="absolute top-2 right-2 text-red-500 text-3xl font-bold hover:text-gray-900"
      >
        &times; {/* Close icon */}
      </button>

      {/* Form Heading */}
      <h2 className='text-xl font-semibold mb-4'>Add Employee</h2>
      
      <form onSubmit={handleSubmit}>

        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="border rounded-lg w-full p-2" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Location:</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            className="border rounded-lg w-full p-2" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact Number:</label>
          <input 
            type="text" 
            value={contactNumber} 
            onChange={(e) => setContactNumber(e.target.value)} 
            className="border rounded-lg w-full p-2" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="border rounded-lg w-full p-2" 
            required
          >
            <option value="" disabled>Select a role</option>
            <option value="manager">Manager</option>
            <option value="labour">Labour</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900">ID Proof:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setIdProof(e.target.files[0])} 
            className='border border-gray-300 rounded-lg w-full p-2 text-gray-700' 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900">Joining Date:</label>
          <input 
            type="date" 
            value={joiningDate} 
            onChange={(e) => setJoiningDate(e.target.value)} 
            className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500' 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Salary:</label>
          <input 
            type="number" 
            value={salary} 
            onChange={(e) => setSalary(e.target.value)} 
            className="border rounded-lg w-full p-2" 
            required 
          />
        </div>
        
        {/* Error Message */}
        {error && <div className="text-red-500 font-semibold">{error}</div>}

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <button 
            type="submit" 
            className="bg-black flex items-center text-white p-2 rounded-lg" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      <div className="flex flex-col items-center mt-4 ml-5 mr-5">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 border-b">S.no</th>
                <th className="py-2 border-b">Name</th>
                <th className="py-2 border-b">Location</th>
                <th className="py-2 border-b">Contact Number</th>
                <th className="py-2 border-b">Role</th>
                <th className="py-2 border-b">Joining Date</th>
                <th className="py-2 border-b">Salary</th>
                <th className="py-2 border-b">Credentials</th>
              </tr>
            </thead>
            <tbody>
              {loadingEmployees ? (
                <tr><td colSpan="8" className="text-center py-4">Loading...</td></tr>
              ) : (
                employees.map((employee, index) => (
                  <tr key={employee._id} className="text-center">
                    <td className="py-4 border-b">{index + 1}</td>
                    <td className="py-4 border-b">{employee.name}</td>
                    <td className="py-4 border-b">{employee.location}</td>
                    <td className="py-4 border-b">{employee.contactNumber}</td>
                    <td className="py-4 border-b">{employee.role}</td>
                    <td className="py-4 border-b">
                      {new Date(employee.joiningDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 border-b">{employee.salary}</td>
                    <td className="py-4 border-b">
                      <button
                        onClick={() => handleOpenCredentialsModal(employee)}
                        className="bg-black text-white px-4 py-2 rounded-md"
                      >
                        {employee.email ? "Edit Credentials" : "Add Credentials"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credentials Modal */}
      {credentialsModal && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">
        {currentEmployee.email ? "Edit Credentials" : "Add Credentials"}
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
          disabled={currentEmployee.email ? true : false}  // Disable email field in edit mode
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={currentEmployee.email ? handleUpdateCredentials : handleAddCredentials}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
        <button
          onClick={handleCloseCredentialsModal}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Employee;
