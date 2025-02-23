import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  membersList: []
};

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    addMember: (state, action) => {
      // 배열이 없으면 초기화
      if (!state.membersList) {
        state.membersList = [];
      }
      // 새 멤버 추가
      state.membersList.push({
        id: Date.now(),
        ...action.payload,
        registrationDate: new Date().toISOString()
      });
    }
  }
});

export const { addMember } = memberSlice.actions;

// 안전한 selector
export const selectMembers = (state) => {
  if (!state.members || !state.members.membersList) {
    return [];
  }
  return state.members.membersList;
};

export default memberSlice.reducer;