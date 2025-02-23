import { configureStore } from "@reduxjs/toolkit";
import companyReducer from './slices/companySlice';
import memberReducer from './slices/memberSlice';
import attendanceReducer from './slices/attendanceSlice';
import authReducer from './slices/authSlice';

// 로컬 스토리지에서 데이터 불러오기
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

// 로컬 스토리지에 데이터 저장
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const persistedState = loadState();

// 기본 초기 상태 정의
const defaultState = {
  companies: {
    companies: []
  },
  members: {
    membersList: []
  },
  attendance: {
    attendanceList: []
  },
  auth: {
    isLoggedIn: false,
    user: null
  }
};

const store = configureStore({
  reducer: {
    companies: companyReducer,
    members: memberReducer,
    attendance: attendanceReducer,
    auth: authReducer
  },
  preloadedState: persistedState || defaultState
});

// 상태 변경될 때마다 로컬 스토리지에 저장
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
