import axios from "../utils/axiosCustomize";

export const getAllRoomService = async () => {
  const res = await axios.get(`/room/get-all-room`);
  return res.data;
};

export const getRoomByIdService = async (houseId) => {
  const res = await axios.get(`/room/get-rooms-by-house/${houseId}`);
  return res.data;
};

export const createRoomService = async (data) => {
  const dataRoom = new FormData();
  dataRoom.append("TenPhong", data.tenPhong);
  dataRoom.append("MaNha", parseInt(data.maNha));
  dataRoom.append("MaLP", parseInt(data.maLoaiPhong));
  dataRoom.append("DienTich", data.dienTich);
  dataRoom.append("MoTa", data.moTa);
  dataRoom.append("TrangThai", data.trangThai);
  dataRoom.append("Anh", data.anh);
  const res = await axios.post("/room/create-room", dataRoom);
  return res.data;
};

export const updateRoomService = async (id, data) => {
  const dataUpdate = new FormData();
  dataUpdate.append("TenPhong", data.tenPhong);
  dataUpdate.append("MaNha", parseInt(data.maNha));
  dataUpdate.append("MaLP", parseInt(data.maLoaiPhong));
  dataUpdate.append("DienTich", data.dienTich);
  dataUpdate.append("MoTa", data.moTa);
  dataUpdate.append("TrangThai", parseInt(data.trangThai));
  if (data.anh) dataUpdate.append("Anh", data.anh);
  const res = await axios.put(`/room/update-room/${id}`, dataUpdate);
  return res.data;
};

export const deleteRoomService = async (id) => {
  const res = await axios.delete(`/room/delete-room/${id}`);
  return res.data;
};
