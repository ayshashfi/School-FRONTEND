import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveApplications, updateLeaveStatus } from '../../redux/LeaveSlice';
import { Toaster, toast } from 'sonner';

const TeacherLeavePage = () => {
  const dispatch = useDispatch();
  const { leaves: initialLeaves, status: leaveStatus } = useSelector((state) => state.leave);
  const [leaves, setLeaves] = useState([]); // Local state to handle UI updates
  const [loadingIds, setLoadingIds] = useState([]); // Track loading state for each leave request

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

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Teacher Leave Requests Management</h1>

      {leaveStatus === 'loading' ? (
        <p className="text-lg text-gray-600 text-center">Loading...</p>
      ) : (
        leaves.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaves.map((leave) => (
              <div key={leave.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
                <div className="mb-4">
                  <p className="text-xl font-semibold text-gray-900"><strong>Student:</strong> {leave.student_detail.username}</p>
                </div>
                <div className="mb-4">
                  <p className="text-lg font-medium text-gray-700"><strong>From:</strong> {leave.start_date} <strong>To:</strong> {leave.end_date}</p>
                </div>
                <div className="mb-4">
                  <p className="text-md text-gray-700"><strong>Reason:</strong> {leave.reason}</p>
                </div>
                <div className="mb-4">
                  <p className={`text-lg font-medium ${leave.status === 'APPROVED' ? 'text-green-500' : leave.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'}`}>
                    <strong>Status:</strong> {leave.status}
                  </p>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => handleUpdateStatus(leave.id, 'APPROVED')}
                    className={`w-1/2 py-2 mr-2 ${loadingIds.includes(leave.id) ? 'bg-green-300' : 'bg-green-500'} text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400`}
                    disabled={loadingIds.includes(leave.id)}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(leave.id, 'REJECTED')}
                    className={`w-1/2 py-2 ml-2 ${loadingIds.includes(leave.id) ? 'bg-red-300' : 'bg-red-500'} text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400`}
                    disabled={loadingIds.includes(leave.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600 text-center">No leave applications found.</p>
        )
      )}
      <Toaster />
    </div>
  );
};

export default TeacherLeavePage;
