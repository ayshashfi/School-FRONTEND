import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosAttendanceInstance } from '../axios/AxiosInstance';

export const fetchStudentAttendance = createAsyncThunk(
  'attendance/fetchStudentAttendance',
  async ({ studentId, fromDate, toDate }) => {
    console.log(studentId, fromDate, toDate);
    
    const response = await axiosAttendanceInstance.get(`student_attendance/${studentId}/`, {
      params: { from_date: fromDate, to_date: toDate },
    });
    return response.data;
  }
);


// export const fetchStudentAttendance = createAsyncThunk(
//   'attendance/fetchStudentAttendance',
//   async (studentId, thunkAPI) => {
//     const response = await axiosAttendanceInstance.get(`student_attendance/${studentId}/`);
//     return response.data;
//   }
// );

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendance: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendance = action.payload;
      })
      .addCase(fetchStudentAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default attendanceSlice.reducer;