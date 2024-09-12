import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import { classRoomList, deleteSyllabus, subjectList, teacherList } from "../../axios/admin/AdminServers";
import { axiosResultInstance } from "../../axios/AxiosInstance";
import Modal from "../../components/Modal";
import { fetchSyllabus } from "../../redux/SyllabusSlice";


const SyllabusList = ({ classRoom }) => {
  const dispatch = useDispatch();
  const classrooms = useSelector((state) => state.classroom.classrooms);
  const subjects = useSelector((state) => state.subject.subject_list);
  const teachers = useSelector((state) => state.teacher.teachers_list);
  const syllabus_list = useSelector((state) => state.syllabus.syllabus);
  const [addSyllabus, setAddSyllabus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedClassroom, setSelectedClassroom] = useState(classRoom.id);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [syllabusToDelete, setSyllabusToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(classRoomList());
        await dispatch(subjectList());
        await dispatch(teacherList());
        await dispatch(fetchSyllabus());
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const getClassroomDetails = (id) => {
    const classroom = classrooms?.find((c) => c.id === id);
    return classroom ? `${classroom.class_no} ${classroom.section}` : "Unknown";
  };

  const handleAddSyllabusSuccess = () => {
    setAddSyllabus(false);
    dispatch(fetchSyllabus());
  };

  const confirmDelete = (id) => {
    setSyllabusToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    dispatch(deleteSyllabus(syllabusToDelete))
      .then(() => {
        toast.success("Syllabus deleted successfully.");
        dispatch(fetchSyllabus());
        setDeleteModalOpen(false);
        setSyllabusToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting syllabus:", error);
        toast.error("Error deleting syllabus: " + error.message);
      });
  };

  const filteredSyllabus = syllabus_list?.filter((item) => item.classroom.id === selectedClassroom);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <Toaster position="top-center" richColors />
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900">
        <h1 className="text-3xl text-gray-900 pb-4 font-bold">Syllabus List</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {classrooms?.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {getClassroomDetails(classroom.id)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setAddSyllabus(true)}
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Add Syllabus
          </button>
        </div>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Subject</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Teacher</th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSyllabus?.map((item) => (
                <tr key={item.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {item.subject.subject}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {item.teacher.username}
                  </td>
                  <td>
                    <button
                      onClick={() => confirmDelete(item.id)}
                      type="button"
                      className="text-red-700 border border-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:focus:ring-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={addSyllabus}
        onClose={() => setAddSyllabus(false)}
        header="Add Syllabus"
      >
        <AddSyllabusForm onSuccess={handleAddSyllabusSuccess} classRoom={selectedClassroom} />
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        header="Confirm Delete"
        onConfirm={handleDelete}
      >
        <p>Are you sure you want to delete this syllabus?</p>
      </Modal>
    </div>
  );
};


const AddSyllabusForm = ({ onSuccess, classRoom }) => {
  // const [classrooms, setClassrooms] = useState([]);
  // const [subjects, setSubjects] = useState([]);
  // const [teachers, setTeachers] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(classRoom);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const classrooms = useSelector((state) => state.classroom.classrooms);
  const subjects = useSelector((state) => state.subject.subject_list);
  const teachers = useSelector((state) => state.teacher.teachers_list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(classRoomList());
    dispatch(subjectList());
    dispatch(teacherList());
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
        const errorMessage =
          error.response?.data?.non_field_errors
            ? error.response.data.non_field_errors[0]
            : error.response?.data?.subject
            ? 'Subject: ' + error.response.data.subject[0]
            : error.response?.data?.teacher
            ? 'teacher: ' + error.response.data.teacher[0]
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
        <div className="">
              
              <p className="p-4 pb-0">Select the subject.</p>
              <form onSubmit={handleSubmit}>
                <div className="p-5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    {/* <div className="w-full xl:w-1/2">
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
                    </div> */}
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
                  {selectedSubject && (
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
                  )}
                  </div>
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
    </>
  );
};

export default SyllabusList;
