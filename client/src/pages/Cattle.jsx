import React, { useState, useEffect } from 'react';

const Cattle = () => {
  const [formData, setFormData] = useState({
    animal: '',
    breed: '',
    gender: '',
    age: '',
    breeding: '',
    price: '',
    location: '',
    name: '',
    offspring: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cattleList, setCattleList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = '/api';

  useEffect(() => {
    const fetchCattle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/cattle`);
        if (!response.ok) {
          throw new Error('Failed to fetch cattle data');
        }
        const data = await response.json();
        // Ensure we always have an array
        setCattleList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCattle();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/cattle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save cattle entry');
      }

      const data = await response.json();
      console.log('Cattle entry saved:', data);
      setCattleList((prevList) => [...prevList, data.newCattle]);
      setFormData({
        animal: '',
        breed: '',
        gender: '',
        age: '',
        breeding: '',
        price: '',
        location: '',
        name: '',
        offspring: '',
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save cattle entry: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-200 p-6 h-lvh">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cattle List</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="text-xl bg-black text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Cattle
        </button>
      </div>

      {/* Modal for Cattle Entry Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-lg overflow-auto max-h-[80vh]">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-2 right-2 text-red-500 text-3xl font-bold hover:text-gray-900"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add Cattle Entry</h2>
            <form onSubmit={handleSubmit}>
              {/* Animal Select */}
              <div className="mb-4 flex flex-col gap-2">
                <label htmlFor="animal" className="block text-sm font-medium text-gray-900">Animal:</label>
                <select
                  name="animal"
                  id="animal"
                  value={formData.animal}
                  onChange={handleChange}
                  className="m-0.5 w-full border border-gray-300 text-gray-700 sm:text-sm p-3 rounded-lg"
                  required
                >
                  <option value="">Select an animal</option>
                  <option value="COW">COW</option>
                  <option value="BUFFALO">BUFFALO</option>
                  <option value="GOAT">GOAT</option>
                  <option value="SHEEP">SHEEP</option>
                  <option value="HEN">HEN</option>
                </select>
              </div>

              {/* Other form fields... */}
              {/* Breed Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Breed:</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Gender Radio Buttons */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Gender:</label>
                <div className="flex items-center">
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                      className="form-radio h-4 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-gray-700 ml-2">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                      className="form-radio h-4 text-black focus:ring-black"
                      required
                    />
                    <span className="text-gray-700 ml-2">Female</span>
                  </label>
                </div>
              </div>

              {/* Age Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Age:</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Breeding Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Breeding:</label>
                <input
                  type="number"
                  name="breeding"
                  value={formData.breeding}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Price Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Location Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Location:</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Name Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Offspring Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Offspring:</label>
                <input
                  type="text"
                  name="offspring"
                  value={formData.offspring}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="items-center justify-center flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full max-w-xs mt-4 text-2xl bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cattle List Table */}
      <div className="mt-6 ml-5 mr-5 w-full bg-white rounded-lg shadow-md p-4">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-4">Loading cattle data...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : cattleList.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No cattle entries found. Add some using the button above.</div>
          ) : (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Animal</th>
                  <th className="py-2 px-4 border-b text-left">Breed</th>
                  <th className="py-2 px-4 border-b text-left">Gender</th>
                  <th className="py-2 px-4 border-b text-center">Age</th>
                  <th className="py-2 px-4 border-b text-left">Breeding</th>
                  <th className="py-2 px-4 border-b text-right">Price</th>
                  <th className="py-2 px-4 border-b text-left">Location</th>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-center">Offspring</th>
                </tr>
              </thead>
              <tbody>
                {cattleList.map((cattle, index) => (
                  <tr key={cattle._id || index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-left">{cattle.animal}</td>
                    <td className="py-2 px-4 border-b text-left">{cattle.breed}</td>
                    <td className="py-2 px-4 border-b text-left">{cattle.gender}</td>
                    <td className="py-2 px-4 border-b text-center">{cattle.age}</td>
                    <td className="py-2 px-4 border-b text-left">{cattle.breeding}</td>
                    <td className="py-2 px-4 border-b text-right">{cattle.price}</td>
                    <td className="py-2 px-4 border-b text-left">{cattle.location}</td>
                    <td className="py-2 px-4 border-b text-left">{cattle.name}</td>
                    <td className="py-2 px-4 border-b text-center">{cattle.offspring}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cattle;
