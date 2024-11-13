import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const Products = () => {
  const [formData, setFormData] = useState({
    name: '',
    units: '',
    price: '',
    unitType: 'liters',
  });
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, units, price, unitType } = formData;

    if (!name || !units || !price) {
      alert('All fields are required.');
      return;
    }

    const numericUnits = parseFloat(units);
    if (isNaN(numericUnits) || isNaN(price)) {
      alert('Units and price must be valid numbers.');
      return;
    }

    const sanitizedData = {
      name: name.trim(),
      units: numericUnits,
      price: parseFloat(price),
      unitType,
    };

    try {
      const response = await fetch(`http://{apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        await fetchProducts();
        setFormData({
          name: '',
          units: '',
          price: '',
          unitType: 'liters',
        });
        setIsModalOpen(false);
      } else {
        const errorText = await response.text();
        console.error('Error adding product:', errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`{apiUrl}/products/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchProducts();
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Handle edit product
  const handleEdit = (product) => {
    setFormData({
      ...product,
      unitType: product.unitType || 'liters',
    });
    setIsModalOpen(true); // Open modal to edit
  };

  // Handle view product
  const handleView = (product) => {
    alert(`Viewing product: ${product.name}`);
    // You could show a modal or redirect to a detailed view page here
  };

  return (
    <div className="flex flex-col items-center h-screen bg-gray-200 w-full">
      <div className="w-3/4 flex justify-between items-center mb-4 p-4">
        <h1 className="text-2xl font-bold">Product List</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xl bg-black text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Product
        </button>
      </div>

      {/* Product Table */}
      <div className="flex flex-col items-center w-full mx-5 mt-4">
        <div className="overflow-hidden w-full">
          <table className="w-full ml-5 mr-5 bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="text-black">
                <th className="py-2 px-2 border-b">S.no</th>
                <th className="py-2 px-2 border-b">Product Name</th>
                <th className="py-2 px-2 border-b">Units</th>
                <th className="py-2 px-2 border-b">Store Price</th>
                <th className="py-2 px-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr key={product._id} className="text-center hover:bg-gray-100">
                  <td className="py-4 px-2 border-b">
                    {index + 1 + indexOfFirstProduct}
                  </td>
                  <td className="py-4 px-2 border-b">{product.name}</td>
                  <td className="py-4 px-2 border-b">{product.units} {product.unitType}</td>
                  <td className="py-4 px-2 border-b">₹{product.price}</td>
                  <td className="py-4 px-2 border-b flex justify-center gap-3">
                    <button onClick={() => handleView(product)} className="text-blue-500">
                      <FaEye />
                    </button>
                    <button onClick={() => handleEdit(product)} className="text-yellow-500">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-black rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => changePage(index + 1)}
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} hover:bg-gray-400`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-black rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for Product Entry Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-lg sm:ml-2 sm:mr-2 md:ml-4 md:mr-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times; {/* Close icon */}
            </button>

            <form onSubmit={handleSubmit}>
              {/* Product Name Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Units Section (Radio buttons for Liters/Kgs) */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Units:</label>
                <div className="flex items-center space-x-4">
                  <div>
                    <input
                      type="radio"
                      id="liters"
                      name="unitType"
                      value="liters"
                      checked={formData.unitType === 'liters'}
                      onChange={handleUnitChange}
                      className="mr-2"
                    />
                    <label htmlFor="liters">Liters</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="kgs"
                      name="unitType"
                      value="kgs"
                      checked={formData.unitType === 'kgs'}
                      onChange={handleUnitChange}
                      className="mr-2"
                    />
                    <label htmlFor="kgs">Kgs</label>
                  </div>
                </div>
              </div>

              {/* Units Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Quantity:</label>
                <input
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter quantity in ${formData.unitType}`}
                  required
                />
              </div>

              {/* Price Input */}
              <div className="mb-4 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Store Price (₹):</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
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
};

export default Products;
