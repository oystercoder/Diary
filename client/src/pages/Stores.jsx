import React, { useState, useEffect } from 'react';

const Store = () => {
  const [location, setLocation] = useState('');
  const [storeId, setStoreId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const [stores, setStores] = useState([]); // State to hold fetched stores
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleLocationChange = (e) => {
    const loc = e.target.value;
    setLocation(loc);

    if (loc) {
      const words = loc.split(' ').map(word => word.charAt(0).toUpperCase());
      const generatedId = `STORE-${words.join('')}-${Math.floor(Math.random() * 1000)}`;
      setStoreId(generatedId);
    } else {
      setStoreId('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: storeName, location, storeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add store');
      }

      const data = await response.json();
      console.log(data);
      fetchStores(); // Refresh the store list
      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setStoreName('');
    setLocation('');
    setStoreId('');
    setIsModalOpen(false); // Close modal after submission
  };

  const fetchStores = async () => {
    try {
      const response = await fetch('http://localhost:3001/stores');
      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }
      const data = await response.json();
      setStores(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchStores(); // Fetch stores on component mount
  }, []);

  return (
    <div className='flex flex-col items-center bg-gray-200 h-lvh p-6'>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="mb-4 text-xl bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Add Store
      </button>

   {/* Store Table */}
<table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-gray-800 text-white">
      <th className="py-3 px-6 text-left">Store ID</th>
      <th className="py-3 px-6 text-left">Store Name</th>
      <th className="py-3 px-6 text-left">Location</th>
    </tr>
  </thead>
  <tbody>
    {stores.map((store) => (
      <tr key={store.storeId} className="border-b hover:bg-gray-100">
        <td className="py-4 px-6">{store.storeId}</td>
        <td className="py-4 px-6">{store.name}</td>
        <td className="py-4 px-6">{store.location}</td>
      </tr>
    ))}
  </tbody>
</table>

      {/* Modal for Store Entry Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className='relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-auto max-h-[80vh]'>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times; {/* Close icon */}
            </button>
            <h2 className='text-xl font-semibold mb-4'>Add Store Entry</h2>
            <form onSubmit={handleSubmit}>

              {error && <div className="text-red-500 mb-2">{error}</div>}

              {/* Store Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Store Name:</label>
                <input 
                  type="text" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500' 
                  placeholder="Enter store name"
                  required
                />
              </div>

              {/* Location Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Location:</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={handleLocationChange}
                  className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500' 
                  placeholder="Enter location"
                  required
                />
              </div>

              {/* Store ID Display */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Store ID:</label>
                <input 
                  type="text" 
                  value={storeId} 
                  readOnly 
                  className='border border-gray-300 rounded-lg w-full p-2 outline-none bg-gray-100'
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center">
                <button 
                  type="submit" 
                  className="w-full max-w-xs mt-4 text-2xl bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Store;
