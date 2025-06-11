import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: {
    access_token: "",
    LoaiTaiKhoan: "",
    ChucVu: "",
  },
  isLogin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.account = {
        access_token: action.payload?.DT?.accessToken,
        LoaiTaiKhoan: action.payload?.DT?.LoaiTaiKhoan,
        ChucVu: action.payload?.DT?.ChucVu,
      };
      state.isLogin = true;
    },
    updateAccessToken: (state, action) => {
      state.account.access_token = action.payload?.DT?.accessToken;
    },
    logout: (state) => {
      state.account = initialState.account;
      state.isLogin = false;
    },
  },
});

export const { login, logout, updateAccessToken } = userSlice.actions;

export default userSlice.reducer;
