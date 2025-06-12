import axios from "../utils/axiosCustomize.js";

const getAllMembersService = async () => {
  const res = await axios.get("/member/get-all-member");
  return res.data;
};

const createMembersService = async (membersData) => {
  try {
    const res = await axios.post("/member/create-member", membersData);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo thành viên" };
  }
};

const updateMembersService = async (membersData) => {
  try {
    const res = await axios.put("/member/update-member", membersData);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật thành viên" }
    );
  }
};

const deleteMemberService = async (id) => {
  try {
    const res = await axios.delete(`/member/delete-member/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa thành viên" };
  }
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
