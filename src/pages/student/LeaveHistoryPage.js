import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveApplications } from '../../redux/LeaveSlice';
import { Toaster } from 'sonner';

const LeaveHistoryPage = () => {
  const dispatch = useDispatch();
  const { leaves: initialLeaves, fetchStatus: leaveStatus, totalCount } = useSelector((state) => state.leave);
  const [leaves, setLeaves] = useState([]); // Local state to handle UI updates

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [leavesPerPage] = useState(5); // Set how many leaves to show per page

  useEffect(() => {
    dispatch(fetchLeaveApplications());
  }, [dispatch]);

  useEffect(() => {
    setLeaves(initialLeaves); // Sync local state with the Redux state
  }, [initialLeaves]);

  // Get current leaves for the current page
  const indexOfLastLeave = currentPage * leavesPerPage;
  const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
  const currentLeaves = leaves.slice(indexOfFirstLeave, indexOfLastLeave);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination component
  const Pagination = () => {
    const totalPages = Math.ceil(totalCount / leavesPerPage);
    
    return (
      <div className="flex justify-center mt-8 space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'} rounded-md focus:outline-none hover:bg-blue-400`}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {/* Page Number Buttons */}
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md focus:outline-none hover:bg-blue-400`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'} rounded-md focus:outline-none hover:bg-blue-400`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-900">Leave History</h1>
      
      {leaveStatus === 'loading' ? (
        <p className="text-lg text-gray-600 text-center">Loading...</p>
      ) : (
        leaves.length > 0 ? (
          <>
            {/* Leave Requests Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeaves.map((leave) => (
                    <tr key={leave.id} className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap">{leave.start_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{leave.end_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{leave.reason}</td>
                      <td className={`px-6 py-4 whitespace-nowrap font-semibold ${leave.status === 'APPROVED' ? 'text-green-500' : leave.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {leave.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination />
          </>
        ) : (
          <p className="text-lg text-gray-600 text-center">No leave applications found.</p>
        )
      )}
      <Toaster />
    </div>
  );
};

export default LeaveHistoryPage;
