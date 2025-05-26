import axios from "../utils/axiosCustomize";

const getRevenueReportService = async () => {
  const res = await axios.get(`/report/revenue`);
  return res.data;
};

const getProfitReportService = async () => {
  const res = await axios.get(`/report/profit`);
  return res.data;
};

const getRoomStatusSummaryService = async (thang, nam) => {
  const res = await axios.get(`/report/room-status-summary`, {
    params: { thang, nam },
  });
  return res.data;
};

const getExpenseReportService = async (timeRange) => {
  const res = await axios.get(`/report/expense-report`, {
    params: { timeRange },
  });
  return res.data;
};

const getContractReportService = async () => {
  const res = await axios.get(`/report/contract-report`);
  return res.data;
};

export {
  getContractReportService,
  getExpenseReportService,
  getProfitReportService,
  getRevenueReportService,
  getRoomStatusSummaryService,
};
