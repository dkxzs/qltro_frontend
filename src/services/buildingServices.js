import axios from "../utils/axiosCustomize";

export const getAllBuildingService = async () => {
  const res = await axios.get("/house/get-all-house");
  return res.data;
};

export const createBuildingService = async (data) => {
  const res = await axios.post("/house/create-house", data);
  return res.data;
};

export const updateBuildingService = async (id, data) => {
  const res = await axios.put(`/house/update-house/${id}`, data);
  return res.data;
};

export const deleteBuildingService = async (id) => {
  const res = await axios.delete(`/house/delete-house/${id}`);
  return res.data;
};
