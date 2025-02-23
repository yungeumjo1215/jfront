import { createSlice } from '@reduxjs/toolkit';

// 로컬 스토리지에서 데이터 불러오기
const loadCompanies = () => {
  try {
    const savedCompanies = localStorage.getItem('companies');
    return savedCompanies ? JSON.parse(savedCompanies) : [];
  } catch (err) {
    console.error('Error loading companies:', err);
    return [];
  }
};

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    companies: loadCompanies()
  },
  reducers: {
    addCompany: (state, action) => {
      state.companies.push({
        ...action.payload,
        id: Date.now(),
        dailyLimit: 0,
        allowExceed: false
      });
      // 로컬 스토리지에 저장
      localStorage.setItem('companies', JSON.stringify(state.companies));
    },
    updateCompany: (state, action) => {
      const index = state.companies.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.companies[index] = {
          ...state.companies[index],
          ...action.payload
        };
        // 로컬 스토리지에 저장
        localStorage.setItem('companies', JSON.stringify(state.companies));
      }
    },
    deleteCompany: (state, action) => {
      state.companies = state.companies.filter(c => c.id !== action.payload);
      // 로컬 스토리지에 저장
      localStorage.setItem('companies', JSON.stringify(state.companies));
    }
  }
});

export const { addCompany, updateCompany, deleteCompany } = companySlice.actions;
export default companySlice.reducer;