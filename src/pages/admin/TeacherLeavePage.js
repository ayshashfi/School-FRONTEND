import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveApplications, updateLeaveStatus } from '../../redux/LeaveSlice';
import { Toaster, toast } from 'sonner';

const TeacherLeavePage = () => {
  const dispatch = useDispatch();
  const { leaves: initialLeaves, status: leaveStatus } = useSelector((state) => state.leave);
  const [leaves, setLeaves] = useState([]); // Local state to handle UI updates
  const [loadingIds, setLoadingIds] = useState([]); // Track loading state for each leave request

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [leavesPerPage] = useState(5); // Set how many leaves to show per page

  useEffect(() => {
    dispatch(fetchLeaveApplications());
  }, [dispatch]);

  useEffect(() => {
    setLeaves(initialLeaves); // Sync local state with the Redux state
  }, [initialLeaves]);

  const handleUpdateStatus = async (id, status) => {
    // Optimistically update the UI by creating a copy of the leaves array
    setLoadingIds((prev) => [...prev, id]);
    const updatedLeaves = leaves.map((leave) =>
      leave.id === id ? { ...leave, status } : leave
    );
    setLeaves(updatedLeaves);

    try {
      await dispatch(updateLeaveStatus({ id, status })).unwrap();
      toast.success(`Leave request ${status.toLowerCase()} successfully`);
    } catch (error) {
      // Revert to the original state on failure
      setLeaves(initialLeaves);
      toast.error('Failed to update leave status');
    } finally {
      // Remove loading state after action is completed
      setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    }
  };

  // Get current leaves for the current page
  const indexOfLastLeave = currentPage * leavesPerPage;
  const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
  const currentLeaves = leaves.slice(indexOfFirstLeave, indexOfLastLeave);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Teacher Leave Requests Management</h1>

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLeaves.map((leave) => (
                    <tr key={leave.id} className="border-b">
                      <td className="px-6 py-4 whitespace-nowrap">{leave.student_detail.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{leave.start_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{leave.end_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{leave.reason}</td>
                      <td className={`px-6 py-4 whitespace-nowrap font-semibold ${leave.status === 'APPROVED' ? 'text-green-500' : leave.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {leave.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          {leave.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateStatus(leave.id, 'APPROVED')}
                              className={`py-2 px-4 ${loadingIds.includes(leave.id) ? 'bg-green-300' : 'bg-green-500'} text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400`}
                              disabled={loadingIds.includes(leave.id)}
                            >
                              Approve
                            </button>
                          )}
                          {leave.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleUpdateStatus(leave.id, 'REJECTED')}
                              className={`py-2 px-4 ${loadingIds.includes(leave.id) ? 'bg-red-300' : 'bg-red-500'} text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400`}
                              disabled={loadingIds.includes(leave.id)}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              {Array.from({ length: Math.ceil(leaves.length / leavesPerPage) }).map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md focus:outline-none hover:bg-blue-400`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-600 text-center">No leave applications found.</p>
        )
      )}
      <Toaster />
    </div>
  );
};

export default TeacherLeavePage;
