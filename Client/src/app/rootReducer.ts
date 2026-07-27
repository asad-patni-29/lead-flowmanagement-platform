import { combineReducers } from '@reduxjs/toolkit';
import { SliceNames } from '@/constants/redux-constant';
import authReducer from '@/features/auth/authSlice';
import leadsReducer from '@/features/leads/leadsSlice';
import usersReducer from '@/features/users/usersSlice';

const rootReducer = combineReducers({
  [SliceNames.AUTH]: authReducer,
  [SliceNames.LEADS]: leadsReducer,
  [SliceNames.USERS]: usersReducer,
});

export default rootReducer;
