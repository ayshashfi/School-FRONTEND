import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import flatpickr from "flatpickr";
import { useDispatch, useSelector } from "react-redux";
import {
  classRoomList,
  examTypeList,
  studentListByClass,
} from "../../axios/admin/AdminServers";
import {
  addResult,
  classByTeacher,
  syllabusByClass,
} from "../../axios/teacher.js/teacherServers";
import { fetchSyllabus } from "../../redux/SyllabusSlice";

function AddResult() {
  const datepickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [formData, setFormData] = useState({
    student: "",
    syllabus: "",
    assignment_mark: "",
    exam_mark: "",
    exam_type: "",
  });

  const [classrooms, setClassrooms] = useState([]);
  const { exam_type_list } = useSelector((state) => state.examType);
  const { student_list } = useSelector((state) => state.student);
  const [students, setStudents] = useState([]);
  const [syllabuss, setSyllabus] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleClassChange = async (e) => {
    const classId = parseInt(e.target.value);
    const classroom = classrooms.find((c) => c.classroom.id === classId);
    setSelectedClassroom(classroom);

    // Fetch syllabus by classroom
    const syllabusResponses = await dispatch(syllabusByClass(classId));
    if (syllabusResponses.payload.length) {
      setSyllabus(syllabusResponses.payload);
    } else {
      toast.warning("Subject not found for this class");
    }

    // Fetch students by classroom
    const studentResponses = await dispatch(
      studentListByClass({
        class_no: classroom.classroom.class_no,
        section: classroom.classroom.section,
      })
    );

    if (studentResponses.payload.length) {
      setStudents(studentResponses.payload);
    } else {
      toast.warning("Student not found", {
        duration: 7000,
      });
    }
  };

  useEffect(() => {
    const fetchClassroom = async () => {
      const response = await dispatch(classByTeacher());
      if (response.payload) {
        setClassrooms(response.payload.data);
      }
    };
    fetchClassroom();
  }, [dispatch]);

  useEffect(() => {
    dispatch(examTypeList());
    dispatch(fetchSyllabus());
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultData = {
      ...formData,
      exam_date: selectedDate,
      submitted_by: user.id,
    };

    try {
      const response = await dispatch(addResult(resultData));
      if (response.error) {
        toast.error(
          "Error saving the result. Result already added to the student for this subject"
        );
      } else {
        toast.success("Result added successfully");
        setSelectedClassroom(null);
        setStudents([]);
        setFormData({
          student: "",
          syllabus: "",
          assignment_mark: "",
          exam_mark: "",
        });
      }
    } catch (error) {
      console.error("Failed to add result:", error);
    }
  };

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="col-span-12 flex flex-col">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="text-3xl text-gray-900 font-bold">Add Result</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-10">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Class
                    </label>
                    <select
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="classroom"
                      name="classroom"
                      onChange={handleClassChange}
                      value={selectedClassroom ? selectedClassroom.classroom.id : ""}
                      required
                    >
                      <option value="">-------------</option>
                      {classrooms?.map((classroom) => (
                        <option key={classroom.id} value={classroom.classroom.id}>
                          {classroom.classroom.class_no} {classroom.classroom.section}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Exam Date:
                    </label>
                    <input
                      ref={datepickerRef}
                      type="text"
                      value={selectedDate}
                      className="form-datepicker block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      placeholder="Select date"
                      readOnly
                    />
                  </div>
                </div>
                {students.length > 0 && (
                  <div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Student List
                        </label>
                        <select
                          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="student"
                          name="student"
                          value={formData.student}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-------------</option>
                          {students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.username}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full xl:w-1/2">
<label className="mb-2.5 block text-black dark:text-white">
  Exam Type
</label>
<select
  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
  id="exam_type"
  name="exam_type"
  value={formData.exam_type}
  onChange={handleChange}
  required
>
  <option value="">-------------</option>
  {exam_type_list?.map((exam) => (
    <option key={exam.id} value={exam.id}>
      {exam.name}
    </option>
  ))}
</select>
</div>
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Subject
                        </label>
                        <select
                          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="syllabus"
                          name="syllabus"
                          value={formData.syllabus}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-------------</option>
                          {syllabuss.map((syllabus) => (
                            <option key={syllabus.id} value={syllabus.id}>
                              {syllabus.get_data}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Assignment Mark
                        </label>
                        <input
                          type="text"
                          placeholder="Enter assignment marks"
                          name="assignment_mark"
                          value={formData.assignment_mark}
                          onChange={handleChange}
                          required
                          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Exam Mark
                        </label>
                        <input
                          type="text"
                          placeholder="Enter exam marks"
                          name="exam_mark"
                          value={formData.exam_mark}
                          onChange={handleChange}
                          required
                          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                      </div>
                    </div>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-70 lg:px-5 xl:px-5"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddResult;