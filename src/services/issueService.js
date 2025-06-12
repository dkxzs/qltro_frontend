import axios from "../utils/axiosCustomize.js";

const getAllIssueService = async () => {
  const res = await axios.get(`/issue/get-all-issues`);
  return res.data;
};

const createIssueService = async (data) => {
  try {
    const res = await axios.post(`/issue/create-issue`, data);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi tạo báo cáo sự cố" };
  }
};

const updateIssueService = async (id, data) => {
  try {
    const res = await axios.put(`/issue/update-issue/${id}`, data);
    return res.data;
  } catch (error) {
    return (
      error.response?.data || { EC: -1, EM: "Lỗi khi cập nhật báo cáo sự cố" }
    );
  }
};

const deleteIssueService = async (id) => {
  try {
    const res = await axios.delete(`/issue/delete-issue/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || { EC: -1, EM: "Lỗi khi xóa báo cáo sự cố" };
  }
};

const getAllIssueStatusService = async () => {
  const res = await axios.get(`/issue/get-all-issues-status`);
  return res.data;
};

export {
  getAllIssueService,
  createIssueService,
  updateIssueService,
  deleteIssueService,
  getAllIssueStatusService,
};
