import React, { useState, useEffect, useRef } from "react";
import { axiosAttendanceInstance, axiosInstance } from "../axios/AxiosInstance";
import { toast, Toaster } from "sonner";
import flatpickr from "flatpickr";
import { useDispatch, useSelector } from "react-redux";
import { studentListByClass } from "../axios/admin/AdminServers";

const ViewAttendance = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const datepickerRef = useRef(null);
  const dispatch = useDispatch();
  const student_list = useSelector((state) => state.student.student_list);
  const presentCount = Object.values(attendance).filter(
    (isPresent) => isPresent
  ).length;
  const absentCount = students.length - presentCount;

  useEffect(() => {
    axiosInstance
      .get("classroom/")
      .then((response) => setClassrooms(response.data))
      .catch((error) => console.error("Error fetching classrooms:", error));
  }, []);

  useEffect(() => {
    flatpickr(datepickerRef.current, {
      mode: "single",
      dateFormat: "Y-m-d",
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

    dispatch(
      studentListByClass({
        class_no: selectedClassroom.class_no,
        section: selectedClassroom.section,
      })
    );

    axiosAttendanceInstance
      .get(`view_attendance/${selectedClassroom.id}/${selectedDate}/`)
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
    const classroom = classrooms?.find((c) => c.id === parseInt(classId));
    setSelectedClassroom(classroom);
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
      .put(
        `view_attendance/${selectedClassroom.id}/${selectedDate}/`,
        attendanceData
      )
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
      {/* <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg> */}
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
                value={selectedClassroom ? selectedClassroom.id : ""}
                className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                required
              >
                <option value="">Select a classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.class_no} {classroom.section}
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
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5  dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                            checked={attendance[student.student]}
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
          {/* {console.log(isPastDate(selectedDate))} */}
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