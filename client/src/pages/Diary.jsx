

// import { useState } from "react";
// const Diary = () => {
//   const [diary, setDiary] = useState('');
//   const [managerName, setManagerName] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:3001/diary', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ diary, managerName }),
//       });
//       const data = await response.json();
//       alert(data.message)
//       setDiary("")
//       setManagerName("")
//       console.log(data);
//       // Optionally reset the form or show a success message
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className='flex justify-center items-center h-screen bg-gray-200'>
//       <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md w-full max-w-lg'>

//         {/* Diary Input */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-900">Diary:</label>
//           <input 
//             type='text' 
//             value={diary}
//             onChange={(e) => setDiary(e.target.value)}
//             placeholder='Hyderabad' 
//             className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500'
//             required
//           />
//         </div>

//         {/* Manager Name Input */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-900">Manager Name:</label>
//           <input 
//             type='text' 
//             value={managerName}
//             onChange={(e) => setManagerName(e.target.value)}
//             placeholder='Mr/Ms' 
//             className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500'
//             required
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="flex items-center justify-center">
//           <button 
//             type="submit" 
//             className="w-full max-w-xs mt-8 text-2xl bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-300"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
// export default Diary
import React, { useEffect, useState } from "react";

const Diary = () => {
  const [diary, setDiary] = useState('');
  const [managerName, setManagerName] = useState('');
  const [entries, setEntries] = useState([]); // Initialize as an empty array
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      console.error('Error:', error);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:3001/diary');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEntries(data); // Ensure this is an array
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className='flex flex-col items-center h-screen bg-gray-200'>
      {/* Add Diary Button */}
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="mb-4 text-xl mt-5 flex justify-end bg-black text-white p-2 rounded-lg hover:bg-gray-300 hover:text-black transition duration-300"
      >
        Add Diary
      </button>

      {/* Modal for Diary Entry Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-lg'>
            <div className="flex justify-between">
            <h2 className='text-xl font-semibold mb-4'>Add Diary Entry</h2>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="mt-4 text-red-500 hover:text-red-700 text-center"
            >
              Close
            </button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Diary Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900">Diary:</label>
                <input 
                  type='text' 
                  value={diary}
                  onChange={(e) => setDiary(e.target.value)}
                  placeholder='Hyderabad' 
                  className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>

              {/* Manager Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900">Manager Name:</label>
                <input 
                  type='text' 
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder='Mr/Ms' 
                  className='border border-gray-300 rounded-lg w-full p-2 outline-none focus:ring-2 focus:ring-blue-500'
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

            {/* Close Modal Button */}
          
          </div>
        </div>
      )}

      {/* Display Entries */}
      <div className='mt-6 w-full max-w-lg'>
        <h2 className='text-xl font-semibold mb-4'>Diary Entries</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className='min-w-full border-collapse border border-gray-200'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='border border-gray-300 p-2 text-left'>Diary</th>
                <th className='border border-gray-300 p-2 text-left'>Manager Name</th>
              </tr>
            </thead>
            <tbody>
              {entries.length > 0 ? (
                entries.map((entry, index) => (
                  <tr key={index}>
                    <td className='border border-gray-300 p-2'>{entry.diary}</td>
                    <td className='border border-gray-300 p-2'>{entry.managerName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className='border border-gray-300 p-2' colSpan="2">No entries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Diary;
