import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: {
    LoaiTaiKhoan: "",
    accessToken: "",
  },
  isLoggedIn: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    login: (state, action) => {
      state.account = {
        LoaiTaiKhoan: action.payload?.DT?.LoaiTaiKhoan,
        accessToken: action.payload?.DT?.accessToken,
      };
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.account = initialState.account;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = accountSlice.actions;

export default accountSlice.reducer;
