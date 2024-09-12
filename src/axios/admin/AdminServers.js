import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../axios";
import { axiosFormInstance, axiosInstance, axiosResultInstance } from "../AxiosInstance";
// import axios from 'axios';


export const studentList = createAsyncThunk('student/studentList', async (_, thunkAPI) => {
  try {
      const response = await axiosInstance.get('/students');
      return response.data;
  } catch (error) {
    console.log(error);
    
      if (error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
      } else {
          return thunkAPI.rejectWithValue(error.message);
      }
  }
});

export const studentListByClass = createAsyncThunk(
  'students/fetchByClass',
  async ({ class_no, section }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`students/${class_no}/${section}/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const studentRegister = async (studentData) => {
  try {
    const response = await axiosInstance.post('student-register/', studentData);
    return response.data;
  } catch (error) {
    return {
      error: error.response ? error.response.data : 'Something went wrong'
    };
  }
};

export const teacherRegister = async (teacherData) => {
  try {
    const response = await axiosInstance.post('teacher-register/', teacherData);
    return response.data;
  } catch (error) {
    return {
      error: error.response ? error.response.data : 'Something went wrong'
    };
  }
};
    
export const subjectList = createAsyncThunk('subject/subject_list', async () => {
  try {
    const response = await axiosInstance.get('/subject');
    return response.data;
} catch (error) {
  console.log(error);
}
})

export const addSubject = createAsyncThunk('subject/add_subject', async (data) => {
  const response = await axiosInstance.post(`/subject/`, JSON.stringify(data));
  return response
})

export const deleteSubject = createAsyncThunk('subject/delete', async (id) => {
  await axiosInstance.delete(`/subject/${id}/`);
  return id;
});

export const teacherList = createAsyncThunk('teacher/teacher_list', async () => {
  try {
    const response = await axiosInstance.get('/teacher');
    return response.data;
} catch (error) {
  console.log(error);
}
})

export const classRoomList = createAsyncThunk('classrooms/class_list', async () => {
  try {
    const response = await axiosInstance.get('/classroom');
    return response.data;
} catch (error) {
  console.log(error);
}
})

export const addClassRoom = createAsyncThunk('classrooms/add', async (classRoomData) => {
  const response = await axiosInstance.post('/classroom/', classRoomData);
  return response;
});

export const editClassRoom = createAsyncThunk('classrooms/edit', async ({ id, classRoomData }) => {
  const response = await axiosInstance.put(`/classroom/${id}/`, classRoomData);
  return response.data;
});

export const deleteClassRoom = createAsyncThunk('classrooms/delete', async (id) => {
  await axiosInstance.delete(`/classroom/${id}/`);
  return id;
});

export const fetchStudentDetails = createAsyncThunk(
  'student/fetchStudentDetails',
  async (id, { rejectWithValue }) => {
      try {
          const response = await axios.get(`/student/${id}/`);
          return response.data;
      } catch (error) {
          return rejectWithValue(error.response.data);
      }
  }
);


export const fetchTeacherDetails = createAsyncThunk(
  'student/fetchTeacherDetails',
  async (id, { rejectWithValue }) => {
      try {
          const response = await axiosInstance.get(`/teacher-update/${id}/`);
          return response.data;
      } catch (error) {
          return rejectWithValue(error.response.data);
      }
  }
);


export const updateStudent = createAsyncThunk(
  'student/updateStudent',
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      console.log('stue', studentData);
      const response = await axiosFormInstance.patch(`student/${id}/`, studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const editSubject = createAsyncThunk('subject/edit', async ({ id, subject }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(`/subject/${id}/`, subject);
    console.log(response);
    return response
  } catch (error){
    console.log(error);
      return rejectWithValue(error.response.data);
  }
});

export const updateTeacher = async ({ id, teacherData }) => {
  try {
    const response = await axiosInstance.patch(`teacher-update/${id}/`, teacherData);
    return response.data
  } catch (error) {
    console.log('asdkfye');
    return {
      error: error.response ? error.response.data : 'Somethfasdfing went wrong'
    }
  }
}

// export const updateTeacher = createAsyncThunk(
//   'teacher/updateTeacher',
//   async ({ id, teacherData }, { rejectWithValue }) => {
//     try {
//       console.log(teacherData.subject);
//       const response = await axiosFormInstance.patch(`teacher-update/${id}/`, teacherData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const uploadFiles = createAsyncThunk(
  'teacher/uploadFiles',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosFormInstance.post('upload_teacher_files/', formData);
      console.log(response);
      return response
    }
    catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const blockUser = createAsyncThunk(
  'user/block',
  async ({ id }, { rejectWithValue }) => {
    try{
      const response = await axiosInstance.post(`block-user/${id}/`);
      return response
    }
    catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const unblockUser = createAsyncThunk(
  'user/unblock',
  async ({ id }, { rejectWithValue }) => {
    try{
      const response = await axiosInstance.post(`unblock-user/${id}/`);
      return response
    }
    catch (error) {
      return rejectWithValue(error)
    }
  }
)

    
export const examTypeList = createAsyncThunk('exam_type/exam_type_list', async () => {
  try {
    const response = await axiosResultInstance.get('/exam_type');
    return response.data;
} catch (error) {
  console.log(error);
}
})

export const addExamType = createAsyncThunk('exam_type/add_exam_type', async (data) => {
  const response = await axiosResultInstance.post(`/exam_type/`, JSON.stringify(data));
  return response
})

export const deleteExamType = createAsyncThunk('exam_type/delete', async (id) => {
  await axiosResultInstance.delete(`/exam_type/${id}/`);
  return id;
});

export const deleteSyllabus = createAsyncThunk('syllabus/delete_syllabus', async (id) => {
  const response = await axiosResultInstance.delete(`/syllabus/${id}/`);
  return response
}
)

export const syllabusList = createAsyncThunk('syllabus', async (data) => {
  const response = await axiosResultInstance.get(`/syllabus/`, JSON.stringify(data));
  return response
})