import axios from "../utils/axiosCustomize";

// Lấy tất cả thành viên
const getAllMembersService = async () => {
  const res = await axios.get("/member/get-all-member");
  return res.data;
};

// Tạo nhiều thành viên cùng lúc
const createMembersService = async (membersData) => {
  const res = await axios.post("/member/create-member", membersData);
  return res.data;
};

// Cập nhật thành viên
const updateMembersService = async (membersData) => {
  const res = await axios.put("/member/update-member", membersData);
  return res.data;
};

// Xóa thành viên
const deleteMemberService = async (id) => {
  const res = await axios.delete(`/member/delete-member/${id}`);
  return res.data;
};

const getMemberByRoomIdService = async (id) => {
  const res = await axios.get(`/member/get-member-by-roomId/${id}`);
  return res.data;
};

export {
  getAllMembersService,
  createMembersService,
  updateMembersService,
  deleteMemberService,
  getMemberByRoomIdService,
};
