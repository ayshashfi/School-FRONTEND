import { createSlice } from '@reduxjs/toolkit';
import {  classRoomList } from '../axios/admin/AdminServers';

const classroomSlice = createSlice({
  name: 'classrooms',
  initialState: {
    classrooms: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(classRoomList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(classRoomList.fulfilled, (state, action) => {
        state.status = 'successful';
        state.classrooms = action.payload;
      })
      .addCase(classRoomList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default classroomSlice.reducer;