import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addClassRoom, classRoomList, editClassRoom, teacherList } from '../../axios/admin/AdminServers';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function ClassRoomView() {
  const dispatch = useDispatch();
  const { classrooms, status, error } = useSelector((store) => store.classroom);
  const { teachers_list } = useSelector((store) => store.teacher);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [formData, setFormData] = useState({
    class_no: "",
    section: "",
    class_teacher: "",
  });

  useEffect(() => {
    dispatch(classRoomList());
    dispatch(teacherList());
  }, [dispatch]);

  const handleEditClassroom = (classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      class_no: classroom.class_no,
      section: classroom.section,
      class_teacher: classroom.class_teacher,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      class_no: formData.class_no,
      section: formData.section,
      class_teacher: formData.class_teacher,
    };

    try {
      const response = await dispatch(editClassRoom({ id: editingClassroom.id, classRoomData: formDataToSend }));
      
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Classroom updated successfully");
        setEditingClassroom(null);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error("Failed to update classroom. Please try again.");
    }
  };

  const getClassTeacherUsername = (teacherId) => {
    const teacher = teachers_list?.find(teacher => teacher.id === teacherId);
    return teacher ? teacher.username : 'Unknown';
  };

  return (
    <>
      <h1 className="text-3xl text-gray-900 mx-3 pb-4 font-bold">Classrooms</h1>
      <Toaster position="top-center" richColors />

      {!editingClassroom ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900">
            <div className="relative">
              <input
                type="text"
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search for classrooms"
              />
            </div>
            <div>
              <Link
                to='/add-classroom'
                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Add Classroom
              </Link>
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Class No</th>
                <th scope="col" className="px-6 py-3">Section</th>
                <th scope="col" className="px-6 py-3">Class Teacher</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
                </tr>
              )}
              {status === 'failed' && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-red-500">{error}</td>
                </tr>
              )}
              {status === 'successful' && classrooms && classrooms.length > 0 && classrooms.map((classroom) => (
                <tr key={classroom.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                
                  <td className="px-6 py-4">{classroom.class_no}</td>
                  <td className="px-6 py-4">{classroom.section}</td>
                  <td className="px-6 py-4">{getClassTeacherUsername(classroom.class_teacher)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditClassroom(classroom)}
                      className="text-gray-700 hover:bg-gray-100 border border-gray-700 focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {status === 'successful' && classrooms && classrooms.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">No classrooms found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <form className="m-5" onSubmit={handleSubmit}>
          <div className="p-5 border bg-white">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Class No
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  id="class_no"
                  name="class_no"
                  type="text"
                  value={formData.class_no}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Section
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  id="section"
                  name="section"
                  type="text"
                  value={formData.section}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Class Teacher
                </label>
                <select
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  id="class_teacher"
                  name="class_teacher"
                  value={formData.class_teacher}
                  onChange={handleChange}
                >
                  {teachers_list?.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.username}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}




export default ClassRoomView;