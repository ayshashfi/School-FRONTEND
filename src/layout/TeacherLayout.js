import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/Header/Index';
import Sidebar from '../components/teacher/Sidebar/Index';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacher } from '../axios/teacher.js/teacherServers';
import LoginPage from '../pages/LoginPage';

const TeacherLayout = () => {
  const dispatch = useDispatch();
  const { is_authenticated, is_admin, is_student, is_teacher } = useSelector((state) => state.auth);
  const { user } = useSelector((store) => store.auth);
  const { teacher } = useSelector((store) => store.teacherDetail);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchTeacher(user.id));
    } else {
      console.log('no user found');
    }
  }, [dispatch, user]);

  if (!is_authenticated) {
    return <Navigate to="/login" />;
  }

  if (is_authenticated && is_admin) {
    return <Navigate to="/admin-dashboard" />;
  }

  if (is_authenticated && is_student) {
    return <Navigate to="/student-dashboard" />;
  }

  if (is_authenticated && is_teacher) {
    return (
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        {/* Page Wrapper Start */}
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar Start */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* Sidebar End */}

          {/* Content Area Start */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Header Start */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* Header End */}

            {/* Main Content Start */}
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Outlet />
              </div>
            </main>
            {/* Main Content End */}
          </div>
          {/* Content Area End */}
        </div>
        {/* Page Wrapper End */}
      </div>
    );
  }

  return <LoginPage />;
};

export default TeacherLayout;
