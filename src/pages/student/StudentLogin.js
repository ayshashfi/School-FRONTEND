import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginPage() {

  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { is_authenticated } = useSelector((state) => state.auth);
  
//   useEffect(() => {
//     const token = localStorage.getItem('authTokens');
//     if(token) {
//      navigate('/')
//     }
//  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(email, password);
  }

  return (
    <div
      className="min-h-screen py-20"
      style={{ backgroundImage: "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row w-10/12 lg:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
         
          <div className="w-full lg:w-1/2  py-16 px-12">
            <h2 className="text-3xl mb-4">Student Login </h2>
           
            <form onSubmit={handleSubmit}>
             
              <div className=" mt-5">
                <input
                  type="email"
                  name="email"
                  className="border border-gray-400 py-1 px-2 w-full"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className=" mt-5">
                <input
                  type="password"
                  name="password"
                  className="border border-gray-400 py-1 px-2 w-full"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            
              <div className="mt-5">
                <button type="submit" className="w-full bg-purple-500 py-3 text-center text-white">
                  Login
                </button>
              </div>
            </form>
          </div>
          <div
            className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: 'url("kids.avif")' }}
          >
            <h1 className="text-white text-3xl font-bold mb-3">Welcome</h1>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
