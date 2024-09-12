import { createSlice } from "@reduxjs/toolkit";
import { teacherList } from "../axios/admin/AdminServers";

const initialState = {
    teachers_list : null,
    error: null,
    status: null
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(teacherList.fulfilled, (state, action) => {
                state.teachers_list = action.payload;
                state.status = 'successful';
            })
            .addCase(teacherList.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            });
    }
});

export default teacherSlice.reducer;
