import { createAsyncThunk } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../axios/AxiosInstance';
import { deleteTeacherFile } from '../axios/teacher.js/teacherServers';

export const fetchTeacherFiles = createAsyncThunk(
  'files/fetchTeacherFiles',
   async (id) => {
  const response = await axiosInstance.get(`/teacher-files/${id}/`);
  return response.data;
});

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    teacherFiles: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherFiles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeacherFiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teacherFiles = action.payload;
      })
      .addCase(fetchTeacherFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteTeacherFile.fulfilled, (state, action) => {
        state.teacherFiles = state.teacherFiles.filter(
          (file) => file.id !== action.payload
        );
      });
  },
});

export default fileSlice.reducer;