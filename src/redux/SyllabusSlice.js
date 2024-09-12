// AuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, axiosResultInstance } from '../axios/AxiosInstance';


export const fetchSyllabus = createAsyncThunk(
    'syllabus/fetchSyllabus',
    async () => {
        try {
            const response = await axiosResultInstance.get(`/syllabus`);
            return response.data;
        } catch (error) {
            throw error
        }
    }
  );

const initialState = {    
    syllabus: null,
    error: null,
    status: 'loading',
};

const SyllabusSlice = createSlice({
  name: 'syllabus',
  initialState,
  reducers: {
    
  },
  extraReducers:(builder)=>{
    builder
    .addCase(fetchSyllabus.pending,(state)=>{
        state.status = 'loading'
    })
    .addCase(fetchSyllabus.fulfilled,(state,action)=>{
        state.status = 'succeeded'
        state.syllabus = action.payload
        state.error = ''
    })
    .addCase(fetchSyllabus.rejected,(state,action)=>{
        state.status = 'failed'
        state.error = action.error.message
    })

}
});


export default SyllabusSlice.reducer;
