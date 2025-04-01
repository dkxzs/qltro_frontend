import axios from "../utils/axiosCustomize";

export const getAllRoomTypeService = async () => {
  const res = await axios.get("/room-type/get-all-room-type");
  return res.data;
};

export const createRoomTypeService = async (data) => {
  const res = await axios.post("/room-type/create-room-type", data);
  return res.data;
};

export const updateRoomTypeService = async (id, data) => {
  const res = await axios.put(`/room-type/update-room-type/${id}`, data);
  return res.data;
};

export const deleteRoomTypeService = async (id) => {
  const res = await axios.delete(`/room-type/delete-room-type/${id}`);
  return res.data;
};
