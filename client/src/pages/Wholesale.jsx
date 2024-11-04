import React, { useState, useEffect } from 'react';

const Wholesale = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    location: '',
  });

  const [wholesalers, setWholesalers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/wholesale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setWholesalers([...wholesalers, data.wholesale]); // Assuming the response contains the added wholesaler
        setFormData({ name: '', contactNumber: '', location: '' });
        setIsModalOpen(false);
      } else {
        const errorText = await response.text();
        setError(errorText);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while submitting the form.');
    }
  };

  const fetchWholesalers = async () => {
    try {
      const response = await fetch('http://localhost:3001/wholesale');
      if (!response.ok) throw new Error('Failed to fetch wholesalers');
      const data = await response.json();
      setWholesalers(data);
    } catch (error) {
      console.error('Error fetching wholesalers:', error);
      setError('An error occurred while fetching the data.');
    }
  };

  useEffect(() => {
    fetchWholesalers();
  }, []);

  return (
    <div className='flex flex-col items-center bg-gray-200 p-6 h-screen'>
      <div className="flex justify-between w-3/4 mb-4">
        <h1 className="text-2xl font-bold">Wholesale Entries</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="text-xl bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-300"
        >
          Add Wholesale Entry
        </button>
      </div>

      {/* Modal for adding wholesale entry */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md w-full max-w-md relative'>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              type="button"
            >
              &times; {/* Close icon */}
            </button>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">Name:</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                placeholder="Enter your name"
              />
            </div>

            {/* Contact Number Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">Contact Number:</label>
              <input 
                type="text" 
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                placeholder="Enter your contact number"
              />
            </div>

            {/* Location Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900">Location:</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500" 
                required 
                placeholder="Enter your location"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center">
              <button 
                type="submit" 
                className="w-full max-w-xs mt-8 text-2xl bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Wholesalers Table */}
      <div className="overflow-x-auto mt-6 w-3/4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="border border-2">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Contact Number</th>
              <th className="py-2 px-4 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {wholesalers.map((wholesaler, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4 text-left">{wholesaler.name}</td>
                <td className="py-2 px-4 text-left">{wholesaler.contactNumber}</td>
                <td className="py-2 px-4 text-left">{wholesaler.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wholesale;
