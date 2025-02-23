import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchByCompany',
  async (companyId) => {
    const response = await api.attendance.getByCompany(companyId);
    return response.data;
  }
);

export const createAttendance = createAsyncThunk(
  'attendance/create',
  async (attendanceData) => {
    const response = await api.attendance.create(attendanceData);
    return response.data;
  }
);

// 로컬 스토리지에서 출석 데이터 불러오기
const loadAttendance = () => {
  try {
    const savedAttendance = localStorage.getItem('attendance');
    return savedAttendance ? JSON.parse(savedAttendance) : [];
  } catch (err) {
    console.error('Error loading attendance:', err);
    return [];
  }
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendanceList: loadAttendance()
  },
  reducers: {
    addAttendance: (state, action) => {
      state.attendanceList.push(action.payload);
      localStorage.setItem('attendance', JSON.stringify(state.attendanceList));
    },
    deleteAttendance: (state, action) => {
      state.attendanceList = state.attendanceList.filter(
        record => record.id !== action.payload
      );
      localStorage.setItem('attendance', JSON.stringify(state.attendanceList));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const companyId = action.meta.arg;
        state.attendanceList = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.attendanceList.push(action.payload);
      });
  }
});

export const { addAttendance, deleteAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer; 