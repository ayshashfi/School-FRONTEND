// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import {
//   blockUser,
//   studentList,
//   unblockUser,
//   updateStudent,
// } from "../../axios/admin/AdminServers";
// import { axiosInstance } from "../../axios/AxiosInstance";
// import { Toaster, toast } from "sonner";
// import { loginUser } from "../../axios/apiServers";

// function StudentListView() {
//   const dispatch = useDispatch();
//   const { student_list, status, error } = useSelector((store) => store.student);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     password2: "",
//     phone_number: "",
//     parent_contact: "",
//     date_of_birth: "",
//     profile_picture: "",
//     admission_date: "",
//     class_room: "",
//     roll_no: "",
//   });

//   const handleEditUser = (student) => {
//     setEditingUser(student);
//     setFormData({
//       first_name: student.first_name,
//       last_name: student.last_name,
//       email: student.email,
//       username: student.username,
//       phone_number: student.phone_number,
//       parent_contact: student.parent_contact,
//       date_of_birth: student.date_of_birth,
//       profile_picture: student.profile_picture,
//       admission_date: student.admission_date,
//       class_room: student.class_room,
//       roll_no: student.roll_no,
//     });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       profile_picture: e.target.files[0],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log(editingUser.id, editingUser.id, "hello");

//     // Assuming formData contains form fields
//     const formDataToSend = new FormData();
//     formDataToSend.append("admission_date", formData.admission_date);
//     formDataToSend.append("roll_no", formData.roll_no);
//     formDataToSend.append("class_room", formData.class_room);
//     formDataToSend.append("phone_number", formData.phone_number);

//     // const studentData = new FormData();
//     // studentData.append('first_name', formData.first_name);
//     // studentData.append('last_name', formData.last_name);
//     // studentData.append('email', formData.email);
//     // studentData.append('username', formData.username); // Ensure this matches your backend model
//     // studentData.append('password', formData.password);
//     // studentData.append('profile_picture', formData.profile_picture);

//     // formDataToSend.append('user', studentData);

//     const studentData = {
//       phone_number: formData.phone_number,
//       admission_date: formData.admission_date,
//       roll_no: formData.roll_no,
//       class_room: formData.class_room,
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       email: formData.email,
//       username: formData.first_name + " " + formData.last_name,
//     };
//     try {
//       const response = await dispatch(
//         updateStudent({ id: editingUser.id, studentData: studentData })
//       ).unwrap();
//       console.log(response);
//       setEditingUser(null);
//       if (response.error) {
//         console.log(response, "error showing");
//         toast.error(response.error);
//       } else {
//         dispatch(studentList());
//         console.log("success");
//         toast.success("Student updated Successfully");
//       }
//     } catch (error) {
//       console.log(error, "errer");
//       toast.error("Something went wrong");
//     }
//   };

//   const handleBlockUser = async (student) => {
//     try {
//       const response = await dispatch(blockUser({ id: student.id }));
//       dispatch(studentList());
//       toast.success(`User ${student.username} has been blocked successfully!`);
//       console.log(response);
//     } catch (error) {
//       toast.error(
//         `Failed to block user ${student.username}. Please try again.`
//       );
//       console.log(error);
//     }
//   };

//   const handleUnblockUser = async (student) => {
//     try {
//       const response = await dispatch(unblockUser({ id: student.id }));
//       dispatch(studentList());
//       toast.success(
//         `User ${student.username} has been unblocked successfully!`
//       );
//       console.log(response);
//     } catch (error) {
//       toast.error(
//         `Failed to unblock user ${student.username}. Please try again.`
//       );
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     dispatch(studentList());
//   }, [dispatch]);

//   const [classRooms, setClassRooms] = useState([]);

//   useEffect(() => {
//     axiosInstance
//       .get("classroom/")
//       .then((response) => setClassRooms(response.data))
//       .catch((error) => console.error("Error fetching classrooms:", error));
//   }, []);

