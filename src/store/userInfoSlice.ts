import { IBotModel } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserInfo {
  loginUserName?: string;
  loginId?: string;
  companyName?: string;
  staffType?: number;
  role?: number;
}

const initialState: IUserInfo = {
  staffType: 0,
  loginUserName: '아무나',
  loginId: 'unkown@lunasoft.co.kr',
};

export const UserInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<IUserInfo>) => {
      const { loginUserName, loginId, role, companyName, staffType } = action.payload;
      state.loginUserName = loginUserName;
      state.loginId = loginId;
      state.companyName = companyName;
      state.staffType = staffType;
      state.role = role;
    },
    updateRole: (state, action: PayloadAction<Pick<IUserInfo, 'role' | 'staffType'>>) => {
      const { role, staffType } = action.payload;
      state.staffType = staffType;
      state.role = role;
    },
  },
});

export const { setUserInfo, updateRole } = UserInfoSlice.actions;
export default UserInfoSlice.reducer;
