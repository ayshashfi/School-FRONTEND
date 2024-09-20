import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentAttendance } from '../../redux/AttendanceSlice';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Import flatpickr CSS

const StudentAttendance = ({ studentId }) => {
  const dispatch = useDispatch();
  const attendance = useSelector((state) => state.attendance.attendance);
  const attendanceStatus = useSelector((state) => state.attendance.status);
  const error = useSelector((state) => state.attendance.error);
  const { user } = useSelector((store) => store.auth);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const datepickerRef = useRef(null);

  // Initialize flatpickr for date range selection
  useEffect(() => {
    if (datepickerRef.current) {
      flatpickr(datepickerRef.current, {
        mode: 'range',
        dateFormat: 'Y-m-d',
        maxDate: new Date(), // Set maxDate as today's date
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            const selectedFromDate = selectedDates[0].toISOString().split('T')[0];
            const selectedToDate = selectedDates[1].toISOString().split('T')[0];
            
            // Ensure 'toDate' includes the full day of the selected upper range
            setFromDate(selectedFromDate);
            setToDate(selectedToDate); // No need to adjust today's date manually now
          }
        },
      });
    }
  }, []);

  // Fetch attendance data when user or date range changes
  useEffect(() => {
    if (user && fromDate && toDate) {
      dispatch(fetchStudentAttendance({ studentId: studentId || user.id, fromDate, toDate }));
    }
  }, [dispatch, user, fromDate, toDate, studentId]);

  return (
    <div className="p-4">
      <h1 className="text-3xl text-gray-900 pb-4 font-bold">Student Attendance</h1>
      <div className="pb-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Date Range
          <input
            ref={datepickerRef}
            type="text"
            placeholder="Select date range"
            className="form-datepicker block w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </label>
      </div>
      {fromDate && toDate ? (
        <>
          {attendanceStatus === 'loading' && <p>Loading...</p>}
          {attendanceStatus === 'failed' && <p>Error: {error}</p>}
          {attendanceStatus === 'succeeded' && (
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        Date
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Attendance
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Teacher
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record, key) => (
                      <tr key={key}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {record.date}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p
                            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                              record.present
                                ? 'bg-success text-success'
                                : 'bg-danger text-danger'
                            }`}
                          >
                            {record.present ? 'Present' : 'Absent'}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <h5 className="font-medium text-black dark:text-white">
                         {record.teacher_name} 
                          </h5>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Please select a date range to see the attendance data.</p>
      )}
    </div>
  );
};

export default StudentAttendance;
