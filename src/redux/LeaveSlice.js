import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosLeaveInstance from '../axios/AxiosInstance';

// Fetch leave applications including student details
export const fetchLeaveApplications = createAsyncThunk(
  'leave/fetchLeaveApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosLeaveInstance.get('/leave-applications/');
      return response.data; // Make sure this includes student details
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Something went wrong while fetching leaves');
    }
  }
);

// Create a leave application
export const createLeaveApplication = createAsyncThunk(
  'leave/createLeaveApplication',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await axiosLeaveInstance.post('/leave-applications/', leaveData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Something went wrong while creating a leave');
    }
  }
);

// Update leave application status
export const updateLeaveStatus = createAsyncThunk(
  'leave/updateLeaveStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosLeaveInstance.patch(`/leave-applications/${id}/update-status/`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Something went wrong while updating leave status');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    leaves: [],
    fetchStatus: 'idle',
    createStatus: 'idle',
    updateStatus: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch leave applications
      .addCase(fetchLeaveApplications.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;  // Clear error on new request
      })
      .addCase(fetchLeaveApplications.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.leaves = action.payload; // Expecting student details here
      })
      .addCase(fetchLeaveApplications.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Create a leave application
      .addCase(createLeaveApplication.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;  // Clear error on new request
      })
      .addCase(createLeaveApplication.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.leaves.push(action.payload);
      })
      .addCase(createLeaveApplication.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Update leave application status
      .addCase(updateLeaveStatus.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;  // Clear error on new request
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.leaves.findIndex((leave) => leave.id === action.payload.id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default leaveSlice.reducer;
