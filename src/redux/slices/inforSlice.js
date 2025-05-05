import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: {
    systemEmail: "",
    systemPassword: "",
    personalEmail: "",
  },
  personalInfo: {
    HoTen: "",
    CCCD: "",
    NgayCap: "",
    NoiCap: "",
    NgaySinh: "",
    DienThoai: "",
    DiaChi: "",
    TenNganHang: "",
    SoTaiKhoan: "",
  },
};

const inforSlice = createSlice({
  name: "infor",
  initialState,
  reducers: {
    setEmailConfig: (state, action) => {
      state.email = {
        ...state.email,
        ...action.payload,
      };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetEmailConfig: () => initialState,
    setPersonalInfo: (state, action) => {
      state.personalInfo = {
        ...state.personalInfo,
        ...action.payload,
      };
    },
  },
});

export const {
  setEmailConfig,
  setLoading,
  setError,
  resetEmailConfig,
  setPersonalInfo,
} = inforSlice.actions;

export default inforSlice.reducer;
