import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Header from "../components/Header/Index";
import Sidebar from '../components/admin/Sidebar/Index'

function AdminLayout({ children }) {
  
  const { is_authenticated, is_admin, is_student, is_teacher } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log("is_autheenticated", is_authenticated);

  return (
    <>
    {is_authenticated && is_teacher && <Navigate to="/teacher-dashboard" />}
    {is_authenticated && is_student && <Navigate to="/student-dashboard" />}
      {(is_authenticated & is_admin) ? (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <Outlet />
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
      ) : (
        <LoginPage /> 
      )}
    </>
  );
}

export default AdminLayout;
