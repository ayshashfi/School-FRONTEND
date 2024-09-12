import { createSlice } from "@reduxjs/toolkit";
import { subjectList } from "../axios/admin/AdminServers";

const initialState = {
    subject_list: null,
    error: null,
    status: null
};

const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(subjectList.fulfilled, (state, action) => {
                state.subject_list = action.payload;
                state.status = 'successful';
            })
            .addCase(subjectList.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            });
    }
});

export default subjectSlice.reducer;
