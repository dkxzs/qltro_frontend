import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: {
    isAdmin: false,
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
        isAdmin: action.payload?.DT?.LoaiTaiKhoan === "admin",
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
