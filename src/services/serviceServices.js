import axios from "../utils/axiosCustomize";

export const getAllServiceService = async () => {
  const res = await axios.get("/service/get-all-service");
  return res.data;
};

export const createServiceService = async (data) => {
  const res = await axios.post("/service/create-service", data);
  return res.data;
};

export const updateServiceService = async (id, data) => {
  const res = await axios.put(`/service/update-service/${id}`, data);
  return res.data;
};

export const deleteServiceService = async (id) => {
  const res = await axios.delete(`/service/delete-service/${id}`);
  return res.data;
};
