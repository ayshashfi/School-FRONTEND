import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubject, editSubject, subjectList } from '../../axios/admin/AdminServers';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

function SubjectView() {
  const dispatch = useDispatch();
  const { subject_list, status, error } = useSelector((store) => store.subject);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
  });

  const handleEditSubject = (subject) => {
    setEditingSubject(subject)
    setFormData({
      subject: subject.subject
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(editingSubject.subject, 'subject', editingSubject.id);
    
    const formDataToSend = new FormData();
    formDataToSend.append('subject', formData.subject);
  
    try {
      const response = await dispatch(editSubject({ id: editingSubject.id, subject: formDataToSend }));
      if (response.error) {
        console.log(response.payload.subject, 'from her'); 
        toast.error(response.payload.subject); 
      } else {
        toast.success("Subject updated successfully", response.payload)
        setEditingSubject(null)
      }
    } catch (error) {
      console.log('Error in handleSubmit:', error);

    }
  };
  
  useEffect(() => {
    dispatch(subjectList());
  }, [dispatch]);

  

  return (
    <>
      <h1 className="text-3xl text-gray-900 mx-3 pb-4 font-bold">Subjects</h1>
      <Toaster position="top-center" richColors />
      {!editingSubject ? (

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900">
          <div className="relative">
            <input
              type="text"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Search for subjects"
            />
          </div>
          <div>
            <Link
              to='/add-subject'
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Add Subject
            </Link>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Subject</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {status === 'loading' && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center">Loading...</td>
              </tr>
            )}
            {status === 'failed' && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-red-500">{error}</td>
              </tr>
            )}
            {status === 'successful' && subject_list && subject_list.length > 0 && subject_list.map((subject) => (
              <tr key={subject.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4">{subject.id}</td>
                <td className="px-6 py-4">{subject.subject}</td>
                <td className="px-6 py-4">
                  
                <button
                        onClick={() => handleEditSubject(subject)}
                        className="text-gray-700 hover:bg-gray-100 border border-gray-700 focus:ring-2 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2"
                      >
                        Edit
                      </button>
                  
                </td>
              </tr>
            ))}
            {status === 'successful' && subject_list && subject_list.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center">No subjects found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      ) : (
        <>
          <form className="m-5" onSubmit={handleSubmit}>
            <div className="p-5 border bg-white">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    Subject
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                  />
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

        </>
      )}
      
    </>
  );

}

export default SubjectView;
