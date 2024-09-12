import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiInstance from "./axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../constants/urls";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
      try {
        const response = await fetch(`${API_BASE_URL}token/`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(userData),
        });
  
        if (!response.ok) {
          throw new Error("Login failed");
        }
  
        const data = await response.json();
        console.log(data)
        return data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  
export const refreshauthToken = async ()=>{
  const tokens = JSON.parse(localStorage.getItem('authTokens'));
  const refreshToken = tokens.refresh
  
  try{
      const response = await axios.post(`${API_BASE_URL}token/refresh/`,
          {refresh:refreshToken})
      if (response.status === 200 || response.status === 201){
          localStorage.setItem('authTokens', JSON.stringify(response.data))
          return response
      }
  }
  catch(error){
      console.log('Failed to refresh token',error)
  }
  return null
}

  export const passwordSet = async (data) => {
    try {
      const response = await apiInstance.post('password-set/', data);
      return response.data;
    } catch (error) {
      return {
        error: error.response ? error.response.data : 'Something went wrong'
      };
    }
  };
  