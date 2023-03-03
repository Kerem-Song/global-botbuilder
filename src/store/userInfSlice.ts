import { IBotModel } from '@models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserInfo {
  loginUserName?: string;
  loginId?: string;
  companyName?: string;
  starffType?: number;
  role?: number;
}

const initialState: IUserInfo = {
  loginUserName: '아무나',
  loginId: 'unkown@lunasoft.co.kr',
};

export const UserInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<IUserInfo>) => {
      const { loginUserName, loginId, role, companyName, starffType } = action.payload;
      state.loginUserName = loginUserName;
      state.loginId = loginId;
      state.companyName = companyName;
      state.starffType = starffType;
      state.role = role;
    },
  },
});

export const { setUserInfo } = UserInfoSlice.actions;
export default UserInfoSlice.reducer;
