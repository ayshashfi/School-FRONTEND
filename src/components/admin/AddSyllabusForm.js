import React, { useState, useEffect } from "react";
import { axiosInstance, axiosResultInstance } from "../../axios/AxiosInstance";
import { toast, Toaster } from "sonner";

const AddSyllabusForm = ({ onSuccess }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("classroom/")
      .then((response) => setClassrooms(response.data))
      .catch((error) => console.error("Error fetching classrooms:", error));

    axiosInstance
      .get("subject/")
      .then((response) => setSubjects(response.data))
      .catch((error) => console.error("Error fetching subjects:", error));

    axiosInstance
      .get("teacher/")
      .then((response) => setTeachers(response.data))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const syllabusData = {
      classroom: selectedClassroom,
      subject: selectedSubject,
      teacher: selectedTeacher,
    };

    axiosResultInstance
      .post("syllabus/", syllabusData)
      .then(() => {
        toast.success("Syllabus added successfully");
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.non_field_errors
          ? error.response.data.non_field_errors[0]
          : "An error occurred while adding the syllabus";
        toast.error(errorMessage);
      });
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    const filtered = teachers.filter((teacher) =>
      teacher.subject.some((x) => x == subjectId)
    );
    setFilteredTeachers(filtered);
  };
  
  return (
    <>
      <div>
        <Toaster position="top-center" richColors />
        <div className="grid grid-cols-1">
          <div className="col-span-12 flex flex-col ">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Add Syllabus</h3>
              </div>
              <p className="p-4 pb-0">Select the class and subject to display the teacher list</p>
              <form onSubmit={handleSubmit}>
                <div className="p-5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">Classroom</label>
                      <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        value={selectedClassroom}
                        onChange={(e) => setSelectedClassroom(e.target.value)}
                      >
                        <option value="">Select a class</option>
                        {classrooms.map((classroom) => (
                          <option key={classroom.id} value={classroom.id}>
                            {classroom.class_no} {classroom.section}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">Subject</label>
                      <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {selectedSubject && (
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">Teacher</label>
                        <select
                          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          value={selectedTeacher}
                          onChange={(e) => setSelectedTeacher(e.target.value)}
                        >
                          <option value="">Select a teacher</option>
                          {filteredTeachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.username}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="flex m-4 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Add Syllabus
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSyllabusForm;
