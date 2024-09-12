import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeacherDetails,
  subjectList,
} from "../../axios/admin/AdminServers"; 
import defaultProfile from "../../images/user/default_profile.png";
import { toast, Toaster } from "sonner";
import { deleteTeacherFile, updateTeacherProfile } from "../../axios/teacher.js/teacherServers";
import { fetchTeacherFiles } from "../../redux/fileSlice";
import { MdOutlineDelete } from "react-icons/md";

function TeacherDetails() {
  const { user } = useSelector((store) => store.auth);
  const { teacherFiles, status: fileStatus } = useSelector(
    (store) => store.files
  );
  const dispatch = useDispatch();
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const subjects = useSelector((state) => state.subject.subject_list);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        await dispatch(subjectList());
        const details = await dispatch(fetchTeacherDetails(user.id));
        setTeacherDetails(details.payload);
      } catch (error) {
        console.log("Error fetching teacher details: ", error);
      }
    };

    const fetchFiles = async (user) => {
      try {
        await dispatch(fetchTeacherFiles(user.id));
      } catch (error) {
        console.log("Error fetching teacher files: ", error);
      }
    };

    fetchDetails();
    fetchFiles(user);
  }, [dispatch, user.id]);

  const getSubjectDetails = (ids) => {
  
    const subjectsDetails = ids?.map((id) => {
      const subject = subjects?.find((s) => s.id === id);
      return subject ? subject.subject : "Unknown";
    });
  
    return subjectsDetails?.join(", "); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const handleDeleteFile = (id) => {
    dispatch(deleteTeacherFile(id))
    dispatch(fetchTeacherFiles())
  }

  const handleUploadProfilePicture = async () => {
    if (profilePicture) {
      const formData = new FormData();
      formData.append("profile_picture", profilePicture);

      try {
        const response = await updateTeacherProfile(user.id, formData);
        if (response.error) {
          console.log(response.error);
          toast.error("Failed to upload profile picture.");
        } else {
          toast.success("Profile picture uploaded successfully.");

          const updatedDetails = await dispatch(fetchTeacherDetails(user.id));
          setTeacherDetails(updatedDetails.payload);
        }
      } catch (error) {
        console.error("Error uploading profile picture: ", error);
        toast.error("Failed to upload profile picture. Please try again.");
      }
    } else {
      toast.error("Please select a profile picture to upload.");
    }
  };

  if (!teacherDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Toaster position="top-center" richColors />

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
            <label
              htmlFor="profile"
              className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
            >
              <svg
                className="fill-current"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.00004 5.83337C6.46776 5.83337 5.95659 6.04382 5.58152 6.41889C5.20645 6.79395 4.996 7.30513 4.996 7.83741C4.996 8.36969 5.20645 8.88086 5.58152 9.25593C5.95659 9.63099 6.46776 9.84145 7.00004 9.84145C7.53232 9.84145 8.04349 9.63099 8.41856 9.25593C8.79363 8.88086 9.00408 8.36969 9.00408 7.83741C9.00408 7.30513 8.79363 6.79395 8.41856 6.41889C8.04349 6.04382 7.53232 5.83337 7.00004 5.83337ZM5.74789 5.2521C6.19492 4.80508 6.78783 4.55574 7.40417 4.55574C8.02051 4.55574 8.61342 4.80508 9.06045 5.2521C9.50747 5.69913 9.75682 6.29204 9.75682 6.90838C9.75682 7.52473 9.50747 8.11763 9.06045 8.56466C8.61342 9.01169 8.02051 9.26104 7.40417 9.26104C6.78783 9.26104 6.19492 9.01169 5.74789 8.56466C5.30087 8.11763 5.05153 7.52473 5.05153 6.90838C5.05153 6.29204 5.30087 5.69913 5.74789 5.2521Z"
                  fill=""
                />
              </svg>
              <input
                id="profile"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="">
            <h3 className="text-black dark:text-white text-2xl font-medium">
              {teacherDetails.username}
            </h3>
            <p> {teacherDetails.email}</p>
            <span className="text-sm font-medium">{user.role}</span>
          </div>

          <h2><strong> {getSubjectDetails(teacherDetails.subject)}</strong></h2>
          
          <button
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            onClick={handleUploadProfilePicture}
          >
            Upload Profile Picture
          </button>
          {/* Display teacher's files */}

{fileStatus === "loading" && <p>Loading files...</p>}
{fileStatus === "succeeded" && teacherFiles.length>0 && (
  <ul>
  <h4 className="text-lg font-medium pt-3">Certificates</h4>
    {teacherFiles?.map((file) => (
      <li key={file.id} className="flex justify-center pt-2">
        <div className="flex items-center space-x-3.5">
          <a href={file.file} target="_blank" rel="noopener noreferrer">
            Preview
          </a>
          <button onClick={() => handleDeleteFile(file.id)}
            style={{ cursor: "pointer" }}
            className="hover:text-primary" ><MdOutlineDelete
          /></button>
        </div>
      </li>
    ))}
  </ul>
)}
{fileStatus === "failed" && <p>Failed to load files.</p>}

        </div>
      </div>
    </div>
  );
}

export default TeacherDetails;