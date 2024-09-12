import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/Header/Index';
import Sidebar from '../components/student/Sidebar/Index';
import { useSelector } from 'react-redux';
import LoginPage from '../pages/LoginPage';  // Ensure this is the correct import path

const StudentLayout = () => {
  const { is_authenticated, is_admin, is_student, is_teacher } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!is_authenticated) {
    return <Navigate to="/login" />;
  }

  if (is_authenticated && is_admin) {
    return <Navigate to="/admin-dashboard" />;
  }

  if (is_authenticated && is_teacher) {
    return <Navigate to="/teacher-dashboard" />;
  }

  if (is_authenticated && is_student) {
    return (
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* Content Area */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* Main Content */}
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return <LoginPage />;
};

export default StudentLayout;
