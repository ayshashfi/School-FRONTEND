import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, Toaster } from 'sonner'; // Assuming you have a toast notification component
import { fetchStudentDetails } from '../../redux/StudentDetailSlice';
import { updateStudentProfile } from '../../axios/student/StudentServers';
import defaultProfile from '../../images/user/default_profile.png';

function StudentProfile() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [studentDetails, setStudentDetails] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      setProfilePicture(file);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (profilePicture) {
      const formData = new FormData();
      formData.append('profile_picture', profilePicture);

      try {
        const response = await updateStudentProfile(user.id, formData);
        if (response.error) {
          console.log(response.error);
          toast.error("Failed to upload profile picture.");
        } else {
          toast.success("Profile picture uploaded successfully.");
          const updatedDetails = await dispatch(fetchStudentDetails(user.id));
          setStudentDetails(updatedDetails.payload);
        }
      } catch (error) {
        console.error("Error uploading profile picture: ", error);
        toast.error("Failed to upload profile picture. Please try again.");
      }
    } else {
      toast.error("Please select a profile picture to upload.");
    }
  };

  if (!studentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Toaster position="top-center" richColors />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 text-center">
          <div className="relative z-30 mx-auto mt-2 h-30 w-full max-w-30 bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img src={studentDetails.profile_picture ? studentDetails.profile_picture : defaultProfile} alt="profile" className="rounded w-full h-full object-cover" />
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
                    d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                    fill=""
                  />
                </svg>
                <input
                  type="file"
                  name="profile_picture"
                  id="profile"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
          </div>
          
          <div className="">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {studentDetails.first_name} {studentDetails.last_name}
            </h3>
            <h5 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              Class : {studentDetails.class_room.class_no} {studentDetails.class_room.section}
            </h5>
            {/* <p className="font-medium">{studentDetails.phone_number}</p> */}
            {/* <p className="font-medium">{studentDetails.email}</p> */}
          </div>
          
          <div className="m-3">
            {/* <h4 className="text-xl font-semibold">Student Details</h4> */}
            <p><strong>Roll No:</strong> {studentDetails.roll_no}</p>
            <p><strong>Admission Date:</strong> {studentDetails.admission_date}</p>
            {/* <p><strong>Classroom:</strong> {studentDetails.class_room}</p> */}
            {/* <p><strong>Parent Contact:</strong> {studentDetails.parent_contact}</p> */}
            {/* <p><strong>Username:</strong> {studentDetails.username}</p> */}
            {/* <p><strong>Address:</strong> {studentDetails.address}</p> */}
            {/* <p><strong>Date of Birth:</strong> {studentDetails.date_of_birth || "N/A"}</p> */}
          </div>
      <button
        className="m-4 bg-primary hover:bg-opacity-90 text-white font-semibold py-2 px-8 rounded-md"
        onClick={handleUploadProfilePicture}
      >
        Upload Profile Picture
      </button>
        </div>
      </div>

    </div>
  );
}

export default StudentProfile;
