import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { FaMapMarkerAlt, FaPhone, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';

const Wholesale = () => {
  const [wholesalers, setWholesalers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [stockData, setStockData] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactNumber: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const apiUrl = '/api';

  const fetchWholesalers = async () => {
    try {
      const response = await fetch(`${apiUrl}/wholesale`);
      if (!response.ok) {
        throw new Error('Failed to fetch wholesalers');
      }
      const data = await response.json();
      setWholesalers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching wholesalers:', error);
      setWholesalers([]);
    }
  };

  const fetchStockData = async () => {
    try {
      const response = await fetch(`${apiUrl}/stock`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      
      const stockInfo = {};
      
      // First, initialize stockInfo for each dealer
      data.forEach(stock => {
        if (!stockInfo[stock.dealerName]) {
          stockInfo[stock.dealerName] = {
            totalDue: 0,
            latestDueDate: null,
            transactions: []
          };
        }
      });

      // Then process each transaction
      data.forEach(stock => {
        const totalPrice = Number(stock.totalPrice) || 0;
        const initialPaid = Number(stock.paid) || 0;
        const additionalPayments = (stock.payments || []).reduce((sum, payment) => 
          sum + (Number(payment.amount) || 0), 0);
        const totalPaid = initialPaid + additionalPayments;
        
        let due = 0;
        if (stock.type === 'purchase') {
          // For purchases, we owe money to the dealer
          due = totalPaid - totalPrice;
        } else if (stock.type === 'sale') {
          // For sales, dealer owes money to us
          due = totalPrice - totalPaid;
        }

        if (stock.dealerName && due !== 0) {
          // Add to total due (negative for money we owe, positive for money owed to us)
          stockInfo[stock.dealerName].totalDue = (stockInfo[stock.dealerName].totalDue || 0) + due;
          
          // Update latest due date if there's an unpaid amount
          if (due > 0) {
            const dueDate = new Date(stock.due);
            if (!stockInfo[stock.dealerName].latestDueDate || 
                dueDate > new Date(stockInfo[stock.dealerName].latestDueDate)) {
              stockInfo[stock.dealerName].latestDueDate = stock.due;
            }
          }
          
          // Add transaction details
          stockInfo[stock.dealerName].transactions.push({
            type: stock.type,
            date: stock.paidDate,
            product: stock.productName,
            quantity: stock.quantity,
            unit: stock.unit,
            pricePerUnit: stock.pricePerUnit,
            totalPrice: totalPrice,
            paid: totalPaid,
            due: due,
            dueDate: stock.due,
            payments: stock.payments || []
          });
        }
      });
      
      setStockData(stockInfo);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    fetchWholesalers();
    fetchStockData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `${apiUrl}/wholesale/${selectedWholesaler._id}`
        : `${apiUrl}/wholesale`;
        
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isEditing ? 'Failed to update wholesaler' : 'Failed to add wholesaler');
      }

      await fetchWholesalers();
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this wholesaler?')) {
      return;
    }
    
    try {
      const response = await fetch(`${apiUrl}/wholesale/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete wholesaler');
      }

      await fetchWholesalers();
    } catch (error) {
      console.error('Error deleting wholesaler:', error);
      alert('Failed to delete wholesaler');
    }
  };

  const handleEdit = (wholesaler) => {
    setIsEditing(true);
    setSelectedWholesaler(wholesaler);
    setFormData({
      name: wholesaler.name,
      location: wholesaler.location,
      contactNumber: wholesaler.contactNumber
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedWholesaler(null);
    setFormData({
      name: '',
      location: '',
      contactNumber: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredWholesalers = wholesalers.filter(wholesaler =>
    wholesaler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wholesaler.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wholesaler.contactNumber.includes(searchTerm)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Wholesalers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          <MdAdd size={20} />
          <span>Add Wholesaler</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search wholesalers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Wholesalers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWholesalers.map((wholesaler) => {
                const wholesalerData = stockData[wholesaler.name] || {
                  totalDue: 0,
                  latestDueDate: null
                };
                
                return (
                  <tr key={wholesaler._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{wholesaler.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="mr-2" />
                        {wholesaler.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaPhone className="mr-2" />
                        {wholesaler.contactNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${wholesalerData.totalDue >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {wholesalerData.totalDue === 0 ? (
                          '₹0'
                        ) : wholesalerData.totalDue > 0 ? (
                          `₹${wholesalerData.totalDue.toLocaleString('en-IN')} (To Receive)`
                        ) : (
                          `₹${Math.abs(wholesalerData.totalDue).toLocaleString('en-IN')} (To Pay)`
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(wholesaler)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(wholesaler._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {isEditing ? 'Edit Wholesaler' : 'Add New Wholesaler'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {isEditing ? 'Update' : 'Add'} Wholesaler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wholesale;
