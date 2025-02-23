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
    attendanceList: loadAttendance(),
    previousStates: []  // 이전 상태를 저장할 배열
  },
  reducers: {
    addAttendance: (state, action) => {
      // 현재 상태를 이전 상태 배열에 저장
      state.previousStates.push([...state.attendanceList]);
      state.attendanceList.push(action.payload);
      localStorage.setItem('attendance', JSON.stringify(state.attendanceList));
    },
    updateAttendance: (state, action) => {
      const index = state.attendanceList.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        // 현재 상태를 이전 상태 배열에 저장
        state.previousStates.push([...state.attendanceList]);
        state.attendanceList[index] = {
          ...state.attendanceList[index],
          ...action.payload
        };
        localStorage.setItem('attendance', JSON.stringify(state.attendanceList));
      }
    },
    deleteAttendance: (state, action) => {
      // 현재 상태를 이전 상태 배열에 저장
      state.previousStates.push([...state.attendanceList]);
      state.attendanceList = state.attendanceList.filter(record => record.id !== action.payload);
      localStorage.setItem('attendance', JSON.stringify(state.attendanceList));
    },
    undoAction: (state) => {
      if (state.previousStates.length > 0) {
        // 마지막 이전 상태를 현재 상태로 복원
        state.attendanceList = state.previousStates.pop();
        localStorage.setItem('attendance', JSON.stringify(state.attendanceList));
      }
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

export const { addAttendance, updateAttendance, deleteAttendance, undoAction } = attendanceSlice.actions;
export default attendanceSlice.reducer; 