// AuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';
import { loginUser } from '../axios/apiServers';
import { fetchTeacher } from '../axios/teacher.js/teacherServers';

const initialState = {    
    teacher: null,
    error: null,
    status: 'loading',
};

const TeacherDetailSlice = createSlice({
  name: 'teacherDetail',
  initialState,
  reducers: {
  },
  extraReducers:(builder)=>{
    builder
    .addCase(fetchTeacher.pending,(state)=>{
        state.status = 'loading'
    })
    .addCase(fetchTeacher.fulfilled,(state,action)=>{
        state.status = 'succeeded'
        state.teacher = action.payload
        state.error = ''
    })
    .addCase(fetchTeacher.rejected,(state,action)=>{
        state.status = 'failed'
        state.error = action.error.message
    })

}
});

// export const { logoutUser } = authSlice.actions;

export default TeacherDetailSlice.reducer;
