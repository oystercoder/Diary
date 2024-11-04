import React, { useState, useEffect } from 'react';

const Products = () => {
  const [formData, setFormData] = useState({
    name: '',
    units: '',
    price: '',
  });
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProducts(); // Refresh the product list
        setFormData({
          name: '',
          units: '',
          price: '',
        });
        setIsModalOpen(false); // Close the modal
      } else {
        const errorText = await response.text();
        console.error('Error adding product:', errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='flex flex-col items-center h-screen bg-gray-200'>
      <div className="w-3/4 flex justify-between items-center mb-4 p-4">
        <h1 className="text-2xl font-bold ">Product List</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="text-xl bg-black text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Product
        </button>
      </div>

      {/* Product Table */}
      <table className="w-3/4 bg-white shadow-md rounded-lg border border-gray-300">
        <thead>
          <tr className="text-black border border-b-2">
            <th className="py-3 px-6 text-left">Product Name</th>
            <th className="py-3 px-6 text-left">Units</th>
            <th className="py-3 px-6 text-left">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.name} className="border-b hover:bg-gray-100">
              <td className="py-4 px-6">{product.name}</td>
              <td className="py-4 px-6">{product.units}</td>
              <td className="py-4 px-6">₹{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Product Entry Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className='relative bg-white p-6 rounded-lg shadow-md w-full max-w-lg sm:ml-2 sm:mr-2 md:ml-4 md:mr-4'>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times; {/* Close icon */}
            </button>
            <h2 className='text-xl font-semibold mb-4'>Add Product Entry</h2>
            <form onSubmit={handleSubmit}>

              {/* Product Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900">Product Name:</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500' 
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Units Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900">Units:</label>
                <input 
                  type="number" 
                  name="units" 
                  value={formData.units}
                  onChange={handleChange}
                  className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500' 
                  placeholder="Enter units"
                  required
                />
              </div>

              {/* Price Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900">Price:</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price}
                  onChange={handleChange}
                  className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500' 
                  placeholder="₹"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center">
                <button 
                  type="submit" 
                  className="w-full max-w-xs mt-8 text-2xl bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
