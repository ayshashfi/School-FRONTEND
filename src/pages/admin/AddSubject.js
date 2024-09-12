import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSubject } from "../../axios/admin/AdminServers";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

function AddSubject() {

    const [subject, setSubject] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await dispatch(addSubject({ subject }))
      if (response.error) {
        toast.error("Subject already exists")
      } else {
        toast.success("Subject Added Successfully");
        navigate('/subject')
      }
    }

  return (
    <div>
      <h1 className="text-3xl text-gray-900 mx-3 pb-4 font-bold">
        Add Subject
      </h1>
      <Toaster position="top-center" richColors />

      <form className="m-5" onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="first_name"
            >
              Subject
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="subject"
              name="subject"
              type="text"
              value= {subject}
              onChange= {(e) => {setSubject(e.target.value)}}
              placeholder="Subject name"
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
                Add Subject
              </button>
            </div>
          </div>
      </form>
    </div>
  );
}

export default AddSubject;
