// redux/slices/contractSlice.js
import { createSlice } from "@reduxjs/toolkit";
import contractTemplate from "../../utils/contract-template.json";

const initialState = {
  template: contractTemplate,
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {},
});

export default contractSlice.reducer;
