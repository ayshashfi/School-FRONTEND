import React, { useEffect, useState } from "react";
import { axiosResultInstance } from "../../axios/AxiosInstance";
import { classByTeacher } from "../../axios/teacher.js/teacherServers";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";

function ViewResult() {
  const [results, setResults] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [examTypes, setExamTypes] = useState([]);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleClassChange = async (e) => {
    const classId = parseInt(e.target.value);
    const classroom = classrooms.find((c) => c.id === classId);
    setSelectedClassroom(classroom);

    // Fetch results for the selected class and subject (syllabus)
    try {
      setLoading(true);
      const response = await axiosResultInstance.get(`results/?syllabusId=${classroom.id}`);
      setResults(response.data);

      // Extract unique exam types from results
      const uniqueExamTypes = [...new Set(response.data.map(result => result.exam_type.name))];
      setExamTypes(uniqueExamTypes);

    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExamTypeChange = (e) => {
    setSelectedExamType(e.target.value);
  };

//   const filteredResults = ''
//     ? results.filter(result => result.exam_type.name === selectedExamType)
//     : results;
  const filteredResults = results.filter(result => result.exam_type.name == selectedExamType)

  useEffect(() => {
    const getClassrooms = async () => {
      try {
        const response = await dispatch(classByTeacher());
        if (!response.error) {
          setClassrooms(response.payload.data);
        }
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };
    getClassrooms();
  }, [dispatch]);

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="col-span-12 flex flex-col">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="text-3xl text-gray-900 font-bold">View Results</h3>
            </div>
            <div className="p-10">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">Class</label>
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="classroom"
                    name="classroom"
                    onChange={handleClassChange}
                    value={selectedClassroom ? selectedClassroom.id : ""}
                    required
                  >
                    <option value="">-------------</option>
                    {classrooms.map((classroom) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.classroom.class_no} {classroom.classroom.section} - {classroom.subject.subject}
                      </option>
                    ))}
                  </select>
                </div>

                {examTypes.length > 0 && (
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Exam Type</label>
                    <select
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="examType"
                      name="examType"
                      onChange={handleExamTypeChange}
                      value={selectedExamType || ""}
                      required
                    >
                      <option value="">-------------</option>
                      {examTypes.map((examType, index) => (
                        <option key={index} value={examType}>
                          {examType}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {selectedClassroom && (
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="text-xl text-gray-900 font-bold">
                      Results for {selectedClassroom.classroom.class_no} {selectedClassroom.classroom.section} - {selectedClassroom.subject.subject}
                    </h3>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <p>Loading results...</p>
                    ) : results.length > 0 ? (
                      <table className="w-full table-auto">
                        <thead>
                        {console.log(filteredResults)}
                          <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="py-2 px-4">Student</th>
                            <th className="py-2 px-4">Exam Date</th>
                            <th className="py-2 px-4">Assignment Mark</th>
                            <th className="py-2 px-4">Exam Mark</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredResults.map((result, index) => (
                            <tr key={index}>
                              <td className="border-b border-[#eee] py-2 px-4">{result.student.username}</td>
                              <td className="border-b border-[#eee] py-2 px-4">{result.exam_date}</td>
                              <td className="border-b border-[#eee] py-2 px-4">{result.assignment_mark}</td>
                              <td className="border-b border-[#eee] py-2 px-4">{result.exam_mark}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No results available for this exam type.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewResult;
