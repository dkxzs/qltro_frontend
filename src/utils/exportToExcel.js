import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * Xuất dữ liệu ra file Excel
 * @param {Array} data - Mảng dữ liệu cần xuất
 * @param {Array} headers - Mảng chứa thông tin header (tên cột)
 * @param {string} filename - Tên file xuất ra (không cần đuôi .xlsx)
 * @param {string} sheetName - Tên sheet trong file Excel
 * @param {Object} options - Tùy chọn bổ sung (title)
 */
export const exportToExcel = async (
  data,
  headers,
  filename,
  sheetName = "Sheet1",
  options = {}
) => {
  try {
    // Tạo workbook mới
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Quản lý trọ";
    workbook.lastModifiedBy = "Quản lý trọ";
    workbook.created = new Date();
    workbook.modified = new Date();

    // Tạo worksheet
    const worksheet = workbook.addWorksheet(sheetName);

    // Thêm tiêu đề nếu có
    let rowIndex = 1;
    if (options.title) {
      // Thêm dòng tiêu đề
      const titleRow = worksheet.addRow([options.title]);
      titleRow.height = 30;

      // Gộp các ô cho tiêu đề
      worksheet.mergeCells(`A1:${String.fromCharCode(64 + headers.length)}1`);

      // Định dạng ô tiêu đề
      const titleCell = worksheet.getCell("A1");
      titleCell.font = {
        name: "Arial",
        size: 16,
        bold: true,
      };
      titleCell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFEEEEEE" },
      };

      // Thêm dòng trống sau tiêu đề
      worksheet.addRow([]);
      rowIndex = 3;
    }

    // Thêm header
    const headerRow = worksheet.addRow(headers.map((header) => header.label));
    headerRow.font = {
      bold: true,
    };
    headerRow.height = 20;

    // Định dạng header
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });

    // Thêm dữ liệu
    data.forEach((item) => {
      const rowData = headers.map((header) => {
        const value = item[header.key];

        // Xử lý định dạng nếu có
        if (header.format && typeof header.format === "function") {
          return header.format(value);
        }

        return value;
      });

      const row = worksheet.addRow(rowData);

      // Định dạng dòng dữ liệu
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Tự động điều chỉnh độ rộng cột
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${filename}.xlsx`);

    return true;
  } catch (error) {
    console.error("Lỗi khi xuất file Excel:", error);
    return false;
  }
};

/**
 * Định dạng dữ liệu cho phù hợp với Excel
 */
export const excelFormatters = {
  // Định dạng ngày tháng
  date: (value) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString("vi-VN");
  },

  // Định dạng tiền tệ
  currency: (value) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  },

  // Định dạng trạng thái
  status: (value) => {
    const statusMap = {
      0: "Còn trống",
      1: "Đã cho thuê",
      2: "Đang sửa chữa",
      3: "Đặt cọc",
    };
    return statusMap[value] || value;
  },
};
