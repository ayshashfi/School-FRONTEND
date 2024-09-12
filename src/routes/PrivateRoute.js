import React, { Children, useEffect } from "react";
// import { getlocal } from "../helpers/auth";
import { jwtDecode } from "jwt-decode";

// import AdminPanelPage from '../pages/AdminPanelPage'
import LoginPage from "../pages/LoginPage";
import { Route, Navigate, useNavigate } from "react-router-dom";


const PrivateRouter = ({ children, ...rest }) => {

  const token = localStorage.getItem('authTokens');
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      console.log("FRom here")
      navigate('/login')
    }
  }, [token, navigate])
  
  
  if (token) {
    const authToken = JSON.parse(localStorage.getItem('authTokens'))
    const decoded = jwtDecode(authToken.access)
    if (decoded.is_admin){
      console.log("heloo");
    return <div>
      <Navigate to='admin-dashboard' />
    </div>
    } else if (decoded.is_student) {
      return <div>
      <Navigate to='student-dashboard' />
      </div>
    } else if (decoded.is_teacher) {
      return <div>
      <Navigate to='teacher-dashboard' />
      </div>
    } else {
      console.log("aeoi")
    }
  } 
  else {
  console.log('gorm me');
    return <div>
      <LoginPage />
    </div>
  }
    
}

export default PrivateRouter;