import React, { useState, useEffect, useRef } from "react";
import { axiosAttendanceInstance, axiosInstance } from "../axios/AxiosInstance";
import { toast, Toaster } from "sonner";
import flatpickr from "flatpickr";
import { useDispatch, useSelector } from "react-redux";
import { studentListByClass } from "../axios/admin/AdminServers";
import { classByTeacher } from "../axios/teacher.js/teacherServers";

const ViewAttendance = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const datepickerRef = useRef(null);
  const dispatch = useDispatch();
  const student_list = useSelector((state) => state.student.student_list);
  const presentCount = Object.values(attendance).filter(isPresent => isPresent).length;
  const absentCount = students.length - presentCount;

  useEffect(() => {
    const fetchClassroom = async () => {
      const response = await dispatch(classByTeacher());
      if (response.payload) {
        setClassrooms(response.payload.data); // Ensure data structure is correct
      }
    };
    fetchClassroom();
  }, [dispatch]);

  useEffect(() => {
    flatpickr(datepickerRef.current, {
      mode: "single",
      dateFormat: "Y-m-d",
      maxDate: "today",
      onChange: (selectedDates, dateStr) => {
        setSelectedDate(dateStr);
      },
    });
  }, []);

  const isPastDate = (dateStr) => {
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const handleFetchStudents = async () => {
    if (!selectedClassroom || !selectedDate) {
      toast.error("Please select a classroom and a date");
      return;
    }

    dispatch(studentListByClass({
      class_no: selectedClassroom.classroom.class_no,
      section: selectedClassroom.classroom.section,
    }));

    axiosAttendanceInstance
      .get(`view_attendance/${selectedClassroom.classroom.id}/${selectedDate}/`)
      .then((response) => {
        if (response.data.length === 0) {
          toast.warning("No Data found");
        }
        setStudents(response.data);
        const initialAttendance = response.data.reduce((acc, record) => {
          acc[record.student] = record.present;
          return acc;
        }, {});
        setAttendance(initialAttendance);
      })
      .catch((error) => console.error("Error fetching students:", error));
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    const classroom = classrooms?.find((c) => c.classroom.id === parseInt(classId));
    setSelectedClassroom(classroom);
    console.log(classroom.classroom);
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPastDate(selectedDate)) {
      toast.error("Cannot update attendance for past dates");
      return;
    }

    const attendanceData = students.map((student) => ({
      student: student.student,
      date: selectedDate,
      present: attendance[student.student],
    }));

    axiosAttendanceInstance
      .put(`view_attendance/${selectedClassroom.id}/${selectedDate}/`, attendanceData)
      .then(() => {
        toast.success("Attendance updated successfully");
        setStudents([]);
      })
      .catch((error) => {
        console.error("Error updating attendance:", error);
        toast.error("Error updating attendance");
      });
  };

  const getStudentDetails = (studentId) => {
    const student = student_list?.find((s) => s.id === studentId);
    return student || { roll_no: "N/A", username: "N/A" };
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl text-gray-900 pb-4 font-bold">View Attendance</h1>
      <Toaster position="top-center" richColors />

      {students.length === 0 ? (
        <>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Classroom:
              </label>
              <select
                onChange={handleClassChange}
                value={selectedClassroom ? selectedClassroom.classroom.id : ""}
                className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required
              >
                <option value="">Select a classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.classroom.id} value={classroom.classroom.id}>
                    {classroom.classroom.class_no} {classroom.classroom.section}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date:
              </label>
              <input
                ref={datepickerRef}
                type="text"
                value={selectedDate}
                className="form-datepicker block w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Select date"
                readOnly
              />
            </div>
          </div>
          <button
            onClick={handleFetchStudents}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-5"
          >
            Fetch Attendance
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex justify-between items-center mb-4 font-bold">
              <div>
                Class: {selectedClassroom.class_no} {selectedClassroom.section}
              </div>
              <div>Date: {selectedDate}</div>
            </div>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="flex justify-between items-center mb-4 font-bold">
                <div>
                  <span className="font-medium">Total Students: </span>
                  <span>{students.length}</span>
                </div>
                <div>
                  <span className="font-medium">Present: </span>
                  <span>{presentCount}</span>
                </div>
                <div>
                  <span className="font-medium">Absent: </span>
                  <span>{absentCount}</span>
                </div>
              </div>
            </div>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Roll Number
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Name
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, key) => {
                    const studentDetails = getStudentDetails(student.student);
                    return (
                      <tr key={key}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {studentDetails.roll_no}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {studentDetails.username}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <input
                            type="checkbox"
                            checked={attendance[student.student] || false}
                            onChange={(e) =>
                              setAttendance({
                                ...attendance,
                                [student.student]: e.target.checked,
                              })
                            }
                            className="form-checkbox h-4 w-4 text-blue-600 mx-8"
                            disabled={isPastDate(selectedDate)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {!isPastDate(selectedDate) && (
            <button

              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
            >
              Update Attendance
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default ViewAttendance;