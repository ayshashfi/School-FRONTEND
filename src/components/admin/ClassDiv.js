import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../axios/AxiosInstance";
import { teacherList } from "../../axios/admin/AdminServers";

function ClassDiv() {
    const dispatch = useDispatch();
    const [classRooms, setClassRooms] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    // const teachers = useSelector((state) => state.teacher.teachers_list);
    // const teacherStatus = useSelector((state) => state.teacher.status);
  
    useEffect(() => {
      axiosInstance
        .get("classroom/")
        .then((response) => setClassRooms(response.data))
        .catch((error) => console.error("Error fetching classrooms:", error));
    }, []);
  
    // useEffect(() => {
    //   if (!teachers && teacherStatus !== 'loading') {
    //     dispatch(teacherList());
    //   }
    // }, [dispatch, teachers, teacherStatus]);
  
    const handleClassClick = (classItem) => {
      setSelectedClass(classItem);
    };
  
  return (
    <div className="flex flex-wrap gap-4 justify-center">
          {classRooms.map((classItem, index) => (
            <div
              key={index}
              className="max-w-xs p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex-1 sm:flex-none sm:w-1/3 cursor-pointer"
              onClick={() => handleClassClick(classItem)}
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {`Class ${classItem.class_no}`}
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {`Section ${classItem.section}`}
              </p>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {/* {`Class Teacher: ${teachers ? (teachers.find(teacher => teacher.id === classItem.class_teacher)?.username) : null }`} */}
              </p>
            </div>
          ))}
        </div>
  )
}

export default ClassDiv