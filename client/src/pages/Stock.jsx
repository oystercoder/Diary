import React, { useState, useEffect } from "react";
import moment from "moment";
import { CiFilter } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const Stock = () => {
  const [dealerName, setDealerName] = useState("");
  const [selectedDealerName, setSelectedDealerName] = useState("");
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [selectedFilterDuration, setSelectedFilterDuration] = useState("lastWeek");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [purchaseSearch, setPurchaseSearch] = useState(""); // Search term for purchase transactions
  // Selected filter duration
   // Custom start date for the filter
  // Custom end date for the filter
 
  const [purchaseEntries, setPurchaseEntries] = useState([]); // Original data (purchase entries)
 // Fi

  

 const [filterDuration, setFilterDuration] = useState(""); // Dropdown filter value
//  const [filteredPurchaseEntries, setFilteredPurchaseEntries] = useState(purchaseEntries); // Filtered data
 
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [transactionType, setTransactionType] = useState("purchase");
  const [entries, setEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [selectedDealerTransactions, setSelectedDealerTransactions] = useState([]);
 
  const [saleSearch, setSaleSearch] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    if (qty && pricePerUnit) {
      setTotalPrice(qty * pricePerUnit);
    }
  };

  const handleTransactionButtonClick = () => {
    setIsModalOpen(true); // Only open the modal when the button is clicked
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

  
  const edit=()=>{
    alert("this is working")
  }
  
  const groupedEntries = entries.reduce((acc, entry) => {
    // If the product doesn't exist in the accumulator, initialize it with empty purchases and sales arrays
    if (!acc[entry.productName]) {
      acc[entry.productName] = { purchases: [], sales: [] };
    }

    // If the entry is of type 'purchase', add it to the purchases array
    if (entry.type === "purchase") {
      acc[entry.productName].purchases.push(entry);
    }
    // If the entry is of type 'sale', add it to the sales array
    else if (entry.type === "sale") {
      acc[entry.productName].sales.push(entry);
    }

    return acc;
  }, {});

  // Function to handle row click to show all transactions of the dealer
  const handleRowClick = (dealerName) => {
    const transactions = entries.filter(
      (entry) => entry.dealerName === dealerName
    );
    setSelectedDealerName(dealerName);
    setSelectedDealerTransactions(transactions);
    setOpen(true);
    console.log(isOpen) // Open modal to show transactions
  };

  const filterEntries = (entries) => {
    if (!Array.isArray(entries)) {
      console.error("filterEntries received non-iterable input:", entries);
      return []; // Return an empty array as a fallback
    }
  
    let filteredEntries = [...entries];
  
    // Your filtering logic remains the same...
    filteredEntries = filteredEntries.filter(
      (entry) =>
        entry.type === "purchase" &&
        (entry.dealerName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
          entry.productName.toLowerCase().includes(purchaseSearch.toLowerCase()))
    );
  
    // Apply duration-based filtering
    const now = moment();
  
    if (selectedFilterDuration === "lastWeek") {
      const startOfLastWeek = now.clone().subtract(1, "weeks").startOf("week");
      filteredEntries = filteredEntries.filter((entry) =>
        moment(entry.timestamp).isBetween(startOfLastWeek, now, "days", "[]")
      );
    } else if (selectedFilterDuration === "lastMonth") {
      const startOfLastMonth = now.clone().subtract(1, "months").startOf("month");
      filteredEntries = filteredEntries.filter((entry) =>
        moment(entry.timestamp).isBetween(startOfLastMonth, now, "days", "[]")
      );
    } else if (selectedFilterDuration === "lastYear") {
      const startOfLastYear = now.clone().subtract(1, "years").startOf("year");
      filteredEntries = filteredEntries.filter((entry) =>
        moment(entry.timestamp).isBetween(startOfLastYear, now, "days", "[]")
      );
    } else if (selectedFilterDuration === "custom" && customStartDate && customEndDate) {
      const startDate = moment(customStartDate);
      const endDate = moment(customEndDate);
      filteredEntries = filteredEntries.filter((entry) =>
        moment(entry.timestamp).isBetween(startDate, endDate, "days", "[]")
      );
    }
  
    return filteredEntries;
  };
  


  // Filtered purchase and sale entries based on search inputs
  const filteredPurchaseEntries = entries.filter(
    (entry) =>
     


      entry.type === "purchase" &&  filterEntries(entry) &&
      (entry.dealerName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
        entry.productName.toLowerCase().includes(purchaseSearch.toLowerCase()))
  );
  const handleFilterClick = () => {
    setIsFilterPopupOpen(true);
  };
  const handleFilterDurationChange = (duration) => {
    setSelectedFilterDuration(duration);
  };
  


  // Function to handle custom date change
  const handleCustomDateChange = (e) => {
    if (e.target.name === "startDate") {
      setCustomStartDate(e.target.value);
    } else {
      setCustomEndDate(e.target.value);
    }
  };

  // Filter entries based on the selected duration


  const filteredSaleEntries = entries.filter(
    (entry) =>
      entry.type === "sale" &&
      (entry.dealerName.toLowerCase().includes(saleSearch.toLowerCase()) ||
        entry.productName.toLowerCase().includes(saleSearch.toLowerCase()))
  );

  const productCards = Object.keys(groupedEntries).map((productName) => {
    const purchaseEntries = groupedEntries[productName].purchases;
    const saleEntries = groupedEntries[productName].sales;

    // Calculate the total purchase quantity by summing up the 'quantity' of all purchase entries
    const totalPurchaseQuantity = purchaseEntries.reduce(
      (total, entry) => total + Number(entry.quantity),
      0
    );

    // Calculate the total sale quantity by summing up the 'quantity' of all sale entries
    const totalSaleQuantity = saleEntries.reduce(
      (total, entry) => total + Number(entry.quantity),
      0
    );

    // Calculate the remaining quantity: total purchased quantity - total sold quantity
    const remainingQuantity = totalPurchaseQuantity - totalSaleQuantity;

    return (
      <div key={productName} className="w-auto p-12">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-end gap-4 p-5">
            <h2 className="text-lg font-semibold text-center mb-4 text-pink-900">
              {productName}
            </h2>

            <span
              className={`text-3xl ${
                remainingQuantity < 0 ? "text-red-600" : "text-blue-600"
              }`}
            >
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
        </div>
      </div>
    );
  });


  return (
    <div className="flex flex-col items-center bg-gray-200 p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between w-full  mb-4">
        <h1 className="text-2xl font-bold">Stock Transactions</h1>
        <button
          onClick={handleTransactionButtonClick}
          className="text-xl bg-black text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Transaction
        </button>
      </div>

      <div className="flex flex-wrap justify-center mb-6">
        {productCards}
      </div>
      {/* Filter Popup */}
      {isFilterPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Select Duration</h2>
              <button
                onClick={() => setIsFilterPopupOpen(false)}
                className="text-red-500 hover:text-red-700 mt-2"
              >
                Close
              </button>
            </div>

            <div className="mb-4">
              <button
                onClick={() => handleFilterDurationChange("lastWeek")}
                className="w-full bg-gray-200 p-2 rounded-lg mb-2"
              >
                Last Week
              </button>
              <button
                onClick={() => handleFilterDurationChange("lastMonth")}
                className="w-full bg-gray-200 p-2 rounded-lg mb-2"
              >
                Last Month
              </button>
              <button
                onClick={() => handleFilterDurationChange("lastYear")}
                className="w-full bg-gray-200 p-2 rounded-lg mb-2"
              >
                Last Year
              </button>
              <button
                onClick={() => handleFilterDurationChange("custom")}
                className="w-full bg-gray-200 p-2 rounded-lg mb-2"
              >
                Custom
              </button>

              {/* Custom Date Range */}
              {selectedFilterDuration === "custom" && (
                <div className="flex flex-col">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={customStartDate}
                    onChange={handleCustomDateChange}
                    className="border p-2 rounded-md mb-2"
                  />
                  <label>End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={customEndDate}
                    onChange={handleCustomDateChange}
                    className="border p-2 rounded-md mb-2"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      

      {/* Modal for Transaction Form */}
      {isModalOpen && (
            <div className="mt-16 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
                    <label className="block text-sm font-medium text-gray-900">Dealer Name:</label>
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
  <label className="block text-sm font-medium text-gray-900">Product Name:</label>
  <select
    value={productName}
    onChange={(e) => setProductName(e.target.value)}
    className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="" disabled>Select a product</option>
    {/* List of 11 predefined products */}
    <option value="Buffalo Ghee">Buffalo Ghee</option>
    <option value="Cow Ghee">Cow Ghee</option>
    <option value="Brown Ghee">Brown Ghee</option>
    <option value="White cream">White cream</option>
    <option value="Yellow Cream">Yellow Cream</option>
    <option value="Mix Cream">Mix Cream</option>
    <option value="Buffalo Milk">Buffalo Milk</option>
    <option value="Cow Milk">Cow Milk</option>
    <option value="Curd">Curd</option>
    <option value="Paneer">Paneer</option>
    <option value="Kova">Kova</option>
  </select>
</div>

                  {/* Quantity */}
                  <div className="mb-6 flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-900">Quantity:</label>
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
                    <label className="block text-sm font-medium text-gray-900">Price per Unit (₹):</label>
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
                    <label className="block text-sm font-medium text-gray-900">Total Price (₹):</label>
                    <input
                      type="number"
                      value={totalPrice}
                      readOnly
                      className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    />
                  </div>
                  {/* Transaction Type Dropdown */}
                  <div className="mb-6 flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-900">Transaction Type:</label>
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

          
      {/* Purchase Transactions Table */}
      <div className="w-full flex justify-between p-3">
  <h2 className="text-xl font-semibold">Purchase Transactions</h2>
  <div className="flex items-center gap-2">
    <input
      type="text"
      value={purchaseSearch}
      onChange={(e) => setPurchaseSearch(e.target.value)}
      placeholder="Search by name or product"
      className=" border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
    />
    <select
      value={filterDuration}
      onChange={(e) => setFilterDuration(e.target.value)}
      className="border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">All Time</option>
      <option value="7">Last 7 Days</option>
      <option value="30">Last 30 Days</option>
      <option value="365">Last 1 Year</option>
    </select>
    <CiFilter className="text-3xl cursor-pointer" onClick={handleFilterClick} />
  </div>
</div>
<div className="w-full bg-white shadow-md rounded-lg overflow-x-auto mb-6">
  <table className="min-w-full border-collapse border border-gray-200">
    <thead>
      <tr>
        <th className="border border-gray-300 p-2 text-center">Date</th>
        <th className="border border-gray-300 p-2 text-center">Dealer Name</th>
        <th className="border border-gray-300 p-2 text-center">Product Name</th>
        <th className="border border-gray-300 p-2 text-center">Quantity</th>
        <th className="border border-gray-300 p-2 text-center">Price per Unit (₹)</th>
        <th className="border border-gray-300 p-2 text-center">Total Price (₹)</th>
        <th className="border border-gray-300 p-2 text-center">Amount Paid </th>
        <th className="border border-gray-300 p-2 text-center">Amount Due </th>
        <th className="border border-gray-300 p-2 text-center">Actions</th>
        

      </tr>
    </thead>
    <tbody>
      {filteredPurchaseEntries.length > 0 ? (
        filteredPurchaseEntries.map((entry, index) => (
          <tr
            key={index}
           
            className="hover:bg-gray-200 cursor-pointer"
          >
            <td className="border border-gray-300 p-2 text-center">
              {moment(entry.timestamp).format("DD MMM YYYY")}
            </td>
            <td className="border border-gray-300 p-2 text-center hover:bg-gray-600 hover:text-white"  onClick={() => handleRowClick(entry.dealerName)}>{entry.dealerName}</td>
            <td className="border border-gray-300 p-2 text-center">{entry.productName}</td>
            <td className="border border-gray-300 p-2 text-center">{entry.quantity}</td>
            <td className="border border-gray-300 p-2 text-center">{"₹"} {entry.pricePerUnit}</td>
            <td className="border border-gray-300 p-2 text-center">{"₹"} {entry.totalPrice}</td>
            <td className="border border-gray-300 p-2 text-center"><span className="flex items-center gap-4">{"₹"} {entry.totalPrice} <MdEdit onClick={edit} /></span></td>
            <td className="border border-gray-300 p-2 text-center text-red-700 text-lg">{"₹"} {entry.totalPrice}</td>
            <td className="border border-gray-300 p-2 text-center"><span className="flex gap-4"><MdEdit /> <MdDelete /></span></td>
            


          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-center p-2">
            No purchases found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      {/* Sale Transactions Table */}
      <div className="w-full flex justify-between p-3">
          <h2 className="text-xl font-semibold">Sale Transactions</h2>
          <div className="flex items-center gap-2">
          <input
            type="text"
            value={saleSearch}
            onChange={(e) => setSaleSearch(e.target.value)}
            placeholder="Search sales..."
            className="border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
           <CiFilter className="text-3xl cursor-pointer" onClick={handleFilterClick} />
          </div>
      </div>
      <div className="w-full bg-white shadow-md rounded-lg overflow-x-auto">
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
            {filteredSaleEntries.length > 0 ? (
              filteredSaleEntries.map((entry, index) => (
                <tr
                  key={index}
                
                  className="hover:bg-gray-200 cursor-pointer"
                >
                  <td className="border border-gray-300 p-2 text-center">
                    {moment(entry.timestamp).format("DD MMM YYYY")}
                  </td>
                  <td className="border border-gray-300 p-2 text-center"   onClick={() => handleRowClick(entry.dealerName)}>{entry.dealerName}</td>
                  <td className="border border-gray-300 p-2 text-center">{entry.productName}</td>
                  <td className="border border-gray-300 p-2 text-center">{entry.quantity}</td>
                  <td className="border border-gray-300 p-2 text-center">{entry.pricePerUnit}</td>
                  <td className="border border-gray-300 p-2 text-center">{entry.totalPrice}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-2">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isOpen && selectedDealerTransactions.length > 0 && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center p-5">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Past Transactions of {selectedDealerName}

            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-red-500 hover:text-red-700 mt-2"
            >
              Close
            </button>
            </div>
            <table className="min-w-full mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Product Name</th>
                  <th className="border border-gray-300 p-2">Quantity</th>
                  <th className="border border-gray-300 p-2">Price per Unit</th>
                  <th className="border border-gray-300 p-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedDealerTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      {moment(transaction.timestamp).format("DD MMM YYYY")}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {transaction.productName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {transaction.quantity}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {transaction.pricePerUnit}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {transaction.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>














    
  );


  
  
};





export default Stock;
