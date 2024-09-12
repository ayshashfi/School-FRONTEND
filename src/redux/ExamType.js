import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { examTypeList } from "../axios/admin/AdminServers";


const initialState = {
    examtype_list: null,
    error: null,
    status: null
};

const examTypeSlice = createSlice({
    name: 'exam_type',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(examTypeList.fulfilled, (state, action) => {
                state.examtype_list = action.payload;
                state.status = 'successful';
            })
            .addCase(examTypeList.rejected, (state, action) => {
                state.error = action.error.message;
                state.status = 'failed';
            });
    }
});

export default examTypeSlice.reducer;
