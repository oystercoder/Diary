import React, { useState, useEffect } from "react";
import moment from 'moment';

const Stock = () => {
  const [dealerName, setDealerName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [transactionType, setTransactionType] = useState("purchase");
  const [entries, setEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    if (qty && pricePerUnit) {
      setTotalPrice(qty * pricePerUnit);
    }
  };

  const handlePriceChange = (e) => {
    const prc = e.target.value;
    setPricePerUnit(prc);
    if (quantity && prc) {
      setTotalPrice(quantity * prc);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      dealerName,
      productName,
      quantity,
      pricePerUnit,
      totalPrice,
      type: transactionType, // Store the type of transaction (purchase/sale)
    };

    try {
      const response = await fetch(`${apiUrl}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();
      alert(data.message);
      fetchEntries(); // Fetch the updated entries after submission
      setDealerName("");
      setProductName("");
      setQuantity("");
      setPricePerUnit("");
      setTotalPrice(0);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to fetch all transaction entries
  const fetchEntries = async () => {
    try {
      const response = await fetch(`${apiUrl}/stock`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEntries(data); // Ensure this is an array
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  // Load transaction entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  // Filter transactions for the selected dealer
  const pastTransactions = entries.filter(
    (entry) => entry.dealerName === selectedDealer
  );

  // Group entries by product name
  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.productName]) {
      acc[entry.productName] = { purchases: [], sales: [] };
    }

    if (entry.type === 'purchase') {
      acc[entry.productName].purchases.push(entry);
    } else if (entry.type === 'sale') {
      acc[entry.productName].sales.push(entry);
    }

    return acc;
  }, {});

  // Create the cards for each product
  const productCards = Object.keys(groupedEntries).map(productName => {
    const purchaseEntries = groupedEntries[productName].purchases;
    const saleEntries = groupedEntries[productName].sales;

    const totalPurchaseQuantity = purchaseEntries.reduce((total, entry) => total + Number(entry.quantity), 0);
    const totalSaleQuantity = saleEntries.reduce((total, entry) => total + Number(entry.quantity), 0);
    const remainingQuantity = totalPurchaseQuantity - totalSaleQuantity;

    return (
      <div key={productName} className="w-auto p-12">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-end gap-4 p-5">
            <h2 className="text-lg font-semibold text-center mb-4 text-pink-900">{productName}</h2>
            <span className={`text-3xl ${remainingQuantity < 0 ? 'text-red-600' :'text-blue-600' }`}>
              {remainingQuantity}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total Purchase:</span>
            <span>{totalPurchaseQuantity}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total Sale:</span>
            <span>{totalSaleQuantity}</span>
          </div>
          <div className="flex justify-between mb-2 font-semibold">
          </div>
        </div>
      </div>
    );
  });

  // Open modal to view all transactions for a specific dealer
  const openModal = (dealer) => {
    setSelectedDealer(dealer);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center bg-gray-200 p-6 min-h-screen">
      <div className="flex justify-between w-full md:w-3/4 mb-4">
        <h1 className="text-2xl font-bold">Stock Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xl bg-black text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Transaction
        </button>
      </div>

      {/* Product Cards */}
      <div className="flex flex-wrap justify-center mb-6">
        {productCards}
      </div>

      {/* Modal for Transaction Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Past Transactions of {selectedDealer}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
            {/* Display Past Transactions in the Modal */}
            {pastTransactions.length > 0 ? (
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-center">Date</th>
                    <th className="border border-gray-300 p-2 text-center">Product Name</th>
                    <th className="border border-gray-300 p-2 text-center">Transaction Type</th>
                    <th className="border border-gray-300 p-2 text-center">Quantity</th>
                    <th className="border border-gray-300 p-2 text-center">Total Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {pastTransactions.map((entry, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 text-center p-4">
                        {moment(entry.date).format('DD MMM YYYY')}
                      </td>
                      <td className="border border-gray-300 text-center p-4">{entry.productName}</td>
                      <td className="border border-gray-300 text-center p-4">{entry.type}</td>
                      <td className="border border-gray-300 text-center p-4">{entry.quantity}</td>
                      <td className="border border-gray-300 text-center p-4">{entry.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No transactions found for this dealer.</div>
            )}
          </div>
        </div>
      )}

      {/* Display Purchase and Sale Transactions Side by Side */}
      <div className="mt-4 w-full flex flex-col items-center gap-9">
        {/* Purchase Transactions Table */}
        <div className="w-full bg-white shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 p-3">Purchase Transactions</h2>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-center">Date</th>
                <th className="border border-gray-300 p-2 text-center">Dealer Name</th>
                <th className="border border-gray-300 p-2 text-center">Product Name</th>
                <th className="border border-gray-300 p-2 text-center">Quantity</th>
                <th className="border border-gray-300 p-2 text-center">Price per Unit (₹)</th>
                <th className="border border-gray-300 p-2 text-center">Total Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {entries.length > 0 ? (
                entries.map((entry, index) => entry.type === 'purchase' && (
                  <tr key={index} onClick={() => openModal(entry.dealerName)}>
                    <td className="border border-gray-300 text-center p-4">
                      {moment(entry.date).format('DD MMM YYYY')}
                    </td>
                    <td className="border border-gray-300 text-center p-4">{entry.dealerName}</td>
                    <td className="border border-gray-300 text-center p-4">{entry.productName}</td>
                    <td className="border border-gray-300 text-center p-4">{entry.quantity}</td>
                    <td className="border border-gray-300 text-center p-4">{entry.pricePerUnit}</td>
                    <td className="border border-gray-300 text-center p-4">{entry.totalPrice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">No purchase transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sale Transactions Table */}
        <div className="w-full bg-white shadow-md rounded-lg overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 p-3">Sale Transactions</h2>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-center">Date</th>
                <th className="border border-gray-300 p-2 text-center">Dealer Name</th>
                <th className="border border-gray-300 p-2 text-center">Product Name</th>
                <th className="border border-gray-300 p-2 text-center">Quantity</th>
                <th className="border border-gray-300 p-2 text-center">Price per Unit (₹)</th>
                <th className="border border-gray-300 p-2 text-center">Total Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {entries.length > 0 ? (
                entries.map((entry, index) => entry.type === 'sale' && (
                  <tr key={index} onClick={() => openModal(entry.dealerName)}>
                    <td className="border border-gray-300 text-center p-4">
                      {moment(entry.date).format('DD MMM YYYY')}
                    </td>
                    <td className="border border-gray-300 text-center p-4">{entry.dealerName}</td>
                    <td className="border border-gray-300 text-center p-4">{entry.productName}</td>
                    <td className="border border-gray-300 text-center p-4">{entry.quantity}</td>
                    <td className="border border-gray-300 text-center p-4">{entry.pricePerUnit}</td>
                    <td className="border border-gray-300 text-center p-4">{entry.totalPrice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">No sale transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stock;
