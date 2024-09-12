import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import { fetchStudentDetails } from "../../redux/StudentDetailSlice";
import defaultProfile from "../../images/user/default_profile.png";
import { Button } from "react-bootstrap";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { addChatRoom } from "../../axios/chat/ChatServers";
import { useNavigate } from "react-router-dom";

function StudentDetails({ student, onBack }) {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [studentDetails, setStudentDetails] = useState(null);
  const navigate = useNavigate();

  const handleSendMessage = async (studentId) => {
    console.log(`Send message to teacher with ID: ${studentId}`);
    const ids = {
      user_id1: user.id,
      user_id2: studentId,
    };
    try {
      const res = await addChatRoom(ids);
      console.log("res", res);
      navigate("/chat");
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await dispatch(fetchStudentDetails(student.id));
        setStudentDetails(details.payload);
      } catch (error) {
        console.log("Error fetching student details: ", error);
      }
    };
    fetchDetails();
  }, [dispatch, student.id]);

  if (!studentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4">
      <Toaster position="top-center" richColors />

      <Button
        className=" rounded-circle text-light text-3xl"
        variant=""
        onClick={onBack}
      >
        <FaArrowAltCircleLeft />
      </Button>

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 text-center">
          <div className="relative z-30 mx-auto mt-2 h-30 w-full max-w-30 bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img
                src={
                  studentDetails.profile_picture
                    ? studentDetails.profile_picture
                    : defaultProfile
                }
                alt="profile"
                className="rounded w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {studentDetails.first_name} {studentDetails.last_name}
            </h3>
            <h5 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              Class : {studentDetails.class_room.class_no}{" "}
              {studentDetails.class_room.section}
            </h5>
            {/* <p className="font-medium">{studentDetails.phone_number}</p> */}
            <p className="font-medium">{studentDetails.email}</p>
          </div>

          <div className="m-3">
            {/* <h4 className="text-xl font-semibold">Student Details</h4> */}
            <p>
              <strong>Roll No:</strong> {studentDetails.roll_no}
            </p>
            <p>
              <strong>Admission Date:</strong> {studentDetails.admission_date}
            </p>
            <p>
              <strong>Parent Contact:</strong> {studentDetails.parent_contact}
            </p>
            <p>
              <strong>Address:</strong> {studentDetails.address}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {studentDetails.date_of_birth || "N/A"}
            </p>
          </div>
          <button
            className="m-4 bg-primary hover:bg-opacity-90 text-white font-semibold py-2 px-8 rounded-md"
            onClick={() => {
              handleSendMessage(studentDetails.id);
            }}
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;