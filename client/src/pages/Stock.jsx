import React, { useState, useEffect } from "react";

const Stock = () => {
  const [dealerName, setDealerName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [transactionType, setTransactionType] = useState("purchase");
  const [entries, setEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const response = await fetch("http://localhost3001/stock", {
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
      const response = await fetch("http://localhost:3001/stock");
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

  // Filter the entries by transaction type
  const purchaseEntries = entries.filter(entry => entry.type === 'purchase');
  const saleEntries = entries.filter(entry => entry.type === 'sale');

  return (
    <div className="flex flex-col items-center bg-gray-200 p-6 h-screen">
      {/* Header Section */}
      <div className="flex justify-between w-3/4 mb-4">
        <h1 className="text-2xl font-bold">Stock Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xl bg-black text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Transaction
        </button>
      </div>

      {/* Modal for Transaction Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Dealer Name */}
              <div className="mb-6 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">
                  Dealer Name:
                </label>
                <input
                  type="text"
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                  placeholder="Enter dealer's name"
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Product Name */}
              <div className="mb-6 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">
                  Product Name:
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Quantity */}
              <div className="mb-6 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">
                  Quantity:
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder="Enter quantity"
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Price per Unit */}
              <div className="mb-6 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">
                  Price per Unit (₹):
                </label>
                <input
                  type="number"
                  value={pricePerUnit}
                  onChange={handlePriceChange}
                  placeholder="Enter price per unit"
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Total Price */}
              <div className="mb-6 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">
                  Total Price (₹):
                </label>
                <input
                  type="number"
                  value={totalPrice}
                  readOnly
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                />
              </div>

              {/* Transaction Type Dropdown */}
              <div className="mb-6 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">
                  Transaction Type:
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="purchase">Purchase</option>
                  <option value="sale">Sale</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="w-full text-xl bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                  Submit Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Display Purchase and Sale Transactions Side by Side */}
      <div className="mt-4 ml-5 mr-5 w-full flex flex-col  md:flex md:flex-row space-x-6">
        {/* Purchase Transactions Table */}
        

        {/* Sale Transactions Table */}
        {/* Purchase Transactions Table */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg overflow-hidden">
  <h2 className="text-xl font-semibold mb-4 p-3">Purchase Transactions</h2>
  <table className="min-w-full border-collapse border border-gray-200">
    <thead>
      <tr>
        <th className="border border-gray-300 p-2 text-center">Date</th> {/* New Date Column */}
        <th className="border border-gray-300 p-2 text-center">Dealer Name</th>
        <th className="border border-gray-300 p-2 text-center">Product Name</th>
        <th className="border border-gray-300 p-2 text-center">Quantity</th>
        <th className="border border-gray-300 p-2 text-center">Price per Unit (₹)</th>
        <th className="border border-gray-300 p-2 text-center">Total Price (₹)</th>
      </tr>
    </thead>
    <tbody>
      {purchaseEntries.length > 0 ? (
        purchaseEntries.map((entry, index) => (
          <tr key={index}>
            <td className="border border-gray-300 text-center p-4">{entry.date}</td> {/* Display Date */}
            <td className="border border-gray-300 text-center p-4">{entry.dealerName}</td>
            <td className="border border-gray-300 text-center p-4">{entry.productName}</td>
            <td className="border border-gray-300 text-center p-4">{entry.quantity}</td>
            <td className="border border-gray-300 text-center p-4">{entry.pricePerUnit}</td>
            <td className="border border-gray-300 text-center p-4">{entry.totalPrice}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td className="border border-gray-300 p-2" colSpan="6">No purchase transactions found</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* Sale Transactions Table */}
<div className="w-full mt-10 md:mt-0 md:w-1/2 bg-white shadow-md rounded-lg overflow-hidden">
  <h2 className="text-xl font-semibold mb-4 p-3">Sale Transactions</h2>
  <table className="min-w-full border-collapse border border-gray-200">
    <thead>
      <tr>
        <th className="border border-gray-300 p-2 text-center">Date</th> {/* New Date Column */}
        <th className="border border-gray-300 p-2 text-center">Dealer Name</th>
        <th className="border border-gray-300 p-2 text-center">Product Name</th>
        <th className="border border-gray-300 p-2 text-center">Quantity</th>
        <th className="border border-gray-300 p-2 text-center">Price per Unit (₹)</th>
        <th className="border border-gray-300 p-2 text-center">Total Price (₹)</th>
      </tr>
    </thead>
    <tbody>
      {saleEntries.length > 0 ? (
        saleEntries.map((entry, index) => (
          <tr key={index}>
            <td className="border border-gray-300 text-center p-4">{entry.date}</td> {/* Display Date */}
            <td className="border border-gray-300 text-center p-4">{entry.dealerName}</td>
            <td className="border border-gray-300 text-center p-4">{entry.productName}</td>
            <td className="border border-gray-300 text-center p-4">{entry.quantity}</td>
            <td className="border border-gray-300 text-center p-4">{entry.pricePerUnit}</td>
            <td className="border border-gray-300 text-center p-4">{entry.totalPrice}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td className="border border-gray-300 p-2" colSpan="6">No sale transactions found</td>
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
