import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';

const Diary = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formData, setFormData] = useState({
    diary: '',
    managerName: ''
  });
  
  const apiUrl = '/api';

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${apiUrl}/diary`);
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await response.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `${apiUrl}/diary/${selectedEntry._id}`
        : `${apiUrl}/diary`;
        
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isEditing ? 'Failed to update entry' : 'Failed to add entry');
      }

      await fetchEntries();
      handleCloseModal();
      alert(isEditing ? 'Entry updated successfully!' : 'Entry added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}/diary/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      await fetchEntries();
      alert('Entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const handleEdit = (entry) => {
    setIsEditing(true);
    setSelectedEntry(entry);
    setFormData({
      diary: entry.diary,
      managerName: entry.managerName
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedEntry(null);
    setFormData({
      diary: '',
      managerName: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Diary Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <MdAdd size={20} />
          Add New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <div key={entry._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end gap-2 mb-4">
              <button 
                onClick={() => handleEdit(entry)}
                className="text-blue-500 hover:text-blue-700"
              >
                <MdEdit size={20} />
              </button>
              <button 
                onClick={() => handleDelete(entry._id)}
                className="text-red-500 hover:text-red-700"
              >
                <MdDelete size={20} />
              </button>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Diary Entry:</p>
              <p className="text-gray-600">{entry.diary}</p>
              <p className="font-semibold mt-4">Manager:</p>
              <p className="text-gray-600">{entry.managerName}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Entry' : 'Add New Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Diary Entry</label>
                <textarea
                  name="diary"
                  value={formData.diary}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded min-h-[100px]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Manager Name</label>
                <input
                  type="text"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isEditing ? 'Update' : 'Add'} Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diary;
