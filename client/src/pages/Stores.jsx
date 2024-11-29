import React, { useState, useEffect } from 'react';
import { FaStore, FaEdit, FaTrash } from 'react-icons/fa';

const Store = () => {
  const [stores, setStores] = useState([]);  // Initialize as empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    location: '',
    contactNumber: '',
    manager: ''
  });
  const apiUrl = '/api';

  // Fetch stores
  const fetchStores = async () => {
    try {
      const response = await fetch(`${apiUrl}/stores`);
      if (!response.ok) {
        throw new Error('Failed to fetch stores');
      }
      const data = await response.json();
      // Ensure data is an array, if not, convert it or use empty array
      setStores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setStores([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStore),
      });

      if (!response.ok) {
        throw new Error('Failed to add store');
      }

      await fetchStores(); // Refresh the list
      setIsModalOpen(false);
      setNewStore({ name: '', location: '', contactNumber: '', manager: '' });
    } catch (error) {
      console.error('Error adding store:', error);
      alert('Failed to add store');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stores Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Store
        </button>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaStore className="text-blue-500 text-xl" />
              </div>
              <div className="flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
            <div className="space-y-2 text-gray-600">
              <p>Location: {store.location}</p>
              <p>Contact: {store.contactNumber}</p>
              <p>Manager: {store.manager}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Store Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Store</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Store Name</label>
                <input
                  type="text"
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={newStore.location}
                  onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Number</label>
                <input
                  type="tel"
                  value={newStore.contactNumber}
                  onChange={(e) => setNewStore({...newStore, contactNumber: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Manager Name</label>
                <input
                  type="text"
                  value={newStore.manager}
                  onChange={(e) => setNewStore({...newStore, manager: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
};

export default Store;
