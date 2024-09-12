import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { studentRegister } from "../../axios/admin/AdminServers";
import { axiosInstance } from "../../axios/AxiosInstance";
import AdminLayout from "../../layout/AdminLayout";
import { Toaster, toast } from "sonner";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const AddStudent = () => {
  let { state } = useLocation();
  const Swal = require('sweetalert2')
  const {classRoom} = state;
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    password2: "",
    phone_number: "",
    parent_contact: "",
    date_of_birth: "",
    address: "",
    profile_picture: null,
    roll_no: "",
    class_room: classRoom,
    admission_date: "",
  });

  const [classRooms, setClassRooms] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_picture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData.class_room);
      const response = await studentRegister({
        phone_number: formData.phone_number,
        admission_date: formData.admission_date,
        roll_no: formData.roll_no,
        class_room: formData.class_room,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.first_name + " " + formData.last_name,
      });
      if (response.error) {
        if (response.error.email) {
          toast.error(response.error.email);
        } else if (response.error.roll_no) {
          toast.error(response.error.roll_no);
        } else {
          toast.error("Something went wrong");
        }
      } else {
        Swal.fire({
          icon: "success",
          text: `Student registered successfully. Password Set link is sent to "${formData.email}".`,
        });
        navigate("/student-management");
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    console.log(formData);
    axiosInstance
      .get("classroom/")
      .then((response) => setClassRooms(response.data))
      .catch((error) => console.error("Error fetching classrooms:", error));
  }, []);

  return (
    <>
      <h1 className="text-3xl text-gray-900 mx-3 pb-4 font-bold">
        Add Student
      </h1>

      <Toaster position="top-center" richColors />
      <form className="m-5 bg-white" onSubmit={handleSubmit}>
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
                placeholder="Jane"
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
            {/* <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="first_name">
              UserName
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Jane"
            />
          </div> */}
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
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Parent Contact
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                id="parent_contact"
                name="parent_contact"
                type="number"
                value={formData.parent_contact}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="date_of_birth"
              >
                Date of Birth
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="admission_date"
              >
                Admission Date
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                id="admission_date"
                name="admission_date"
                type="date"
                value={formData.admission_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="class_room"
              >
                Classroom
              </label>
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="class_room"
                name="class_room"
                value={formData.class_room}
                onChange={handleChange}
              >
                {classRooms.map((classRoom) => (
                  <option key={classRoom.id} value={classRoom.id}>
                    {classRoom.class_no} {classRoom.section}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="roll_no"
              >
                Roll Number
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                id="roll_no"
                name="roll_no"
                type="number"
                value={formData.roll_no}
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
                Add Student
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddStudent;
