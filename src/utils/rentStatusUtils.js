// Ánh xạ từ số sang chuỗi
export const RENT_STATUS = {
  0: "Hết hạn",
  1: "Đang thuê"
};

// Ánh xạ từ chuỗi sang số
export const RENT_STATUS_VALUE = {
  "Hết hạn": 0,
  "Đang thuê": 1
};

/**
 * Chuyển đổi từ số sang chuỗi trạng thái
 * @param {number|string} status - Trạng thái dạng số hoặc chuỗi số
 * @returns {string} - Chuỗi trạng thái
 */
export const getStatusText = (status) => {
  // Chuyển status thành số nếu nó là chuỗi
  const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;
  return RENT_STATUS[statusNumber] || "Không xác định";
};

/**
 * Chuyển đổi từ chuỗi trạng thái sang số
 * @param {string} statusText - Chuỗi trạng thái
 * @returns {number} - Số trạng thái
 */
export const getStatusValue = (statusText) => {
  return RENT_STATUS_VALUE[statusText] !== undefined 
    ? RENT_STATUS_VALUE[statusText] 
    : -1; // -1 cho trạng thái không xác định
};

/**
 * Lấy màu tương ứng với trạng thái
 * @param {number|string} status - Trạng thái dạng số hoặc chuỗi số
 * @returns {string} - Tên class CSS
 */
export const getStatusColor = (status) => {
  // Chuyển status thành số nếu nó là chuỗi
  const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;
  
  switch (statusNumber) {
    case 0: // Hết hạn
      return "text-gray-600 bg-gray-50";
    case 1: // Đang thuê
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

/**
 * Kiểm tra xem trạng thái có phải là đang hoạt động (đang thuê)
 * @param {number|string} status - Trạng thái dạng số hoặc chuỗi
 * @returns {boolean} - true nếu đang hoạt động
 */
export const isActiveStatus = (status) => {
  // Chuyển status thành số nếu nó là chuỗi
  const statusNumber = typeof status === 'string' ? parseInt(status, 10) : status;
  return statusNumber === 1;
};