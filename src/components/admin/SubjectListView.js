import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubject, subjectList } from '../../axios/admin/AdminServers';
import { Link } from 'react-router-dom';

function SubjectListView() {
  const dispatch = useDispatch();
  const { subject_list, status, error } = useSelector((store) => store.subject);
  // const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(subjectList());
  }, [dispatch]);

  

  return (
    <>
      <h1 className="text-3xl text-gray-900 mx-3 pb-4 font-bold">Subjects</h1>
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
                  <Link to={`/edit-subject/${subject.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">Edit</Link>
                  
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
    </>
  );

}

export default SubjectListView;
