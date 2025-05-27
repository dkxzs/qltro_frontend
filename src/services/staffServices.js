import axios from "../utils/axiosCustomize";

const getAllStaffService = async () => {
  const response = await axios.get("/staff/get-all-staffs");
  return response.data;
};

const createStaffService = async (data) => {
  const response = await axios.post("/staff/create-staff", data);
  return response.data;
};

const updateStaffService = async (id, data) => {
  const response = await axios.put(`/staff/update-staff/${id}`, data);
  return response.data;
};

const deleteStaffService = async (id) => {
  const response = await axios.delete(`/staff/delete-staff/${id}`);
  return response.data;
};

const checkStaffHasAssignmentService = async (id) => {
  const response = await axios.get(`/staff/check-assignment/${id}`);
  return response.data;
};

export {
  getAllStaffService,
  createStaffService,
  updateStaffService,
  deleteStaffService,
  checkStaffHasAssignmentService,
};
