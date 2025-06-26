// Ánh xạ từ số sang chuỗi
export const RENT_STATUS = {
  0: "Hết hạn",
  1: "Đang thuê",
};

// Ánh xạ từ chuỗi sang số
export const RENT_STATUS_VALUE = {
  "Hết hạn": 0,
  "Đang thuê": 1,
};

export const getStatusText = (status) => {
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;
  return RENT_STATUS[statusNumber] || "Không xác định";
};

export const getStatusValue = (statusText) => {
  return RENT_STATUS_VALUE[statusText] !== undefined
    ? RENT_STATUS_VALUE[statusText]
    : -1;
};

export const getStatusColor = (status) => {
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;

  switch (statusNumber) {
    case 0:
      return "text-gray-600 bg-gray-50";
    case 1:
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const isActiveStatus = (status) => {
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;
  return statusNumber === 1;
};
