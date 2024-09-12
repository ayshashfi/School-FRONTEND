import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { subjectList, teacherRegister, uploadFiles } from "../../axios/admin/AdminServers";
import { axiosInstance } from "../../axios/AxiosInstance";
import { useDispatch } from "react-redux";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

function AddTeacher() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    subject: [], // Change from string to array
    joined_date: "",
  });

  const Swal = require('sweetalert2')
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, options } = e.target;

    if (type === 'select-multiple' && name === 'subject') {
      // Handle multiple select input
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData({
        ...formData,
        [name]: selectedOptions,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teacherResponse = await teacherRegister({
      joined_date: formData.joined_date,
      subject: formData.subject,
      phone_number: formData.phone_number,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      username: formData.first_name + " " + formData.last_name,
    });

    if (teacherResponse.error) {
      if (teacherResponse.error.email) {
        toast.error(teacherResponse.error.email);
      } else {
        toast.error("Something went wrong");
      }
    } else {
      setTeacherId(teacherResponse.id);
      
      Swal.fire({
        icon: "success",
        text: `Teacher registered successfully. Password reset link is sent to "${formData.email}".`,
      });
      navigate('/teacher-management')
      
      // file submit if present
      if (files.length > 0) {
        const fileFormData = new FormData();
        fileFormData.append("teacher_id", teacherResponse.id);
        for (let i = 0; i < files.length; i++) {
          fileFormData.append("files", files[i]);
        }
        try {
          const fileResponse = await dispatch(uploadFiles(fileFormData));
          toast.success("Files uploaded successfully!");
          setUploadedFiles(fileResponse.data);
        } catch (error) {
          toast.error("Failed to upload files.");
          console.error(error);
        }
      }
    }
  };

  useEffect(() => {
    axiosInstance
      .get("subject/")
      .then((response) => setSubjects(response.data))
      .catch((error) => console.error("Error fetching Subjects:", error));
  }, []);

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-12">
        <div className="col-span-12 sm:col-span-7 flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Teacher Registration Form</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">First name</label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Last name</label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Phone Number <span className="text-meta-1">*</span></label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Email <span className="text-meta-1">*</span></label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Subject</label>
                  <select
                    multiple
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    {/* <option value="">-------------</option> */}
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">Joined Date</label>
                  <input
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    id="joined_date"
                    name="joined_date"
                    type="date"
                    value={formData.joined_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="flex m-4 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Add Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-5 flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Uploaded Files</h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">Attach file</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>
              {/* Display uploaded files if any */}
              {/* <h2>Uploaded Files</h2>
              <ul>
                {uploadedFiles.map((file) => (
                  <li key={file.id}>
                    <a href={`http://localhost:8000${file.file}`} target="_blank" rel="noopener noreferrer">
                      {file.file.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTeacher;
