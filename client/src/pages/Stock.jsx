import React, { useState, useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { CiFilter } from "react-icons/ci";

import { MdDelete } from "react-icons/md";
import { MdEdit, MdVisibility, MdAdd, MdCheck, MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";

// Add these helper functions at the top of the file
const formatPrice = (price) => {
  if (!price) return '';
  // Convert to string and remove any existing commas
  const numStr = price.toString().replace(/,/g, '');
  // Format with Indian number system
  return Number(numStr).toLocaleString('en-IN');
};

const formatQuantity = (quantity, unit) => {
  if (unit === 'kgs' && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(2)} tons`;
  }
  return `${quantity} ${unit}`;
};

const unformatPrice = (formattedPrice) => {
  if (!formattedPrice) return 0;
  // Remove commas and convert to number
  return Number(formattedPrice.toString().replace(/,/g, ''));
};

const Stock = () => {
  const [dealerName, setDealerName] = useState("");
  const [modalData, setModalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDealerName, setSelectedDealerName] = useState("");
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [selectedFilterDuration, setSelectedFilterDuration] = useState("lastWeek");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editableEntry, setEditableEntry] = useState(null);
  const [view, setView] = useState(false);
  const [paymentHistory,setpaymentHistory]=useState([]);
  const [formData, setFormData] = useState({
    dealerName: '',
    productName: '',
    quantity: '',
    unit: 'liters',
    pricePerUnit: '',
    totalPrice: '',
    paid: '',
    paidDate: '',
    due: '',
    type: 'purchase',
    fatPercentage: ''
  });

  // Holds the current entry being edited // Search term for purchase transactions
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
  const [paid, setpaid] = useState("");
  const [paidDate,setPaidDate]=useState("");
  const [due,setDue]=useState("");
  const [unit,setUnit]=useState("Liters");
  const [totalPrice, setTotalPrice] = useState(0);
  const [transactionType, setTransactionType] = useState("purchase");
  const [entries, setEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [selectedDealerTransactions, setSelectedDealerTransactions] = useState([]);
 
  const [saleSearch, setSaleSearch] = useState("");
  const apiUrl = '/api';
  if (!apiUrl) {
    console.error('API URL not configured. Please check .env file');
  }
  console.log('Using API URL:', apiUrl);

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    if (qty && pricePerUnit) {
      let total = qty * unformatPrice(pricePerUnit);
      if (productName.toLowerCase().includes('cream') && fatPercentage) {
        total = total * (fatPercentage / 100);
      }
      setTotalPrice(formatPrice(total));
    }
  };
  const [editableRow, setEditableRow] = useState(null);
const [updatedPaidAmount, setUpdatedPaidAmount] = useState(0);


const handleViewClick = () => {
  setView(true);
};
const closeModal = () => {
 setView(false)
};

const handleSave = async (id) => {
  console.log(id)
  try {
    const response = await fetch(`${apiUrl}/stock/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editableEntry),
    });
    console.log(response)
    const data = await response.json();
    console.log(data);
    if (response.status==200) {
      alert("Entry updated successfully!");
      fetchEntries(); // Refresh the entries
      setIsEditModalOpen(false);
      setEditableEntry(null);
    } else {
      
      alert(`Error: ${data.message || 'Something went wrong'}`);
    }
  } catch (error) {
    console.error("Error updating entry:", error);
  }
};
const handleAddPayment = async (id, amount) => {
  const numAmount = unformatPrice(amount);
  if (!amount || isNaN(numAmount) || numAmount <= 0) {
    alert('Please enter a valid payment amount');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/stock/${id}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: numAmount,
        date: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add payment');
    }

    const data = await response.json();
    
    // Reset states
    setUpdatedPaidAmount('');
    setEditableRow(null);
    
    // Refresh entries and payment history
    fetchEntries();
    handleViewPayments(id);
    
    alert('Payment added successfully');
  } catch (error) {
    console.error('Error adding payment:', error);
    alert(error.message || 'Failed to add payment. Please try again.');
  }
};


