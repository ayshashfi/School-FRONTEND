import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosAttendanceInstance, axiosFormInstance, axiosInstance, axiosResultInstance } from "../AxiosInstance";

export const fetchTeacher = createAsyncThunk('teacher/fetchTeacher', async (id) => {
    const response = await axiosInstance.get(`/teacher-update/${id}/`);
    return response.data;
});

export const updateTeacherProfile = async (id, teacherData) => {
      const response = await axiosFormInstance.patch(`teacher-update/${id}/`, teacherData);
      console.log(response);
      return response;
  };

export const take_attendance = async (attendanceData) => {
    try {
      const response = await axiosAttendanceInstance.post('take_attendance/', attendanceData);
      return response.data;
    } catch (error) {
      return {
        error: error.response ? error.response.data : 'Something went wrong'
      };
    }
  };


export const syllabusByClass = createAsyncThunk(
  'syllabus/fetchByClass',
  async (id, thunkAPI) => {
    try {
      const response = await axiosResultInstance.get(`syllabus_by_class/${id}/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



export const addSubject = createAsyncThunk('subject/add_subject', async (data) => {
  const response = await axiosInstance.post(`/subject/`, JSON.stringify(data));
  return response
})


export const classByTeacher = createAsyncThunk('teacher_classrooms/', async (data) => {
  const response = await axiosInstance.get(`/teacher-classrooms/`, JSON.stringify(data));
  return response
})

export const addResult = createAsyncThunk('result/add_result', async (data) => {
  const response = await axiosResultInstance.post(`/`, JSON.stringify(data));
return response.data
})

export const deleteTeacherFile = createAsyncThunk(
  "files/deleteTeacherFile",
  async (fileId) => {
    await axiosInstance.delete(`/teacher-files/delete/${fileId}/`);
    // After deletion, fetch the updated list of files
    return fileId;
  }
);