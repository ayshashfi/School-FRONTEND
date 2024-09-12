import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveApplications, createLeaveApplication } from '../../redux/LeaveSlice';
import { Toaster, toast } from 'sonner';

const StudentLeavePage = () => {
  const dispatch = useDispatch();
  const leaves = useSelector((state) => state.leave.leaves);
  const leaveStatus = useSelector((state) => state.leave.status);
  const user = useSelector((state) => state.auth.user); // Access the user object from auth state

  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: '',
    student: user ? user.id : '', // Ensure student ID is set to the user's ID
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchLeaveApplications(user.id)); // Use user.id
    } else {
      console.error('User information is missing');
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      dispatch(createLeaveApplication(formData));
      toast.success('Leave application submitted successfully');
    } else {
      console.error('User information is missing');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-900">Student Leave Application</h1>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md mb-12 border border-gray-200">
          <div className="mb-6">
            <label htmlFor="start_date" className="block text-lg font-semibold text-gray-800 mb-2">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="end_date" className="block text-lg font-semibold text-gray-800 mb-2">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="reason" className="block text-lg font-semibold text-gray-800 mb-2">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              placeholder="Reason for leave"
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <input type="hidden" name="student" value={formData.student} /> {/* Ensure student ID is included */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
          >
            Apply Leave
          </button>
        </form>

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">Your Leave Applications</h2>
        {leaveStatus === 'loading' ? (
          <p className="text-lg text-gray-600 text-center">Loading...</p>
        ) : (
          leaves.length > 0 ? (
            <div className="space-y-6">
              {leaves.map((leave) => (
                <div key={leave.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                  <p className="text-lg font-medium text-gray-800"><strong>From:</strong> {leave.start_date}</p>
                  <p className="text-lg font-medium text-gray-800"><strong>To:</strong> {leave.end_date}</p>
                  <p className="text-lg font-medium text-gray-800"><strong>Reason:</strong> {leave.reason}</p>
                  <p className={`text-lg font-medium ${leave.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}><strong>Status:</strong> {leave.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-600 text-center">No leave applications found.</p>
          )
        )}
        <Toaster />
      </div>
    </div>
  );
};

export default StudentLeavePage;
