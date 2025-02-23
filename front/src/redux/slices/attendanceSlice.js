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

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendanceList: []
  },
  reducers: {
    addAttendance: (state, action) => {
      state.attendanceList.push(action.payload);
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

export const { addAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer; 