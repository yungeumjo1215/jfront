import { createSlice } from '@reduxjs/toolkit';

const loadMembers = () => {
  try {
    const savedMembers = localStorage.getItem('members');
    return savedMembers ? JSON.parse(savedMembers) : [];
  } catch (err) {
    console.error('Error loading members:', err);
    return [];
  }
};

const memberSlice = createSlice({
  name: 'members',
  initialState: {
    membersList: loadMembers()
  },
  reducers: {
    addMember: (state, action) => {
      state.membersList.push(action.payload);
      localStorage.setItem('members', JSON.stringify(state.membersList));
    },
    updateMember: (state, action) => {
      const index = state.membersList.findIndex(member => member.id === action.payload.id);
      if (index !== -1) {
        state.membersList[index] = {
          ...state.membersList[index],
          ...action.payload
        };
        localStorage.setItem('members', JSON.stringify(state.membersList));
      }
    },
    deleteMember: (state, action) => {
      state.membersList = state.membersList.filter(member => member.id !== action.payload);
      localStorage.setItem('members', JSON.stringify(state.membersList));
    }
  }
});

export const { addMember, updateMember, deleteMember } = memberSlice.actions;

// 안전한 selector
export const selectMembers = (state) => {
  if (!state.members || !state.members.membersList) {
    return [];
  }
  return state.members.membersList;
};

export default memberSlice.reducer;