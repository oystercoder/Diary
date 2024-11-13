import React, { useState, useEffect } from "react";

const Diary = () => {
  const [diary, setDiary] = useState("");
  const [managerName, setManagerName] = useState("");
  const [entries, setEntries] = useState([]); // Initialize as an empty array
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [loading, setLoading] = useState(false); // Loading state for fetching entries
  const [error, setError] = useState(null); // Error state for handling errors

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"; // Use Vite environment variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/diary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ diary, managerName }),
      });
      const data = await response.json();
      alert(data.message);
      fetchEntries(); // Fetch the updated entries after submission
      setDiary("");
      setManagerName("");
      setIsModalOpen(false); // Close the modal after submission
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to save the diary entry.");
    }
  };

  const fetchEntries = async () => {
    setLoading(true); // Set loading to true when fetching
    setError(null); // Reset error state
    try {
      const response = await fetch(`${apiUrl}/diary`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEntries(data); // Ensure this is an array
    } catch (error) {
      console.error("Error fetching entries:", error);
      setError("Failed to fetch diary entries.");
    } finally {
      setLoading(false); // Reset loading state after fetch
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [apiUrl]);

  return (
    <div className="flex flex-col items-center bg-gray-200 p-6 h-screen">
      {/* Header Section */}
      <div className="flex justify-between w-3/4 mb-4">
        <h1 className="text-2xl font-bold">Diary Entries</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xl bg-black text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Diary
        </button>
      </div>

      {/* Modal for Diary Entry Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Add Diary Entry</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 text-red-500 hover:text-red-700 text-center"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Diary Input */}
              <div className="mb-6 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">Diary:</label>
                <input
                  type="text"
                  value={diary}
                  onChange={(e) => setDiary(e.target.value)}
                  placeholder="Hyderabad"
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Manager Name Input */}
              <div className="mb-6 flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-900">
                  Manager Name:
                </label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Mr/Ms"
                  className="border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="w-full max-w-xs mt-4 text-xl bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Display Entries */}
      <div className="mt-4 ml-5 mr-5 w-full">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-4 text-lg">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-lg text-red-600">{error}</div>
          ) : (
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-center">Diary</th>
                  <th className="border border-gray-300 p-2 text-center">
                    Manager Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.length > 0 ? (
                  entries.map((entry, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 text-center p-4">
                        {entry.diary}
                      </td>
                      <td className="border border-gray-300 text-center p-4">
                        {entry.managerName}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="border border-gray-300 p-2"
                      colSpan="2"
                    >
                      No entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diary;