//   return (
//     <>
//       <h1 className="text-3xl text-gray-900 mx-3 pb-4 font-bold">
//         Student Management
//       </h1>
//       <Toaster position="top-center" richColors />
//       {!editingUser ? (
//         <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//           <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900">
//             <div className="relative">
//               <input
//                 type="text"
//                 className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 placeholder="Search for users"
//               />
//             </div>
//             <div>
//               <Link
//                 to="/add-student"
//                 className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
//               >
//                 Add Student
//               </Link>
//             </div>
//           </div>
//           <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//               <tr>
//                 <th scope="col" className="px-6 py-3">
//                   ID
//                 </th>
//                 <th scope="col" className="px-6 py-3">
//                   Name
//                 </th>
//                 <th scope="col" className="px-6 py-3">
//                   Admission Date
//                 </th>
//                 <th scope="col" className="px-6 py-3">
//                   Parent Number
//                 </th>
//                 <th scope="col" className="px-6 py-3">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {status === "loading" && (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-4 text-center">
//                     Loading...
//                   </td>
//                 </tr>
//               )}
//               {status === "failed" && (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="px-6 py-4 text-center text-red-500"
//                   >
//                     {error}
//                   </td>
//                 </tr>
//               )}
//               {status === "successful" &&
//                 student_list &&
//                 student_list.length > 0 &&
//                 student_list.map((student) => (
//                   <tr
//                     key={student.id}
//                     className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
//                   >
//                     <td className="px-6 py-4">{student.roll_no}</td>
//                     <th
//                       scope="row"
//                       className="flex items-center px-6 py-4 text-gray-900 dark:text-white"
//                     >
//                       <div className="flex items-center mb-2">
//                         <div
//                           className={`h-2.5 w-2.5 rounded-full ${
//                             student.is_active ? "bg-green-500" : "bg-red-500"
//                           } mr-3`}
//                         ></div>
//                         <div className="flex flex-col">
//                           <div className="text-base font-semibold">
//                             {student.username}
//                           </div>
//                           <div className="font-normal text-gray-500">
//                             {student.email}
//                           </div>
//                         </div>
//                       </div>
//                     </th>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         {student.admission_date}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       {student.is_active ? (
//                         <button
//                           onClick={() => handleBlockUser(student)}
//                           className="text-green-700 hover:text-white border border-green-700  focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white "
//                         >
//                           Block
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleUnblockUser(student)}
//                           className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
//                         >
//                           Unblock
//                         </button>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => handleEditUser(student)}
//                         className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-400 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               {status === "successful" &&
//                 student_list &&
//                 student_list.length === 0 && (
//                   <tr>
//                     <td colSpan="5" className="px-6 py-4 text-center">
//                       No students found
//                     </td>
//                   </tr>
//                 )}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <>
//           <form className="m-5" onSubmit={handleSubmit}>
//             <div className="p-5 border">
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label
//                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="first_name"
//                   >
//                     First Name
//                   </label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     id="first_name"
//                     name="first_name"
//                     type="text"
//                     value={formData.first_name}
//                     onChange={handleChange}
//                     placeholder="Jane"
//                     required
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3">
//                   <label
//                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="last_name"
//                   >
//                     Last Name
//                   </label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//                     id="last_name"
//                     name="last_name"
//                     type="text"
//                     value={formData.last_name}
//                     onChange={handleChange}
//                     placeholder="Doe"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full px-3">
//                   <label
//                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="email"
//                   >
//                     Email
//                   </label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="example@example.com"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 {/* <div className="w-full px-3">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">Password</label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     id="password"
//                     name="password"
//                     type="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="******************"
//                   />
//                 </div> */}
//                 {/* <div className="w-full px-3">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password2">Confirm Password</label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     id="password2"
//                     name="password2"
//                     type="password"
//                     value={formData.password2}
//                     onChange={handleChange}
//                     placeholder="******************"
//                   />
//                 </div> */}
//               </div>
//               {/* <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full px-3">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="profile_picture">Profile Picture</label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
//                     id="profile_picture"
//                     name="profile_picture"
//                     type="file"
//                     onChange={handleFileChange}
//                   />
//                 </div>
//               </div> */}
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//                     id="phone_number"
//                     name="phone_number"
//                     type="number"
//                     value={formData.phone_number}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                   <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
//                     Parent Contact
//                   </label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//                     id="parent_contact"
//                     name="parent_contact"
//                     type="number"
//                     value={formData.parent_contact}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full px-3">
//                   <label
//                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="date_of_birth"
//                   >
//                     Date of Birth
//                   </label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//                     id="date_of_birth"
//                     name="date_of_birth"
//                     type="date"
//                     value={formData.date_of_birth}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full px-3">
//                   <label
//                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="admission_date"
//                   >
//                     Admission Date
//                   </label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//                     id="admission_date"
//                     name="admission_date"
//                     type="date"
//                     value={formData.admission_date}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full px-3">
//                   <label
//                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="class_room"
//                   >
//                     Classroom
//                   </label>
//                   <select
//                     className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
//                     id="class_room"
//                     name="class_room"
//                     value={formData.class_room}
//                     onChange={handleChange}
//                   >
//                     <option value={formData.class_room}></option>
//                     {classRooms.map((classRoom) => (
//                       <option key={classRoom.id} value={classRoom.id}>
//                         {classRoom.class_no} {classRoom.section}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full px-3">
//                   <label
//                     className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
//                     htmlFor="roll_no"
//                   >
//                     Roll Number
//                   </label>
//                   <input
//                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//                     id="roll_no"
//                     name="roll_no"
//                     type="number"
//                     value={formData.roll_no}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap -mx-3 mb-6">
//                 <div className="w-full px-3">
//                   <button
//                     type="submit"
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </>
//       )}
//     </>
//   );
// }

// export default StudentListView;
