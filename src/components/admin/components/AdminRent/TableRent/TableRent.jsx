import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ModalViewRent from "../ModalViewRent/ModalViewRent";
import { formatCurrency, numberToText } from "@/utils/formatCurrency";
import { useNavigate } from "react-router-dom";

const TableRent = ({ filteredData }) => {
  const [printLoading, setPrintLoading] = useState(null);
  const navigate = useNavigate();
  const [isViewRentModalOpen, setIsViewRentModalOpen] = useState(false);
  const template = useSelector((state) => state.contractConfig.template);
  const personalInfo = useSelector((state) => state.inforConfig.personalInfo);

  // Hàm trích xuất tỉnh/thành phố từ địa chỉ
  const extractProvince = (address) => {
    if (!address) return "Tp. Hà Nội";
    const parts = address.split(",").map((part) => part.trim());
    return parts[parts.length - 1] || "Tp. Hà Nội";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "[Ngày]";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const formatContractDate = (dateString) => {
    if (!dateString) return "[Ngày]";
    return format(new Date(dateString), "dd 'tháng' MM 'năm' yyyy", {
      locale: vi,
    });
  };

  const calculateMonths = (startDate, endDate) => {
    if (!startDate || !endDate) return "[Số tháng]";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return months;
  };

  // Hàm thay thế placeholder
  const replacePlaceholders = (text, rentData) => {
    if (!rentData) return text;
    return text
      .replace(
        "[NgayKy]",
        format(rentData.NgayBatDau, "dd/MM/yyyy") || "[Ngày ký]"
      )
      .replace("[ngay]", format(rentData.NgayBatDau, "dd") || "[Ngày]")
      .replace("[thang]", format(rentData.NgayBatDau, "MM") || "[Tháng]")
      .replace("[nam]", format(rentData.NgayBatDau, "yyyy") || "[Năm]")
      .replace("[DiaChiPT]", rentData.PhongTro?.Nha?.DiaChi || "[Địa chỉ]")
      .replace("[SoHD]", rentData.MaTP || "[Số hợp đồng]")
      .replace("[HoTenCT]", personalInfo?.HoTen || "[Họ tên chủ trọ]")
      .replace(
        "[NgaySinhCT]",
        personalInfo?.NgaySinh
          ? format(new Date(personalInfo.NgaySinh), "yyyy")
          : "[Năm sinh]"
      )
      .replace("[CCCDCT]", personalInfo?.CCCD || "[Số CCCD]")
      .replace(
        "[NgayCapCT]",
        personalInfo?.NgayCap
          ? format(new Date(personalInfo.NgayCap), "dd/MM/yyyy")
          : "[Ngày cấp]"
      )
      .replace("[NoiCapCT]", personalInfo?.NoiCap || "[Nơi cấp]")
      .replace("[DiaChiCT]", personalInfo?.DiaChi || "[Địa chỉ chủ trọ]")
      .replace("[DienThoaiCT]", personalInfo?.DienThoai || "[Số điện thoại]")
      .replace("[HoTen]", rentData.KhachHang?.HoTen || "[Tên khách hàng]")
      .replace(
        "[NgaySinh]",
        rentData.KhachHang?.NgaySinh
          ? format(new Date(rentData.KhachHang.NgaySinh), "yyyy")
          : "[Năm sinh]"
      )
      .replace("[CCCD]", rentData.KhachHang?.CCCD || "[Số CCCD]")
      .replace(
        "[NgayCap]",
        rentData.KhachHang?.NgayCap
          ? formatDate(rentData.KhachHang.NgayCap)
          : "[Ngày cấp]"
      )
      .replace("[NoiCap]", rentData.KhachHang?.NoiCap || "[Nơi cấp]")
      .replace("[DiaChi]", rentData.KhachHang?.DiaChi || "[Địa chỉ khách hàng]")
      .replace(
        "[DienThoai]",
        rentData.KhachHang?.DienThoaiChinh || "[Số điện thoại]"
      )
      .replace("[TenPhong]", rentData.PhongTro?.TenPhong || "[Tên phòng]")
      .replace("[TenNha]", rentData.PhongTro?.Nha?.TenNha || "[Tên nhà]")
      .replace("[DiaChi]", rentData.PhongTro?.Nha?.DiaChi || "[Địa chỉ nhà]")
      .replace(
        "[DonGia]",
        rentData.DonGia
          ? rentData.DonGia.toLocaleString("vi-VN") + " đồng"
          : "[Giá thuê]"
      )
      .replace(
        "[NgayBatDau]",
        rentData.NgayBatDau ? formatDate(rentData.NgayBatDau) : "[Ngày bắt đầu]"
      )
      .replace(
        "[ThoiHanThue]",
        calculateMonths(rentData.NgayBatDau, rentData.NgayKetThuc)
      )
      .replace("[DatCoc]", formatCurrency(rentData.DatCoc) || "[Đã đặt cọc]")
      .replace("[DonGiaChu]", numberToText(rentData.DonGia))
      .replace("[DatCocChu]", numberToText(rentData.DatCoc))
      .replace(
        "[CurrentDate]",
        rentData.NgayBatDau
          ? formatContractDate(rentData.NgayBatDau)
          : formatContractDate(new Date())
      );
  };

  const safeTemplate =
    template && Object.keys(template).length > 0 ? template : {};

  // Hàm in hợp đồng
  const printContract = (rentData) => {
    try {
      setPrintLoading(rentData.MaTP);
      const province = extractProvince(rentData.PhongTro?.Nha?.DiaChi);

      const printContent = `
        <html>
          <head>
            <title>In hợp đồng #${rentData.MaTP}</title>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
            <style>
              @media print {
                @page {
                  size: A4;
                  margin: 20mm 10mm 10mm 10mm; /* Đảm bảo margin đủ để tránh dính mép */
                }
                body {
                  font-family: 'Noto Sans', Arial, sans-serif;
                  background: #fff;
                  color: #000;
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  box-sizing: border-box;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                }
                .text-center { text-align: center; }
                .text-left { text-align: left; }
                .text-right { text-align: right; }
                .font-bold { font-weight: 700; }
                .font-medium { font-weight: 500; }
                .mb-4 { margin-bottom: 1rem; }
                .ml-4 { margin-left: 1rem; }
                .uppercase { text-transform: uppercase; }
                .list-disc { list-style-type: disc; }
                .list-disc li { margin-left: 1.5rem; }
                .signature-table { width: 100%; }
                .signature-cell { width: 50%; text-align: center; }
                .signature-space { height: 100px; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header -->
              <div class="text-center mb-4">
                ${(safeTemplate.header?.preamble || [])
                  .map(
                    (line, index) =>
                      `<p class="${
                        index === 0 ? "uppercase font-bold" : "font-medium"
                      }">${replacePlaceholders(line, rentData)}</p>`
                  )
                  .join("")}
                <h1 class="uppercase font-bold">${replacePlaceholders(
                  safeTemplate.header?.title || "",
                  rentData
                )}</h1>
                <p class="font-medium">${replacePlaceholders(
                  safeTemplate.header?.contractInfo || "",
                  rentData
                )}</p>
                ${(safeTemplate.header?.legalBasis || [])
                  .map(
                    (line) =>
                      `<p class="text-left">${replacePlaceholders(
                        line,
                        rentData
                      )}</p>`
                  )
                  .join("")}
              </div>

              <!-- Bên A -->
              <div class="mb-4">
                <p class="font-bold">${replacePlaceholders(
                  safeTemplate.benA?.title || "",
                  rentData
                )}</p>
                <div class="ml-4">
                  ${(safeTemplate.benA?.details || [])
                    .map(
                      (detail) =>
                        `<p>${replacePlaceholders(detail, rentData)}</p>`
                    )
                    .join("")}
                </div>
              </div>

              <!-- Bên B -->
              <div class="mb-4">
                <p class="font-bold">${replacePlaceholders(
                  safeTemplate.benB?.title || "",
                  rentData
                )}</p>
                <div class="ml-4">
                  ${(safeTemplate.benB?.details || [])
                    .map(
                      (detail) =>
                        `<p>${replacePlaceholders(detail, rentData)}</p>`
                    )
                    .join("")}
                </div>
              </div>

              <!-- Thỏa thuận -->
              <p class="mb-4">${replacePlaceholders(
                safeTemplate.thoaThuan || "",
                rentData
              )}</p>

              <!-- Điều khoản -->
              ${(safeTemplate.dieuKhoan || [])
                .map(
                  (dieu) => `
                  <div class="mb-4">
                    <p class="font-bold">${replacePlaceholders(
                      dieu.title,
                      rentData
                    )}</p>
                    <ul class="list-disc">
                      ${dieu.items
                        .map(
                          (item) =>
                            `<li>${replacePlaceholders(item, rentData)}</li>`
                        )
                        .join("")}
                    </ul>
                  </div>
                `
                )
                .join("")}

              <!-- Footer -->
              <div class="text-right mb-4">
                <p>${replacePlaceholders(
                  province,
                  rentData
                )}, Ngày ${replacePlaceholders(
        safeTemplate.footer.date,
        rentData
      )}</p>
              </div>

              <!-- Chữ ký -->
              <table class="signature-table">
                <tr>
                  ${(safeTemplate.footer?.signatures || [])
                    .map(
                      (sig) => `
                      <td class="signature-cell">
                        <p class="font-bold">${replacePlaceholders(
                          sig.party,
                          rentData
                        )}</p>
                        <div class="signature-space"></div>
                        <p>${replacePlaceholders(sig.note, rentData)}</p>
                      </td>
                    `
                    )
                    .join("")}
                </tr>
              </table>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error(
          "Không thể mở cửa sổ in. Vui lòng kiểm tra trình duyệt của bạn."
        );
        setPrintLoading(null);
        return;
      }

      printWindow.document.write(printContent);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setPrintLoading(null);
      }, 500);
    } catch (error) {
      console.error("Lỗi khi in hợp đồng:", error);
      toast.error("Có lỗi xảy ra khi in hợp đồng!");
      setPrintLoading(null);
    }
  };

  const checkInfo = (rentData) => {
    if (!rentData?.KhachHang?.HoTen) {
      toast.error("Khách hàng chưa có thông tin!");
      return;
    }
    navigate("/admin/view-info", { state: { rentData } });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="rounded overflow-x-auto border shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100/50 text-gray-700">
              <TableHead className="text-center w-[100px] font-semibold">
                Mã hợp đồng
              </TableHead>
              <TableHead className="text-left w-[150px] font-semibold">
                Tên khách hàng
              </TableHead>
              <TableHead className="text-left w-[120px] font-semibold">
                Tên nhà
              </TableHead>
              <TableHead className="text-left w-[120px] font-semibold">
                Tên phòng
              </TableHead>
              <TableHead className="text-center w-[120px] font-semibold">
                Ngày bắt đầu
              </TableHead>
              <TableHead className="text-center w-[120px] font-semibold">
                Ngày kết thúc
              </TableHead>
              <TableHead className="text-right w-[120px] font-semibold">
                Đơn giá
              </TableHead>
              <TableHead className="text-right w-[120px] font-semibold">
                Đặt cọc
              </TableHead>
              <TableHead className="text-center w-[120px] font-semibold">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((rent) => (
                <TableRow
                  key={rent.MaTP}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-center py-2">
                    {rent.MaTP}
                  </TableCell>
                  <TableCell
                    className="text-left py-2 cursor-pointer"
                    onClick={() => checkInfo(rent)}
                  >
                    {rent.KhachHang?.HoTen || "-"}
                  </TableCell>
                  <TableCell className="text-left py-2">
                    {rent.PhongTro?.Nha?.TenNha || "-"}
                  </TableCell>
                  <TableCell className="text-left py-2">
                    {rent.PhongTro?.TenPhong || "-"}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {rent.NgayBatDau
                      ? format(new Date(rent.NgayBatDau), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {rent.NgayKetThuc
                      ? format(new Date(rent.NgayKetThuc), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right py-2">
                    {rent.DonGia?.toLocaleString("vi-VN") || 0} VNĐ
                  </TableCell>
                  <TableCell className="text-right py-2">
                    {rent.DatCoc?.toLocaleString("vi-VN") || 0} VNĐ
                  </TableCell>
                  <TableCell className="text-center py-2">
                    <div className="flex items-center justify-center gap-2">
                      <ModalViewRent
                        open={isViewRentModalOpen}
                        setOpen={setIsViewRentModalOpen}
                        rentData={rent}
                      />
                      <Button
                        onClick={() => {
                          setPrintLoading(rent.MaTP);
                          printContract(rent);
                        }}
                        className={`flex items-center bg-transparent border-none rounded-none outline-none shadow-none p-2 transition-colors ${
                          printLoading === rent.MaTP
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                        disabled={printLoading === rent.MaTP}
                      >
                        <Printer className="size-5 text-blue-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-6 text-gray-500"
                >
                  Không có hợp đồng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableRent;
