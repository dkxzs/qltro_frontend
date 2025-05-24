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

const getOccupancyReportService = async (timeRange) => {
  const res = await axios.get(`/report/occupancy`, {
    params: { timeRange },
  });
  return res.data;
};

const getExpenseReportService = async (timeRange) => {
  const res = await axios.get(`/report/expense-report`, {
    params: { timeRange },
  });
  return res.data;
};

const getTenantReportService = async (thang, nam) => {
  const res = await axios.get(`/report/tenants`, {
    params: { thang, nam },
  });
  return res.data;
};

const getContractReportService = async (timeRange) => {
  const res = await axios.get(`/report/contract-report`, {
    // Sửa endpoint để khớp với route
    params: { timeRange },
  });
  return res.data;
};

const getDebtReportService = async (thang, nam) => {
  const res = await axios.get(`/report/debts`, {
    params: { thang, nam },
  });
  return res.data;
};

const getKPIReportService = async (timeRange) => {
  const res = await axios.get(`/report/kpis`, {
    params: { timeRange },
  });
  return res.data;
};

export {
  getContractReportService,
  getDebtReportService,
  getExpenseReportService,
  getKPIReportService,
  getOccupancyReportService,
  getProfitReportService,
  getRevenueReportService,
  getRoomStatusSummaryService,
  getTenantReportService,
};
