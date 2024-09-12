import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addClassRoom } from '../../axios/admin/AdminServers'; 
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AddClassRoom = () => {
  const [formData, setFormData] = useState({
    class_no: "",
    section: "",
    class_teacher: "",
  });
  
  const { teachers_list } = useSelector((store) => store.teacher); 
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(addClassRoom(formData)); 

      if (response.error) {
        console.log(response)
        if (response.error.non_field_errors) {
          toast.error(response.error.non_field_errors);
        } else {
          toast.error("Something went wrong");
        }
      } else {
        toast.success('Class added successfully');
        setFormData({
          class_no: "",
          section: "",
          class_teacher: "",
        });
        navigate('/class')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error("Failed to add class. Please try again.");
    }
  };

  return (
    <div>
      <Toaster position="top-center" richColors />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-12">
        <div className="col-span-12 sm:col-span-7 flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Add Classroom</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Class No</label>
                    <input
                      type="text"
                      placeholder="Enter class number"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      id="class_no"
                      name="class_no"
                      value={formData.class_no}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">Section</label>
                    <input
                      type="text"
                      placeholder="Enter section"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Class Teacher</label>
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="class_teacher"
                    name="class_teacher"
                    value={formData.class_teacher}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select class teacher</option>
                    {teachers_list?.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.username}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Add Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddClassRoom;
