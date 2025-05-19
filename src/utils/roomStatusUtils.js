/**
 * Các trạng thái phòng trọ (PhongTro)
 */

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

/**
 * Chuyển đổi từ số sang chuỗi trạng thái
 * @param {number|string} status - Trạng thái dạng số hoặc chuỗi số
 * @returns {string} - Chuỗi trạng thái
 */
export const getRoomStatusText = (status) => {
  // Chuyển status thành số nếu nó là chuỗi
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;
  return ROOM_STATUS[statusNumber] || "Không xác định";
};

/**
 * Chuyển đổi từ chuỗi trạng thái sang số
 * @param {string} statusText - Chuỗi trạng thái
 * @returns {number} - Số trạng thái
 */
export const getRoomStatusValue = (statusText) => {
  return ROOM_STATUS_VALUE[statusText] !== undefined
    ? ROOM_STATUS_VALUE[statusText]
    : -1; // -1 cho trạng thái không xác định
};

/**
 * Lấy màu tương ứng với trạng thái phòng
 * @param {number|string} status - Trạng thái dạng số hoặc chuỗi số
 * @returns {string} - Tên class CSS
 */
export const getRoomStatusColor = (status) => {
  // Chuyển status thành số nếu nó là chuỗi
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;

  switch (statusNumber) {
    case 0: // Còn trống
      return "text-green-600 bg-green-50";
    case 1: // Đang thuê
      return "text-red-600 bg-red-50";
    case 2: // Đang sửa chữa
      return "text-orange-600 bg-orange-50";
    case 3: // Tạm ngưng
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

/**
 * Kiểm tra xem phòng có đang trống không
 * @param {number|string} status - Trạng thái dạng số hoặc chuỗi
 * @returns {boolean} - true nếu phòng đang trống
 */
export const isRoomAvailable = (status) => {
  // Chuyển status thành số nếu nó là chuỗi
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;
  return statusNumber === 0;
};

/**
 * Kiểm tra xem phòng có đang được thuê không
 * @param {number|string} status - Trạng thái dạng số hoặc chuỗi
 * @returns {boolean} - true nếu phòng đang được thuê
 */
export const isRoomRented = (status) => {
  // Chuyển status thành số nếu nó là chuỗi
  const statusNumber =
    typeof status === "string" ? parseInt(status, 10) : status;
  return statusNumber === 1;
};