const handleEditClick = (id, paid) => {
  setEditableRow(id);
  setUpdatedPaidAmount(paid.toString());
  setEditingQuantity(true);
  const entry = entries.find(e => e._id === id);
  if (entry) {
    setEditedQuantity(entry.quantity.toString());
  }
};
const handleSaveEdit = async (id, amount) => {
  const numAmount = unformatPrice(amount);
  if (!amount || isNaN(numAmount) || numAmount <= 0) {
    alert('Please enter a valid payment amount');
    return;
  }

  const newQuantity = Number(editedQuantity);
  if (isNaN(newQuantity) || newQuantity <= 0) {
    alert('Please enter a valid quantity');
    return;
  }

  const entry = entries.find(e => e._id === id);
  if (!entry) {
    alert('Entry not found');
    return;
  }

  const newTotalPrice = newQuantity * entry.pricePerUnit;

  try {
    const response = await fetch(`${apiUrl}/stock/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: newQuantity,
        totalPrice: newTotalPrice,
        paid: numAmount
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update entry');
    }

    // Refresh the entries
    fetchEntries();
    setEditableRow(null);
    setUpdatedPaidAmount('');
    setEditingQuantity(false);
    setEditedQuantity('');
    
    // If payment history modal is open, refresh it
    if (showModal) {
    handleViewPayments(id);
    }
    
    alert('Entry updated successfully');
  } catch (error) {
    console.error('Error updating entry:', error);
    alert('Failed to update entry');
  }
};




  const handleTransactionButtonClick = () => {
    setIsModalOpen(true); // Only open the modal when the button is clicked
  };

  const handlePriceChange = (e) => {
    const formattedPrice = formatPrice(unformatPrice(e.target.value));
    setPricePerUnit(formattedPrice);
    const numericPrice = unformatPrice(formattedPrice);
    if (quantity && numericPrice) {
      let total = quantity * numericPrice;
      if (productName.toLowerCase().includes('cream') && fatPercentage) {
        total = total * (fatPercentage / 100);
      }
      setTotalPrice(formatPrice(total));
    }
  };
  const validateTransaction = () => {
    if (!dealerName || !productName || !unit) {
      alert("Dealer name, product name, and unit are required.");
      return false;
    }
    if (isNaN(quantity) || quantity <= 0) {
      alert("Quantity must be a positive number.");
      return false;
    }
    if (isNaN(unformatPrice(pricePerUnit)) || unformatPrice(pricePerUnit) <= 0) {
      alert("Price per unit must be a positive number.");
      return false;
    }
    if (isNaN(unformatPrice(totalPrice)) || unformatPrice(totalPrice) <= 0) {
      alert("Total price must be a positive number.");
      return false;
    }
    if (isNaN(unformatPrice(paid)) || unformatPrice(paid) < 0) {
      alert("Paid amount must be a non-negative number.");
      return false;
    }
    if (!due || !paidDate) {
      alert("Due date and paid date are required.");
      return false;
    }
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTransaction()) return;

    const transactionData = {
      dealerName,
      productName,
      quantity: Number(quantity),
      unit,
      pricePerUnit: unformatPrice(pricePerUnit),
      totalPrice: unformatPrice(totalPrice),
      paid: unformatPrice(paid),
      due,
      paidDate,
      type: transactionType,
      fatPercentage: productName.toLowerCase().includes('cream') ? Number(fatPercentage) : null
    };

    try {
      const response = await fetch(`${apiUrl}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const data = await response.json();
      alert(data.message);
      fetchEntries();
      setDealerName("");
      setProductName("");
      setQuantity("");
      setPricePerUnit("");
      setTotalPrice("");
      setpaid("");
      setDue("");
      setPaidDate("");
      setFatPercentage("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add transaction");
    }
  };

  // Update fetchEntries to properly handle fat percentage
  const fetchEntries = async () => {
    try {
      const response = await fetch(`${apiUrl}/stock`);
      const data = await response.json();
      
      // Sort entries by date in descending order
      const sortedEntries = data.sort((a, b) => {
        return new Date(b.paidDate) - new Date(a.paidDate);
      });

      setEntries(sortedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };
  const handleViewPayments = async (transactionId) => {
    try {
      const response = await fetch(`${apiUrl}/stock/${transactionId}/payments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }
      
      const data = await response.json();
      console.log('Payment history:', data);

      if (!data.payments) {
        throw new Error('Invalid payment data received');
      }

      const transaction = entries.find(entry => entry._id === transactionId);
      if (!transaction) return;

      // Calculate total paid from the payments array
      const totalPaid = data.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const remainingDue = transaction.totalPrice - totalPaid;

      setModalData({
        _id: transactionId,
        payments: data.payments,
        totalPrice: transaction.totalPrice,
        totalPaid: totalPaid,
        remainingDue: remainingDue
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      alert('Failed to fetch payment history');
    }
  };
  
  const del = async(id) => {
    try {
      // Send a DELETE request to the backend
      const response = await fetch(`${apiUrl}/stock/${id}`, {
        method: 'DELETE',
      });
  
      // If the response is not okay, throw an error
      if (response.status!=200) {
        const errorDetails = await response.json();
        throw new Error(`Failed to delete: ${errorDetails.message || 'Unknown error'}`);
      }
  
      // Remove the deleted item from the local state
      setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
  
      console.log('Item deleted successfully');
      alert("transaction deleted successfully")
    } catch (error) {
      console.error('Error deleting row:', error);
      // Optionally: Show a user-friendly error message
      alert('Failed to delete the item. Please try again.');
    }
  };
  
  // Load transaction entries on component mount
  useEffect(() => {
    console.log('Component mounted');
    testApiConnection();
    fetchEntries();
  }, []);

  
  const edit=async(id)=>{
    alert("editing is okay")
    if (updatedPaidAmount !== "") {
      try {
        // Send a PUT request to update the entry in the backend
        const response = await fetch(`${apiUrl}/stock/${id}`, {
          method: 'PUT', // You can use PATCH too, but PUT is more common for full updates
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paid: updatedPaidAmount, // The updated paid value
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update the item");
        }
  
        // Update the state with the new paid value locally
        setEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry._id === id ? { ...entry, paid: updatedPaidAmount } : entry
          )
        );
  
        // Reset editable state
        setEditableRow(null);
        console.log("Item updated successfully");
      } catch (error) {
        console.error("Error updating row:", error);
        alert('Failed to update the item. Please try again.');
      }
    }
    
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
   
      if (Array.isArray(entries)) {
        // If it's already an array, apply filtering logic
        return entries.filter(entry => entry.quantity > 0); // Example condition
      } else if (typeof entries === 'object' && entries !== null) {
        // Convert object to an array of its values
        console.warn("filterEntries received an object, converting to array:", entries);
        const entriesArray = Object.values(entries); // Adjust this based on your needs
        return entriesArray.filter(entry => entry.quantity > 0); // Apply filtering
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
  const filteredPurchaseEntries = useMemo(() => {
    return entries.filter(
      (entry) =>
        entry.type === "purchase" &&
        (entry.dealerName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
          entry.productName.toLowerCase().includes(purchaseSearch.toLowerCase()))
    );
  }, [entries, purchaseSearch]);

  useEffect(() => {
    console.log("Filtered entries:", filteredPurchaseEntries);
  }, [filteredPurchaseEntries]);

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

  // Add ProductCards component with slider
  const ProductCards = () => {
    const products = [
      "Buffalo Ghee",
      "Cow Ghee",
      "Brown Ghee",
      "White Cream",
      "Yellow Cream",
      "Mix Cream",
      "Buffalo Milk",
      "Cow Milk",
      "Curd",
      "Paneer",
      "Kova"
    ];

    const scrollContainerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
        setScrollProgress(progress);
      }
    };

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
      }
    }, []);

    // Calculate quantities for each product
    const getProductStats = (productName) => {
      const productEntries = entries.filter(entry => entry.productName === productName);
      const totalPurchase = productEntries
        .filter(entry => entry.type === 'purchase')
        .reduce((sum, entry) => sum + entry.quantity, 0);
      const totalSale = productEntries
        .filter(entry => entry.type === 'sale')
        .reduce((sum, entry) => sum + entry.quantity, 0);
      const remaining = totalPurchase - totalSale;
      
      // Get the unit from the most recent entry
      const unit = productEntries.length > 0 ? productEntries[0].unit : '';

      return {
        totalPurchase,
        totalSale,
        remaining,
        unit
      };
    };

    return (
      <div className="mb-8">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 py-6 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => {
            const stats = getProductStats(product);
            return (
              <div
                key={product}
                className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="bg-gray-900 p-4 group">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white truncate flex-1 mr-3 group-hover:text-gray-200">{product}</h3>
                    <div className={`text-sm font-medium px-3 py-1 rounded-full transition-colors duration-300 ${
                      stats.remaining > 0 
                        ? 'bg-gray-700 text-gray-100 group-hover:bg-gray-600' 
                        : 'bg-red-500/20 text-red-100 group-hover:bg-red-500/30'
                    }`}>
                      {stats.remaining} {stats.unit}
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:bg-gray-100 hover:border-gray-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Purchase</span>
                        <div className="bg-gray-200 p-1.5 rounded-full transition-colors duration-300 hover:bg-gray-300">
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalPurchase}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:bg-gray-100 hover:border-gray-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Sale</span>
                        <div className="bg-gray-200 p-1.5 rounded-full transition-colors duration-300 hover:bg-gray-300">
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalSale}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Scroll Line Indicator */}
        <div className="flex justify-center mt-4">
          <div className="w-96 h-2 bg-gray-200 rounded-full relative">
            <div 
              className="absolute left-0 top-0 h-full bg-black rounded-full transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Add a function to calculate total payments for a transaction
  const calculateTotalPayments = (transactionId) => {
    const transaction = entries.find(entry => entry._id === transactionId);
    if (!transaction) return 0;

    const initialPayment = Number(transaction.paid) || 0;
    const additionalPayments = (transaction.payments || [])
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    
    return initialPayment + additionalPayments;
  };

  useEffect(() => {
    console.log("Current entries:", entries);
    console.log("Filtered entries:", filteredPurchaseEntries);
  }, [entries, filteredPurchaseEntries]);

  useEffect(() => {
    console.log("Entries updated:", entries.length, "items");
    console.log("Filtered entries:", filteredPurchaseEntries.length, "items");
  }, [entries, filteredPurchaseEntries]);

  // Add useEffect for debugging
  useEffect(() => {
    console.log("Current entries state:", entries);
  }, [entries]);

  // Add a function to check API connectivity
  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${apiUrl}/stock/test`);
      const data = await response.json();
      console.log("API connection test:", data);
    } catch (error) {
      console.error("API connection error:", error);
    }
  };

  // Call it when component mounts
  useEffect(() => {
    console.log("Connecting to API at:", apiUrl);
    checkApiConnection();
  }, []);

  // Add API test function
  const testApiConnection = async () => {
    try {
      const response = await fetch(`${apiUrl}/test`);
      const data = await response.json();
      console.log('API test response:', data);
    } catch (error) {
      console.error('API test failed:', error);
    }
  };

  // Add new state variables
  const [wholesalers, setWholesalers] = useState([]);
  const [showWholesalerModal, setShowWholesalerModal] = useState(false);
  const [newWholesaler, setNewWholesaler] = useState({
    name: '',
    location: '',
    contactNumber: ''
  });
  const [dealerSuggestions, setDealerSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Add function to fetch wholesalers
  const fetchWholesalers = async () => {
    try {
      const response = await fetch(`${apiUrl}/wholesale`);
      if (!response.ok) throw new Error('Failed to fetch wholesalers');
      const data = await response.json();
      setWholesalers(data);
    } catch (error) {
      console.error('Error fetching wholesalers:', error);
    }
  };

  // Add useEffect to fetch wholesalers
  useEffect(() => {
    fetchWholesalers();
  }, []);

  // Add function to handle dealer name input
  const handleDealerNameChange = (e) => {
    const value = e.target.value;
    setDealerName(value);
    
    if (value.length > 0) {
      const filtered = wholesalers
        .filter(w => w.name.toLowerCase().includes(value.toLowerCase()))
        .map(w => w.name);
      setDealerSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setDealerSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Add function to handle wholesaler selection
  const handleSelectWholesaler = (name) => {
    setDealerName(name);
    setShowSuggestions(false);
  };

  // Add function to handle new wholesaler submission
  const handleAddNewWholesaler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/wholesale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWholesaler),
      });

      if (!response.ok) throw new Error('Failed to add wholesaler');

      const data = await response.json();
      await fetchWholesalers();
      setDealerName(newWholesaler.name);
      setShowWholesalerModal(false);
      setNewWholesaler({ name: '', location: '', contactNumber: '' });
    } catch (error) {
      console.error('Error adding wholesaler:', error);
      alert('Failed to add wholesaler');
    }
  };

  // Add new state for editing quantity
  const [editingQuantity, setEditingQuantity] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState('');

  // Add function to handle quantity edit
  const handleEditQuantity = (entry) => {
    setEditingQuantity(true);
    setEditedQuantity(entry.quantity.toString());
    setEditableRow(entry._id);
  };

  // Add function to save edited quantity
  const handleSaveQuantity = async (entry) => {
    const newQuantity = Number(editedQuantity);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    const newTotalPrice = newQuantity * entry.pricePerUnit;

    try {
      const response = await fetch(`${apiUrl}/stock/${entry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity,
          totalPrice: newTotalPrice
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      // Refresh the entries
      fetchEntries();
      setEditingQuantity(false);
      setEditableRow(null);
      setEditedQuantity('');
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  // Add new state for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    dealerName: '',
    productName: '',
    quantity: '',
    unit: '',
    pricePerUnit: '',
    totalPrice: '',
    paid: '',
    paidDate: '',
    due: '',
    type: '',
    fatPercentage: ''
  });

  // Add function to handle edit click
  const handleRowEdit = (entry) => {
    setEditFormData({
      _id: entry._id,
      dealerName: entry.dealerName,
      productName: entry.productName,
      quantity: entry.quantity,
      unit: entry.unit,
      pricePerUnit: entry.pricePerUnit,
      totalPrice: entry.totalPrice,
      paid: entry.paid,
      paidDate: moment(entry.paidDate).format('YYYY-MM-DD'),
      due: moment(entry.due).format('YYYY-MM-DD'),
      type: entry.type,
      fatPercentage: entry.fatPercentage
    });
    setShowEditModal(true);
  };

  // Add function to handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Calculate total price when quantity or price per unit changes
      if (name === 'quantity' || name === 'pricePerUnit' || name === 'fatPercentage') {
        const quantity = name === 'quantity' ? value : prev.quantity;
        const pricePerUnit = name === 'pricePerUnit' ? value : prev.pricePerUnit;
        const fatPercentage = name === 'fatPercentage' ? value : prev.fatPercentage;
        
        if (quantity && pricePerUnit) {
          let total = quantity * pricePerUnit;
          // Apply fat percentage if product is cream and percentage is provided
          if (prev.productName.toLowerCase().includes('cream') && fatPercentage) {
            total = total * (fatPercentage / 100);
          }
          newData.totalPrice = total;
        }
      }
      
      return newData;
    });
  };

  // Add function to handle save
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/stock/${editFormData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }

      // Update the entries state with the edited data
      setEntries(entries.map(entry => 
        entry._id === editFormData._id ? { ...entry, ...editFormData } : entry
      ));

      setShowEditModal(false);
      alert('Entry updated successfully');
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update entry');
    }
  };

  // Add state for fat percentage at the top with other state variables
  const [fatPercentage, setFatPercentage] = useState("");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stock Management</h1>
          <button
          onClick={handleTransactionButtonClick}
          className="text-xl bg-black text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
          Transaction
          </button>
        </div>

      <div className="mb-8">
        <ProductCards />
      </div>

      {/* Purchase Transactions Table */}
      <div className="w-full flex justify-between p-3">
        <h2 className="text-xl font-semibold">Purchase Transactions</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={purchaseSearch}
            onChange={(e) => setPurchaseSearch(e.target.value)}
            placeholder="Search"
            className="border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
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
              <th className="border border-gray-300 p-2 text-center">Purchase Date</th>
              <th className="border border-gray-300 p-2 text-center">Dealer Name</th>
              <th className="border border-gray-300 p-2 text-center">Product Name</th>
              <th className="border border-gray-300 p-2 text-center">Quantity</th>
              <th className="border border-gray-300 p-2 text-center">Price per Unit (₹)</th>
              <th className="border border-gray-300 p-2 text-center">Total Price (₹)</th>
              <th className="border border-gray-300 p-2 text-center">Amount Paid</th>
              <th className="border border-gray-300 p-2 text-center">Amount Due</th>
              <th className="border border-gray-300 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(entries) ? (
              entries.length > 0 ? (
                filteredPurchaseEntries.map((entry, index) => (
                  <tr key={entry._id || index} className="hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 p-2 text-center">
                      {moment(entry.paidDate).format("DD MMM YYYY")}
                    </td>
                    <td 
                      className="border border-gray-300 p-2 text-center cursor-pointer hover:text-blue-600"
                      onClick={() => {
                        setSelectedDealerName(entry.dealerName);
                        setSelectedDealerTransactions(entries.filter(t => t.dealerName === entry.dealerName));
                        setOpen(true);
                      }}
                    >
                      {entry.dealerName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex flex-col">
                        <span>{entry.productName}</span>
                        {entry.productName.toLowerCase().includes('cream') && entry.fatPercentage && (
                          <span className="text-sm font-bold text-yellow-500">Fat: {entry.fatPercentage}%</span>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {formatQuantity(entry.quantity, entry.unit)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      ₹{formatPrice(entry.pricePerUnit)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      ₹{formatPrice(entry.totalPrice)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">₹{formatPrice(calculateTotalPayments(entry._id))}</span>
                          <MdVisibility
                            onClick={() => handleViewPayments(entry._id)}
                            className="cursor-pointer text-blue-500 hover:text-blue-700 text-xl"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-4 text-center text-lg font-semibold">
                      {entry.totalPrice - calculateTotalPayments(entry._id) === 0 ? (
                        <div className="text-green-600 flex flex-col items-center">
                          <div className="flex items-center gap-2">
                            <span>Paid</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="text-sm mt-1">
                            {moment(entry.payments[entry.payments.length - 1]?.date).format("DD MMM YYYY")}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-red-700">
                            ₹{formatPrice(entry.totalPrice - calculateTotalPayments(entry._id))}
                          </div>
                          <div className="text-gray-800 text-sm mt-2">
                            <span className="font-medium">
                              {moment(entry.due).format("DD MMM YYYY")}
                            </span>
                            <span className="text-gray-500 ml-2">
                              ({moment(entry.due).diff(moment(), "days")} days left)
                            </span>
                          </div>
                        </>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <span className="flex gap-4 justify-center">
                        <MdEdit
                          onClick={() => handleRowEdit(entry)}
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                        />
                        <MdDelete
                          onClick={() => del(entry._id)}
                          className="cursor-pointer text-red-500"
                        />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-4">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                      <p>Loading stock entries...</p>
                    </div>
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4 text-red-600">
                  Error loading data. Please refresh the page.
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
              <th className="border border-gray-300 p-2 text-center">Amount Paid</th>
              <th className="border border-gray-300 p-2 text-center">Amount To Get</th>
              <th className="border border-gray-300 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSaleEntries.length > 0 ? (
              filteredSaleEntries.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-200 cursor-pointer">
                  <td className="border border-gray-300 p-2 text-center">
                    {moment(entry.timestamp).format("DD MMM YYYY")}
                  </td>
                  <td 
                    className="border border-gray-300 p-2 text-center cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(entry.dealerName)}
                  >
                    {entry.dealerName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex flex-col">
                      <span>{entry.productName}</span>
                      {entry.productName.toLowerCase().includes('cream') && entry.fatPercentage && (
                        <span className="text-sm font-bold text-yellow-500">Fat: {entry.fatPercentage}%</span>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {formatQuantity(entry.quantity, entry.unit)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ₹{formatPrice(entry.pricePerUnit)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    ₹{formatPrice(entry.totalPrice)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <span>₹{formatPrice(calculateTotalPayments(entry._id))}</span>
                        <MdVisibility
                          onClick={() => handleViewPayments(entry._id)}
                          className="cursor-pointer text-blue-500 hover:text-blue-700 text-xl"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-4 text-center text-lg font-semibold">
                    {entry.totalPrice - calculateTotalPayments(entry._id) === 0 ? (
                      <div className="text-green-600 flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <span>Paid</span>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="text-sm mt-1">
                          {moment(entry.payments[entry.payments.length - 1]?.date).format("DD MMM YYYY")}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-red-700">
                          ₹{formatPrice(entry.totalPrice - calculateTotalPayments(entry._id))}
                        </div>
                        <div className="text-gray-800 text-sm mt-2">
                          <span className="font-medium">
                            {moment(entry.due).format("DD MMM YYYY")}
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({moment(entry.due).diff(moment(), "days")} days left)
                          </span>
                        </div>
                      </>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <span className="flex gap-4 justify-center">
                      <MdEdit 
                        onClick={() => handleRowEdit(entry)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                      />
                      <MdDelete onClick={() => del(entry._id)} className="cursor-pointer text-red-500" />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-2">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* All modals */}
      {isModalOpen && (
        <div className=" fixed inset-0 flex items-center justify-center bg-black h-1vh bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-lg overflow-auto max-h-[90vh]">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="overflow-y-auto px-8 py-6">
              {/* Transaction Type Radio Buttons */}
              <div className="mb-8">
                <div className="flex justify-center gap-4 p-2 bg-gray-100 rounded-lg">
                  <label 
                    className={`flex-1 py-3 px-6 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                      transactionType === 'purchase' 
                        ? 'bg-black text-white shadow-lg' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="transactionType"
                      value="purchase"
                      checked={transactionType === 'purchase'}
                      onChange={(e) => setTransactionType(e.target.value)}
                      className="hidden"
                    />
                    Purchase
                  </label>
                  <label 
                    className={`flex-1 py-3 px-6 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                      transactionType === 'sale' 
                        ? 'bg-black text-white shadow-lg' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="transactionType"
                      value="sale"
                      checked={transactionType === 'sale'}
                      onChange={(e) => setTransactionType(e.target.value)}
                      className="hidden"
                    />
                    Sale
                  </label>
                </div>
              </div>

              {/* Dealer Name */}
              <div className="mb-8 flex flex-col gap-3 relative">
                <label className="block text-sm font-medium text-gray-900">Dealer Name:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={dealerName}
                    onChange={handleDealerNameChange}
                    onFocus={() => dealerName && setShowSuggestions(true)}
                    placeholder="Enter dealer's name"
                    className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {!wholesalers.some(w => w.name === dealerName) && dealerName.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewWholesaler(prev => ({ ...prev, name: dealerName }));
                        setShowWholesalerModal(true);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Add as New Wholesaler
                    </button>
                  )}
                </div>
                
                {/* Dealer Suggestions */}
                {showSuggestions && dealerSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50 max-h-48 overflow-y-auto">
                    {dealerSuggestions.map((name, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectWholesaler(name)}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div className="mb-8 flex flex-col gap-3">
                <label className="block text-sm font-medium text-gray-900">Product Name:</label>
                <div className="flex flex-col">
                  <select
                    name="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select a product</option>
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
                  {productName.toLowerCase().includes('cream') && (
                    <div className="mt-2">
                      <input
                        type="number"
                        value={fatPercentage}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFatPercentage(value);
                          // Update total price when fat percentage changes
                          if (quantity && pricePerUnit) {
                            const total = quantity * unformatPrice(pricePerUnit) * (value / 100);
                            setTotalPrice(formatPrice(total));
                          }
                        }}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Enter fat percentage"
                        min="0"
                        max="100"
                        step="0.01"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex gap-6 mb-8">
                <div className="flex flex-col gap-3 flex-1">
                  <label className="block text-sm font-medium text-gray-900">Quantity:</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    placeholder="Enter quantity"
                    className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="block text-sm font-medium text-gray-900">Units</label>
                  <div className="flex gap-6">
                    {["liters", "kgs", "tons"].map((option) => (
                      <label key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="unit"
                          value={option}
                          checked={unit === option}
                          onChange={() => setUnit(option)}
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price per Unit */}
              <div className="mb-8 flex flex-col gap-3">
                <label className="block text-sm font-medium text-gray-900">Price Per Unit (₹):</label>
                <input
                  type="text"
                  value={pricePerUnit}
                  onChange={handlePriceChange}
                  className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price per unit"
                />
              </div>

              {/* Total Price */}
              <div className="mb-8 flex flex-col gap-3">
                <label className="block text-sm font-medium text-gray-900">Total Price (₹):</label>
                <input
                  type="text"
                  value={totalPrice}
                  readOnly
                  className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                />
              </div>

              {/* Purchase Date */}
              <div className="mb-8 flex flex-col gap-3">
                <label className="block text-sm font-medium text-gray-900">Purchase Date:</label>
                <input
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Amount Paid */}
              <div className="mb-8 flex flex-col gap-3">
                <label className="block text-sm font-medium text-gray-900">Amount Paid (₹):</label>
                <input
                  type="text"
                  value={paid}
                  onChange={(e) => setpaid(formatPrice(unformatPrice(e.target.value)))}
                  className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount paid"
                />
              </div>

              {/* Due Date */}
              <div className="mb-8 flex flex-col gap-3">
                <label className="block text-sm font-medium text-gray-900">Due Amount Date:</label>
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="border border-gray-300 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center mt-8">
                <button
                  type="submit"
                  className="w-full text-xl bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                  Submit Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-4">
              {modalData.payments && modalData.payments.length > 0 ? (
                <>
                  <ul className="divide-y divide-gray-200">
                    {modalData.payments.map((payment, idx) => (
                      <li key={idx} className="py-4">
                        <div className="flex justify-between items-center">
                          <div className="text-gray-700">
                            {moment(payment.date).format("DD MMM YYYY")}
                            {payment.type === 'initial' && ' (Initial)'}
                          </div>
                          <div className="font-semibold text-lg">₹{formatPrice(payment.amount)}</div>
                        </div>
                        <div className="text-sm text-gray-600 text-right mt-1">
                          Running Total: ₹{formatPrice(payment.runningTotal)}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Total Price</div>
                        <div className="text-lg font-semibold">₹{formatPrice(modalData.totalPrice)}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Total Paid</div>
                        <div className="text-lg font-semibold text-green-600">₹{formatPrice(modalData.totalPaid)}</div>
                      </div>
                    </div>
                    <div className="mt-4 bg-red-50 p-4 rounded-lg">
                      <div className="text-sm text-red-600">Status</div>
                      {modalData.remainingDue === 0 ? (
                        <div className="text-lg font-semibold text-green-600 flex items-center gap-2">
                          <span>PAID</span>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="text-lg font-semibold text-red-600">
                          Remaining Due: ₹{formatPrice(modalData.remainingDue)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Add New Payment</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={updatedPaidAmount}
                        onChange={(e) => setUpdatedPaidAmount(formatPrice(unformatPrice(e.target.value)))}
                        className="p-3 border rounded-lg w-full text-center text-lg"
                        placeholder="Enter payment amount"
                      />
                      <button
                        onClick={() => {
                          handleAddPayment(modalData._id, updatedPaidAmount);
                          setShowModal(false);
                        }}
                        disabled={!modalData._id}
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
                      >
                        Add Payment
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">No payment history available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dealer Transaction History Modal */}
       {isOpen && selectedDealerTransactions.length > 0 && (
         <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center p-5">
           <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
             <div className="flex justify-between">
               <h2 className="text-xl font-semibold">Past Transactions of {selectedDealerName}</h2>
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
                       {moment(transaction.paidDate).format("DD MMM YYYY")}
                     </td>
                     <td className="border border-gray-300 p-2">
                       {transaction.productName}
                     </td>
                     <td className="border border-gray-300 p-2">
                       {formatQuantity(transaction.quantity, transaction.unit)}
                     </td>
                     <td className="border border-gray-300 p-2">
                       ₹{formatPrice(transaction.pricePerUnit)}
                     </td>
                     <td className="border border-gray-300 p-2">
                       ₹{formatPrice(transaction.totalPrice)}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       )}

       {showEditModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
           <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6 pb-4 border-b">
               <h2 className="text-xl font-semibold text-gray-800">Edit Transaction</h2>
               <button
                 onClick={() => setShowEditModal(false)}
                 className="text-gray-500 hover:text-gray-700 text-xl"
               >
                 ✕
               </button>
             </div>

             <form onSubmit={handleEditSubmit} className="space-y-6">
               <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Dealer Name</label>
                   <input
                     type="text"
                     name="dealerName"
                     value={editFormData.dealerName}
                       onChange={handleInputChange}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                   <select
                     name="productName"
                     value={editFormData.productName}
                       onChange={handleInputChange}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                     required
                   >
                     <option value="">Select a product</option>
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

                 {editFormData.productName.toLowerCase().includes('cream') && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Fat Percentage</label>
                     <input
                       type="number"
                       name="fatPercentage"
                       value={editFormData.fatPercentage}
                       onChange={handleInputChange}
                       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                       placeholder="Enter fat percentage"
                       min="0"
                       max="100"
                       step="0.01"
                       required
                     />
                   </div>
                 )}

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                   <input
                     type="number"
                     name="quantity"
                     value={editFormData.quantity}
                       onChange={handleInputChange}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                     required
                     min="1"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                   <select
                     name="unit"
                     value={editFormData.unit}
                       onChange={handleInputChange}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                     required
                   >
                     <option value="">Select unit</option>
                     <option value="liters">Liters</option>
                     <option value="kgs">KGs</option>
                     <option value="tons">Tons</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Unit (₹)</label>
                   <input
                     type="number"
                     name="pricePerUnit"
                     value={editFormData.pricePerUnit}
                       onChange={handleInputChange}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Total Price (₹)</label>
                   <input
                     type="number"
                     name="totalPrice"
                     value={editFormData.totalPrice}
                     className="w-full p-3 border rounded-lg bg-gray-50 text-gray-500"
                     readOnly
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid (₹)</label>
                   <input
                     type="number"
                     name="paid"
                     value={editFormData.paid}
                       onChange={handleInputChange}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                   <select
                     name="type"
                     value={editFormData.type}
                     onChange={handleInputChange}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                     required
                   >
                     <option value="purchase">Purchase</option>
                     <option value="sale">Sale</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     {editFormData.type === 'sale' ? 'Sale Date' : 'Paid Date'}
                   </label>
                   <input
                     type="date"
                     name="paidDate"
                     value={editFormData.paidDate}
                       onChange={handleInputChange}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                   <input
                     type="date"
                     name="due"
                     value={editFormData.due}
                       onChange={handleInputChange}
                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                   />
                   </div>
                 </div>

               <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                 <button
                   type="button"
                   onClick={() => setShowEditModal(false)}
                   className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-medium"
                 >
                   Save Changes
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
    </div>
  );
};

export default Stock;
