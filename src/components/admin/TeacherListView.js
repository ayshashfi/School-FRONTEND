import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Multiselect from "multiselect-react-dropdown";
import { MultiSelect } from "primereact/multiselect";

import { blockUser, teacherList, unblockUser, updateTeacher } from "../../axios/admin/AdminServers";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { axiosInstance } from "../../axios/AxiosInstance";

function TeacherListView() {
  const dispatch = useDispatch();
  const { teachers_list, status, error } = useSelector(
    (store) => store.teacher
  );
  const [editingUser, setEditingUser] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const [subject, setSubject] = useState([])

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
    phone_number: "",
    joined_date: "",
    // subject: "",
  });

  const handleEditUser = (teacher) => {
    setEditingUser(teacher);
    // console.log(editingUser, teacher);
    setFormData({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      username: teacher.first_name + " " + teacher.last_name,
      phone_number: teacher.phone_number,
      joined_date: teacher.joined_date,
      // subject:teacher.subject,
    });
    setSubject(teacher.subject)
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (e) => {
    // setFormData({...formData, [e.target.name]: [...formData.subject, e.target.value]});
    setSubject(e.value)
    console.log(subject);
    console.log(e.target.value.id)
  };


  useEffect(() => {
    axiosInstance
      .get("subject/")
      .then((response) => setSubjects(response.data))
      .catch((error) => console.error("Error fetching Subjects:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(editingUser.id, editingUser.id);

    const formDataToSend = new FormData();
    formDataToSend.append("admission_date", formData.admission_date);
    formDataToSend.append("roll_no", formData.roll_no);
    formDataToSend.append("class_room", formData.class_room);
    formDataToSend.append("phone_number", formData.phone_number);

    const teacherData = {
      joined_date: formData.joined_date,
      // subject: formData.subject,
      phone_number: formData.phone_number,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      username: formData.first_name + " " + formData.last_name,
      subject: subject
    };
    try {
      console.log(teacherData, 'subjoie')
      const response = await dispatch(
        updateTeacher({ id: editingUser.id, teacherData: teacherData })
      ).unwrap();
      console.log(response);
      setEditingUser(null);
      if (response.error) {
        console.log(response, "error showing");
        toast.error(response.error);
      } else {
        // dispatch(teacherList());
        console.log("success");
        toast.success("Teahcer updated Successfully");
      }
    } catch (error) {
      // console.log(error, "errer");
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    dispatch(teacherList());
  }, [dispatch]);

  const handleBlockUser = async (teacher) => {
    try {
      const response = await dispatch(blockUser({ id: teacher.id }));
      dispatch(teacherList());
      toast.success(`User ${teacher.username} has been blocked successfully!`);
      console.log(response);
    } catch (error) {
      toast.error(
        `Failed to block user ${teacher.username}. Please try again.`
      );
      console.log(error);
    }
  };

  const handleUnblockUser = async (teacher) => {
    try {
      const response = await dispatch(unblockUser({ id: teacher.id }));
      dispatch(teacherList());
      toast.success(
        `User ${teacher.username} has been unblocked successfully!`
      );
      console.log(response);
    } catch (error) {
      toast.error(
        `Failed to unblock user ${teacher.username}. Please try again.`
      );
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="text-3xl text-gray-900 mx-3 pb-4 font-bold">Teachers</h1>
      <Toaster position="top-center" richColors />
      {!editingUser ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900">
            <div className="relative">
              <input
                type="text"
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search for teachers"
              />
            </div>
            <div>
              <Link
                to="/add-teacher"
                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Add Teacher
              </Link>
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
                <th scope="col" className="px-6 py-3">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              )}
              {status === "failed" && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              )}
              {/* {console.log(teachers_list)} */}
              {status === "successful" &&
                teachers_list &&
                teachers_list.length > 0 &&
                teachers_list.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <div className="p-3 flex items-center mt-3">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          teacher.is_active ? "bg-green-500" : "bg-red-500"
                        } mr-3`}
                      ></div>
                      <div className="flex flex-col">
                        <div className="text-base font-semibold">
                          {teacher.username}
                        </div>
                      </div>
                    </div>
                    <td className=" py-4">{teacher.phone_number}</td>
                    <td className=" py-4">{teacher.email}</td>
                    <td className=" py-4">{teacher.subject}</td>
                    <td className=" py-4">
                      {teacher.is_active ? (
                        <button
                          onClick={() => handleBlockUser(teacher)}
                          className="text-green-700 hover:text-white border border-green-700  focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white "
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblockUser(teacher)}
                          className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                        >
                          Unblock
                        </button>
                      )}
                    </td>

                    <td className="px-3 py-4">
                      <button
                        onClick={() => handleEditUser(teacher)}
                        className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-400 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              {status === "successful" &&
                teachers_list &&
                teachers_list.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      No teachers found
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      ) : (
        <form className="m-5" onSubmit={handleSubmit}>
          <div className="p-5 border">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="first_name"
                >
                  First Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="last_name"
                >
                  Last Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com"
                  required
                />
              </div>
            </div>


            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Phone Number
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  id="phone_number"
                  name="phone_number"
                  type="number"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>

              {/* Subject */}
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="subject"
                >
                  Subjectdf
                </label>

                {/* <MultiSelect
                  value={subject.id}
                  onSelect={(e) => {e}}
                  name='subject'
                  options={subjects}
                  optionLabel="subject"
                  display="chip"
                  placeholder="Select Subject"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                /> */}
                {/* <Multiselect
                options={subjects}
                selectedValues={formData.subject}
                onSelect={(event)=>{setSubject(event)}}
                onRemove={(event)=>{setSubject(event)}}
                displayValue="subject" 
                /> */}
                <select multiple className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="subject" name="subject" 
                  value={formData.subject}
                  onChange={handleChange}  
                  required
                >
                  <option value="">-------------</option>
                  {subjects &&
                    subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.subject}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="joined_date"
                >
                  Joined Date
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  id="joined_date"
                  name="joined_date"
                  type="date"
                  value={formData.joined_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Teacher
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default TeacherListView;
