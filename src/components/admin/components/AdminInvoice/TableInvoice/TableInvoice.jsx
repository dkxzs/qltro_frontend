import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminService } from "@/services/adminServices";
import { getInvoiceByIdService } from "@/services/invoiceServices";
import { numberToText } from "@/utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ModalPayment from "../ModalPayment/ModalPayment";
import ModalViewInvoice from "../ModalViewInvoice/ModalViewInvoice";

const TableInvoice = ({ invoices, isLoading }) => {
  const [printLoading, setPrintLoading] = useState(null);

  const { data: adminData } = useQuery({
    queryKey: ["adminInfo"],
    queryFn: () => getAdminService(),
  });

  const printInvoice = async (invoiceId) => {
    setPrintLoading(invoiceId);

    try {
      const response = await getInvoiceByIdService(invoiceId);
      console.log("Dữ liệu từ API:", response);

      const data = response?.data || response;
      if (!data) {
        throw new Error("Không nhận được dữ liệu từ server");
      }

      const invoiceData = data.DT?.invoice || data.invoice || {};
      const invoiceDetails =
        data.DT?.invoiceDetails || data.invoiceDetails || [];
      const dienNuoc = data.DT?.dienNuoc || data.dienNuoc || [];

      if (!invoiceData || Object.keys(invoiceData).length === 0) {
        throw new Error("Hóa đơn không tồn tại hoặc dữ liệu trống");
      }

      const defaultBankInfo = {
        bank: "Sacombank",
        accountNumber: "0786123512124 - [ Huỳnh Công Khanh ]",
        phone: "0777905219",
      };

      const displayBank =
        adminData?.DT.TenNganHang !== undefined
          ? adminData?.DT.TenNganHang
          : defaultBankInfo.bank;
      const displayAccountNumber =
        adminData?.DT.SoTaiKhoan !== undefined
          ? adminData?.DT.SoTaiKhoan
          : defaultBankInfo.accountNumber;
      const displayAccountName = adminData?.DT.HoTen;
      const displayPhone = adminData?.DT.DienThoai;

      const invoiceDate = invoiceData?.NgayLap
        ? new Date(invoiceData.NgayLap)
        : null;
      const monthYear = invoiceDate ? format(invoiceDate, "MM/yyyy") : "";
      const firstDay = invoiceDate ? `01/${monthYear}` : "";
      const lastDay = invoiceDate
        ? format(
            new Date(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, 0),
            "dd/MM/yyyy"
          )
        : "";

      const charges = [];

      const tienNhaDetail = invoiceDetails.find(
        (item) => item?.LoaiChiPhi === "Tiền nhà"
      );
      if (tienNhaDetail) {
        charges.push({
          id: charges.length + 1,
          description: `Tiền nhà (từ ngày ${firstDay} đến ngày ${lastDay})`,
          amount: tienNhaDetail.ThanhTien,
        });
      }

      dienNuoc.forEach((dn) => {
        const detail = invoiceDetails.find(
          (item) =>
            item?.MaThamChieu === dn?.MaDN &&
            item?.LoaiChiPhi.includes(dn?.DichVu?.TenDV)
        );
        if (detail) {
          const usage = (dn.ChiSoMoi || 0) - (dn.ChiSoCu || 0);
          charges.push({
            id: charges.length + 1,
            description: `${dn.DichVu.TenDV} (CS cũ: ${dn.ChiSoCu},00 - CS mới: ${dn.ChiSoMoi},00 - SD: ${usage},00)`,
            amount: detail.ThanhTien,
          });
        }
      });

      const dichVuDetails = invoiceDetails.filter((item) =>
        item?.LoaiChiPhi?.startsWith("Dịch vụ:")
      );
      dichVuDetails.forEach((detail) => {
        const description = detail.LoaiChiPhi.replace("Dịch vụ: ", "");
        charges.push({
          id: charges.length + 1,
          description: `${description} (Số lượng: ${detail.SoLuong})`,
          amount: detail.ThanhTien,
        });
      });

      const chiPhiPhatSinhDetails = invoiceDetails.filter(
        (item) => item?.LoaiChiPhi === "Chi phí phát sinh"
      );
      chiPhiPhatSinhDetails.forEach((detail) => {
        charges.push({
          id: charges.length + 1,
          description: `Chi phí phát sinh`,
          amount: detail.ThanhTien,
        });
      });

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error(
          "Không thể mở cửa sổ in. Vui lòng kiểm tra trình duyệt của bạn."
        );
        setPrintLoading(null);
        return;
      }

      const css = `
        <style>
          @media print {
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              font-family: 'Noto Sans', Arial, sans-serif;
              background: #fff;
              color: #000;
              margin: 20px;
              padding: 0;
              width: 100%;
              box-sizing: border-box;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
            }
            .flex {
              display: flex;
            }
            .justify-between {
              justify-content: space-between;
            }
            .mb-2 {
              margin-bottom: 0.5rem;
            }
            .mb-4 {
              margin-bottom: 1rem;
            }
            .mb-6 {
              margin-bottom: 1.5rem;
            }
            .text-sm {
              font-size: 0.875rem;
              line-height: 1.25rem;
            }
            .font-semibold {
              font-weight: 600;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .text-2xl {
              font-size: 1.5rem;
              line-height: 2rem;
            }
            .font-bold {
              font-weight: 700;
            }
            .text-blue-900 {
              color: #003366;
            }
            .font-medium {
              font-weight: 500;
            }
            .py-1 {
              padding-top: 0.25rem;
              padding-bottom: 0.25rem;
            }
            .py-2 {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
            .border-b {
              border-bottom: 1px solid #e5e7eb;
            }
            .border-gray-100 {
              border-color: #e5e7eb;
            }
            .text-lg {
              font-size: 1.125rem;
              line-height: 1.75rem;
            }
            .border-t-2 {
              border-top: 2px solid #000;
            }
            .border-gray-800 {
              border-color: #1f2937;
            }
            .italic {
              font-style: italic;
            }
            .bg-gray-100 {
              background-color: #f3f4f6;
            }
            .p-3 {
              padding: 0.75rem;
            }
            .rounded-md {
              border-radius: 0.375rem;
            }
            .mb-6 {
              page-break-inside: avoid;
            }
          }
        </style>
      `;

      const printContent = `
        <html>
          <head>
            <title>In hóa đơn #${invoiceId}</title>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
            ${css}
          </head>
          <body>
            <div class="container">
              <div class="flex justify-between mb-2">
                <div class="text-sm">
                  <p class="font-semibold">
                    Nhà: ${invoiceData?.ThuePhong?.PhongTro?.Nha?.TenNha || "-"}
                  </p>
                  <p>${invoiceData?.ThuePhong?.PhongTro?.Nha?.DiaChi || "-"}</p>
                </div>
                <div class="text-sm text-right">
                  ${
                    invoiceData?.NgayLap
                      ? format(new Date(invoiceData.NgayLap), "dd/MM/yyyy")
                      : "-"
                  }
                </div>
              </div>

              <h1 class="text-2xl font-bold text-center text-blue-900 mb-2">
                HÓA ĐƠN TIỀN NHÀ
              </h1>

              <div class="text-center mb-4">
                <p class="font-medium">Tháng ${monthYear}</p>
                <p class="text-sm">
                  (từ ngày ${firstDay} đến ngày ${lastDay})
                </p>
              </div>

              <div class="mb-6">
                <p>
                  <span class="font-medium">Họ và tên:</span>
                  ${invoiceData?.ThuePhong?.KhachTro?.HoTen || "-"}
                </p>
                <p>
                  <span class="font-medium">Phòng:</span>
                  ${invoiceData?.ThuePhong?.PhongTro?.TenPhong || "-"}
                </p>
                <p>
                  <span class="font-medium">Ngày vào:</span>
                  ${
                    invoiceData?.ThuePhong?.NgayBatDau
                      ? format(
                          new Date(invoiceData.ThuePhong.NgayBatDau),
                          "dd/MM/yyyy"
                        )
                      : "-"
                  }
                </p>
              </div>

              <div class="mb-6">
                ${charges
                  .map(
                    (item) => `
                      <div class="flex justify-between py-1 border-b border-gray-100">
                        <div>
                          ${item.id}. ${item.description}
                        </div>
                        <div class="text-right font-medium">
                          ${item.amount?.toLocaleString("vi-VN") || 0} VNĐ
                        </div>
                      </div>
                    `
                  )
                  .join("")}
              </div>

              <div class="mb-6">
                <div class="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-800">
                  <div class="text-blue-900">TỔNG CỘNG</div>
                  <div class="text-right">
                    ${invoiceData?.TongTien?.toLocaleString("vi-VN") || 0} VNĐ
                  </div>
                </div>
                <div class="text-center italic text-sm font-semibold">
                  ( Bằng chữ: ${numberToText(invoiceData?.TongTien || 0)} )
                </div>
              </div>

              <div class="bg-gray-100 p-3 rounded-md">
                <h3 class="font-bold mb-2">Thông tin số tài khoản</h3>
                <p>
                  <span class="font-medium">Ngân hàng:</span>
                  ${displayBank || "Chưa nhập"}
                </p>
                <p>
                  <span class="font-medium">Số tài khoản:</span>
                  ${
                    displayAccountNumber || "Chưa nhập"
                  } - [${displayAccountName}]
                </p>
                <p>
                  <span class="font-medium">Số điện thoại liên hệ:</span>
                  ${displayPhone || "Chưa nhập"}
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setPrintLoading(null);
      }, 500);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu hoặc in hóa đơn:", error);
      toast.error(
        "Có lỗi xảy ra khi in hóa đơn. Vui lòng kiểm tra console hoặc liên hệ admin."
      );
      setPrintLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="rounded overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Mã hóa đơn</TableHead>
              <TableHead>Mã hợp đồng</TableHead>
              <TableHead>Tên nhà</TableHead>
              <TableHead>Tên phòng</TableHead>
              <TableHead>Ngày lập</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Tiền đã đóng</TableHead>
              <TableHead>Số tiền còn lại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center pr-10">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice.MaHD}>
                  <TableCell>{invoice.MaHD}</TableCell>
                  <TableCell>{invoice.MaTP}</TableCell>
                  <TableCell>
                    {invoice.ThuePhong?.PhongTro?.Nha?.TenNha || "-"}
                  </TableCell>
                  <TableCell>
                    {invoice.ThuePhong?.PhongTro?.TenPhong || "-"}
                  </TableCell>
                  <TableCell>
                    {invoice.NgayLap
                      ? format(new Date(invoice.NgayLap), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {invoice.TongTien?.toLocaleString("vi-VN") || 0} VNĐ
                  </TableCell>
                  <TableCell>
                    {invoice.totalPaid?.toLocaleString("vi-VN") || 0} VNĐ
                  </TableCell>
                  <TableCell>
                    {invoice.remaining?.toLocaleString("vi-VN") || 0} VNĐ
                  </TableCell>
                  <TableCell>
                    {invoice.TrangThai === 0
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <ModalViewInvoice invoiceId={invoice.MaHD} />
                    </div>
                    <div>
                      <ModalPayment
                        invoiceId={invoice.MaHD}
                        invoiceData={invoice}
                      />
                    </div>
                    <Button
                      onClick={() => printInvoice(invoice.MaHD)}
                      className={`flex items-center bg-transparent border-none rounded-none shadow-none outline-none ${
                        printLoading === invoice.MaHD
                          ? "cursor-no-drop"
                          : "cursor-pointer"
                      }`}
                      disabled={printLoading === invoice.MaHD}
                    >
                      <Printer className="size-4 text-gray-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Không có hóa đơn nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableInvoice;
