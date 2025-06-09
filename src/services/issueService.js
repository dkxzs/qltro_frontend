import axios from "../utils/axiosCustomize";

const getAllIssueService = async () => {
  const res = await axios.get(`/issue/get-all-issues`);
  return res.data;
};

const createIssueService = async (data) => {
  const res = await axios.post(`/issue/create-issue`, data);
  return res.data;
};

const updateIssueService = async (id, data) => {
  const res = await axios.put(`/issue/update-issue/${id}`, data);
  return res.data;
};

const getAllIssueStatusService = async () => {
  const res = await axios.get(`/issue/get-all-issues-status`);
  return res.data;
};

export {
  getAllIssueService,
  createIssueService,
  updateIssueService,
  getAllIssueStatusService,
};
