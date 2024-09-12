import React, { useEffect, useState } from 'react';
import { getResult } from '../../axios/student/StudentServers';
import { useSelector } from 'react-redux';
import Loader from '../../Loader/Loader';


function Result() {
  const { user } = useSelector(store => store.auth);
  const [resultsByExamType, setResultsByExamType] = useState({});
  const [selectedExamType, setSelectedExamType] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getResult(user.id);
        console.log(response);

        if (!response.error) {
          const groupedResults = response.reduce((acc, result) => {
            const examType = result.exam_type.name;
            if (!acc[examType]) {
              acc[examType] = [];
            }
            acc[examType].push(result);
            return acc;
          }, {});

          setResultsByExamType(groupedResults);
          if (Object.keys(groupedResults).length > 0) {
            setSelectedExamType(Object.keys(groupedResults)[0]);
          }
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchResults();
  }, [user.id]);

  if (loading) {
    return <Loader />; // Show loader while loading
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl text-gray-900 pb-4 font-bold">View Results</h1>
      <div className="flex space-x-4 mb-4">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exam Type:
          </label>
          <select
            onChange={(e) => setSelectedExamType(e.target.value)}
            value={selectedExamType}
            className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            {Object.keys(resultsByExamType).map((examType) => (
              <option key={examType} value={examType}>
                {examType}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedExamType && (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex justify-between items-center mb-4 font-bold">
            <div>Exam Type: {selectedExamType}</div>
          </div>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Subject
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Assignment Mark
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Exam Mark
                  </th>
                </tr>
              </thead>
              <tbody>
                {resultsByExamType[selectedExamType].map((result, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {result.syllabus.subject.subject}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {result.assignment_mark}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {result.exam_mark}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Result;
