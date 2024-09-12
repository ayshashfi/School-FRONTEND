// AuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../axios/AxiosInstance';


export const fetchStudentDetails = createAsyncThunk(
    'student/fetchStudentDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/student/${id}/`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
  );

const initialState = {    
    student: null,
    error: null,
    status: 'loading',
};

const StudentDetailSlice = createSlice({
  name: 'studentDetail',
  initialState,
  reducers: {
    
  },
  extraReducers:(builder)=>{
    builder
    .addCase(fetchStudentDetails.pending,(state)=>{
        state.status = 'loading'
    })
    .addCase(fetchStudentDetails.fulfilled,(state,action)=>{
        state.status = 'succeeded'
        state.student = action.payload
        state.error = ''
    })
    .addCase(fetchStudentDetails.rejected,(state,action)=>{
        state.status = 'failed'
        state.error = action.error.message
    })

}
});


export default StudentDetailSlice.reducer;