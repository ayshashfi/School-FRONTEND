// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/AuthSlice";
import studentReducer from "../redux/StudenSlice";
import subjectReducer from "../redux/SubjectSlice";
import teacherReducer from "../redux/TeacherSlice";
import classroomReducer from "../redux/ClassSlice";
import syllabusReducer from "../redux/SyllabusSlice";
import storage from "redux-persist/lib/storage";
import teacherDetailReducer from "../redux/TeacherDetailSlice";
import studentDetailReducer from "../redux/StudentDetailSlice";
import attendanceReducer from "../redux/AttendanceSlice";
import filesReducer from "../redux/fileSlice";
import examTypeReducer from "../redux/ExamTypeSlice";
import chatReducer from "../redux/ChatSlice";
import LeaveSlice from "../redux/LeaveSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  // whitelist: ['auth'], // only persist the auth reducer
};

const rootReducer = {
  auth: persistReducer(persistConfig, authReducer),
  student: studentReducer,
  subject: subjectReducer,
  classroom: classroomReducer,
  teacher: teacherReducer,
  teacherDetail: teacherDetailReducer,
  studentDetail: studentDetailReducer,
  attendance: attendanceReducer,
  files: filesReducer,
  examType: examTypeReducer,
  syllabus: syllabusReducer,
  chat: chatReducer,
  leave: LeaveSlice,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;

const persistor = persistStore(store);

export { persistor };
