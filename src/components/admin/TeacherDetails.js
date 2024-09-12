import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeacherDetails,
  subjectList,
} from "../../axios/admin/AdminServers";
import defaultProfile from "../../images/user/default_profile.png";
import { toast, Toaster } from "sonner";
import {
  deleteTeacherFile,
  updateTeacherProfile,
} from "../../axios/teacher.js/teacherServers";
import { fetchTeacherFiles } from "../../redux/fileSlice";
import { MdOutlineDelete } from "react-icons/md";
import { Button } from "react-bootstrap";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { addChatRoom } from "../../axios/chat/ChatServers";
import { useNavigate } from "react-router-dom";

function TeacherDetails({ teacher, onBack }) {
  const { user } = useSelector((store) => store.auth);
  const { teacherFiles, status: fileStatus } = useSelector(
    (store) => store.files
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const subjects = useSelector((state) => state.subject.subject_list);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        await dispatch(subjectList());
        const details = await dispatch(fetchTeacherDetails(teacher.id));
        setTeacherDetails(details.payload);
      } catch (error) {
        console.log("Error fetching teacher details: ", error);
      }
    };

    const fetchFiles = async (teacherDetails) => {
      try {
        await dispatch(fetchTeacherFiles(teacherDetails.id));
      } catch (error) {
        console.log("Error fetching teacher files: ", error);
      }
    };

    fetchDetails();
    fetchFiles(teacher);
  }, [dispatch, teacher.id]);

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

  const getSubjectDetails = (ids) => {
    const subjectsDetails = ids?.map((id) => {
      const subject = subjects?.find((s) => s.id === id);
      return subject ? subject.subject : "Unknown";
    });

    return subjectsDetails.join(", ");
  };

  const handleDeleteFile = (id) => {
    dispatch(deleteTeacherFile(id));
    dispatch(fetchTeacherFiles());
  };

  if (!teacherDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Toaster position="top-center" richColors />

      <Button
        className=" rounded-circle text-light text-3xl"
        variant=""
        onClick={onBack}
      >
        <FaArrowAltCircleLeft />
      </Button>
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 pb-6 text-center">
          <div className="relative z-30 mx-auto mt-2 h-30 w-30 max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:w-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2 rounded-full overflow-hidden w-full h-full">
              <img
                className="object-cover w-full h-full"
                src={
                  teacherDetails.profile_picture
                    ? teacherDetails.profile_picture
                    : defaultProfile
                }
                alt="profile"
              />
            </div>
          </div>
          <div className="">
            <h3 className="text-black dark:text-white text-2xl font-medium">
              {teacherDetails.username}
            </h3>

            <h2>
              <strong> {getSubjectDetails(teacherDetails.subject)}</strong>
            </h2>
            <p> {teacherDetails.email}</p>
            <span className="text-sm font-medium">{user.role}</span>
          </div>
          <p>Phone: {teacherDetails.phone_number}</p>
          <p>Joined date: {teacherDetails.joined_date}</p>

          {/* Display teacher's files */}

          {fileStatus === "loading" && <p>Loading files...</p>}
          {fileStatus === "succeeded" && teacherFiles.length > 0 && (
            <ul>
              <h4 className="text-lg font-medium pt-3">Certificates</h4>
              {teacherFiles?.map((file) => (
                <li key={file.id} className="flex justify-center pt-2">
                  <div className="flex items-center space-x-3.5">
                    <a
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Preview
                    </a>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      style={{ cursor: "pointer" }}
                      className="hover:text-primary"
                    >
                      <MdOutlineDelete />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {fileStatus === "failed" && <p>Failed to load files.</p>}
          <button
            className="m-4 bg-primary hover:bg-opacity-90 text-white font-semibold py-2 px-8 rounded-md"
            onClick={() => {
              handleSendMessage(teacherDetails.id);
            }}
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetails;