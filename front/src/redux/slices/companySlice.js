import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  companies: [
    { id: 1, name: "삼성전자", logo: "samsung.png" },
    { id: 2, name: "현대자동차", logo: "hyundai.png" }
  ],
  status: 'idle',
  error: null
};

export const createCompany = createAsyncThunk(
  'companies/create',
  async (companyData) => {
    // 로컬에서 처리
    return {
      id: Date.now(),  // 유니크한 ID 생성
      ...companyData
    };
  }
);

export const updateCompany = createAsyncThunk(
  'companies/update',
  async ({ id, data }) => {
    return {
      id,
      ...data
    };
  }
);

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = {
            ...state.companies[index],
            ...action.payload
          };
        }
      });
  }
});

export default companySlice.reducer;