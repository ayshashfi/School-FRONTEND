import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentDetails } from '../../redux/StudentDetailSlice';
import { syllabusByClass } from '../../axios/teacher.js/teacherServers';
import defaultProfile from "../../images/user/default_profile.png";
import { addChatRoom } from '../../axios/chat/ChatServers';
import { useNavigate } from 'react-router-dom';

function StudentTeacher() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [studentDetails, setStudentDetails] = useState(null);
  const [syllabus, setTeachers] = useState(null);
  const navigate = useNavigate();

const handleSendMessage = async (teacherId) => {
    console.log(`Send message to teacher with ID: ${teacherId}`);
    const ids = {
        "user_id1": user.id,
        "user_id2": teacherId,
    }
    try {
        const res = await addChatRoom(ids)
        console.log('res', res);
        navigate('/chat')
    } catch(error) {
        console.log(error, 'error');
        
    }
};

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await dispatch(fetchStudentDetails(user.id));
        setStudentDetails(details.payload);
      } catch (error) {
        console.log("Error fetching student details: ", error);
      }
    };
    fetchDetails();
  }, [dispatch, user.id]);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (studentDetails?.class_room?.id) {
        try {
          const response = await dispatch(syllabusByClass(studentDetails.class_room.id));
          setTeachers(response.payload);
        } catch (error) {
          console.log("Error fetching syllabus: ", error);
        }
      }
    };

    if (studentDetails) {
      fetchTeacher();
    }
  }, [studentDetails]);

  
  return(
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
    <h1 className="text-2xl font-bold mb-4">Teachers for Class {studentDetails?.class_room?.id}</h1>
    <div className="flex flex-wrap gap-4 m-5 justify-center">
  {syllabus ? (
    syllabus.map((syllabi, index) => (
      <div
        key={index}
        className="flex flex-col items-center mb-4 p-4 border rounded-lg shadow-sm bg-gray-50 w-full md:w-1/3"
      >
        <img
          className="w-20 h-20 rounded-full object-cover mb-2"
          src={syllabi.teacher.profile_picture || defaultProfile}
          alt="profile"
        />
        <div className="text-center">
          <div className="font-semibold text-lg">{syllabi.teacher.username}</div>
          <div className="text-gray-600">{syllabi.subject.subject}</div>
          <button
            onClick={() => handleSendMessage(syllabi.teacher.id)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send Message
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500">Loading...</p>
  )}
</div>

  </div>
);
}


export default StudentTeacher;