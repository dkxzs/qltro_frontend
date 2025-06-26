// Ánh xạ từ số sang chuỗi
export const ROOM_STATUS = {
  0: "Còn trống",
  1: "Đang thuê",
  2: "Đặt cọc",
  3: "Sửa chữa",
};

// Ánh xạ từ chuỗi sang số
export const ROOM_STATUS_VALUE = {
  "Còn trống": 0,
  "Đang thuê": 1,
  "Đặt cọc": 2,
  "Sửa chữa": 3,
};

export const getRoomStatusText = (status) => {
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;
  return ROOM_STATUS[statusNumber] || "Không xác định";
};

export const getRoomStatusValue = (statusText) => {
  return ROOM_STATUS_VALUE[statusText] !== undefined
    ? ROOM_STATUS_VALUE[statusText]
    : -1;
};

export const getRoomStatusColor = (status) => {
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;

  switch (statusNumber) {
    case 0:
      return "text-green-600 bg-green-50";
    case 1:
      return "text-red-600 bg-red-50";
    case 2:
      return "text-orange-600 bg-orange-50";
    case 3:
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const isRoomAvailable = (status) => {
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;
  return statusNumber === 0;
};

export const isRoomRented = (status) => {
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;
  return statusNumber === 1;
};
