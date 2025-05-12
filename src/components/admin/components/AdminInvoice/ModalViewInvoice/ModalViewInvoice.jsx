import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendInvoiceService } from "@/services/emailServices";
import { generateImageService } from "@/services/imageServices";
import { getInvoiceByIdService } from "@/services/invoiceServices";
import { formatCurrency, numberToText } from "@/utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import jsPDF from "jspdf";
import { Eye, Loader2, Send } from "lucide-react";
import { useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ModalViewInvoice = ({ invoiceId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const invoiceRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoiceByIdService(invoiceId),
    enabled: open && !!invoiceId,
  });

  const personalInfo = useSelector((state) => state.inforConfig.personalInfo);
  const emailConfig = useSelector((state) => state.inforConfig.email);

  const invoiceData = data?.DT?.invoice || {};
  const invoiceDetails = data?.DT?.invoiceDetails || [];
  const dienNuoc = data?.DT?.dienNuoc || [];

  const defaultBankInfo = {
    bank: "Sacombank",
    accountNumber: "0786123512124 - [ Huỳnh Công Khanh ]",
    phone: "0777905219",
  };

  const displayBank =
    personalInfo.TenNganHang !== undefined
      ? personalInfo.TenNganHang
      : defaultBankInfo.bank;
  const displayAccountNumber =
    personalInfo.SoTaiKhoan !== undefined
      ? personalInfo.SoTaiKhoan
      : defaultBankInfo.accountNumber;
  const displayPhone = personalInfo.DienThoai;

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
    (item) => item.LoaiChiPhi === "Tiền nhà"
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
        item.MaThamChieu === dn.MaDN &&
        item.LoaiChiPhi.includes(dn.DichVu.TenDV)
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
    item.LoaiChiPhi.startsWith("Dịch vụ:")
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
    (item) => item.LoaiChiPhi === "Chi phí phát sinh"
  );
  chiPhiPhatSinhDetails.forEach((detail) => {
    charges.push({
      id: charges.length + 1,
      description: `Chi phí phát sinh`,
      amount: detail.ThanhTien,
    });
  });

  const exportAsImage = async () => {
    if (!invoiceRef.current) {
      toast.warning(
        "Nội dung hóa đơn chưa sẵn sàng để xuất. Vui lòng đợi dữ liệu tải xong."
      );
      return;
    }

    const css = `
      <style>
        body {
          font-family: 'Noto Sans', Arial, sans-serif;
          background: #fff;
          color: #000;
          margin: 20px;
          padding: 0;
          width: 100%;
          box-sizing: border-box;
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
        .text-sm {
          font-size: 0.875rem;
        }
        .font-semibold {
          font-weight: 600;
        }
        .text-right {
          text-align: right;
        }
        .text-2xl {
          font-size: 1.5rem;
        }
        .font-bold {
          font-weight: 700;
        }
        .text-center {
          text-align: center;
        }
        .text-blue-900 {
          color: #003366;
        }
        .mb-4 {
          margin-bottom: 1rem;
        }
        .font-medium {
          font-weight: 500;
        }
        .mb-6 {
          margin-bottom: 1.5rem;
        }
        .py-1 {
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
        .border-b {
          border-bottom: 1px solid #e5e7eb;
        }
        .border-gray-100 {
          border-color: #e5e7eb;
        }
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .text-lg {
          font-size: 1.125rem;
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
      </style>
    `;
    const htmlContent = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
          ${css}
        </head>
        <body>${invoiceRef.current.outerHTML}</body>
      </html>
    `;

    try {
      setImageLoading(true);
      const blob = await generateImageService(htmlContent);
      const link = document.createElement("a");
      link.download = `hoa_don_${invoiceId}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      setImageLoading(false);
    } catch (error) {
      console.error("Lỗi khi xuất ảnh:", error);
      toast.error(
        "Có lỗi xảy ra khi xuất ảnh. Vui lòng kiểm tra console để biết thêm chi tiết."
      );
    }
  };

  const exportAsPDF = async () => {
    if (!invoiceRef.current) {
      toast.warning(
        "Nội dung hóa đơn chưa sẵn sàng để xuất. Vui lòng đợi dữ liệu tải xong."
      );
      return;
    }

    const css = `
      <style>
        body {
          font-family: 'Noto Sans', Arial, sans-serif;
          background: #fff;
          color: #000;
          margin: 20px;
          padding: 0;
          width: 100%;
          box-sizing: border-box;
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
        .text-sm {
          font-size: 0.875rem;
        }
        .font-semibold {
          font-weight: 600;
        }
        .text-right {
          text-align: right;
        }
        .text-2xl {
          font-size: 1.5rem;
        }
        .font-bold {
          font-weight: 700;
        }
        .text-center {
          text-align: center;
        }
        .text-blue-900 {
          color: #003366;
        }
        .mb-4 {
          margin-bottom: 1rem;
        }
        .font-medium {
          font-weight: 500;
        }
        .mb-6 {
          margin-bottom: 1.5rem;
        }
        .py-1 {
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
        .border-b {
          border-bottom: 1px solid #e5e7eb;
        }
        .border-gray-100 {
          border-color: #e5e7eb;
        }
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .text-lg {
          font-size: 1.125rem;
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
      </style>
    `;
    const htmlContent = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
          ${css}
        </head>
        <body>${invoiceRef.current.outerHTML}</body>
      </html>
    `;

    try {
      setPdfLoading(true);
      const imageBlob = await generateImageService(htmlContent);
      const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = () => {
        const base64String = reader.result;

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const imgProps = pdf.getImageProperties(base64String);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(base64String, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`hoa_don_${invoiceId}.pdf`);
      };
      setPdfLoading(false);
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      toast.error(
        "Có lỗi xảy ra khi xuất PDF. Vui lòng kiểm tra console để biết thêm chi tiết."
      );
    }
  };

  const sendInvoice = async () => {
    if (!invoiceRef.current) {
      toast.warning("Nội dung hóa đơn chưa sẵn sàng để gửi.");
      return;
    }

    const fromEmail = emailConfig?.systemEmail;
    const encryptedPassword = emailConfig?.systemPassword;

    if (!fromEmail || !encryptedPassword) {
      toast.warning("Thiếu thông tin email gửi. Vui lòng kiểm tra cấu hình.");
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Noto Sans', Arial, sans-serif; background: #fff; color: #000; margin: 20px; padding: 0; width: 100%;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="font-size: 14px; padding-bottom: 10px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 50%; vertical-align: top;">
                      <p style="font-weight: 600; margin: 0 0 5px 0;">
                        Nhà: ${invoiceData?.ThuePhong?.PhongTro?.Nha?.TenNha}
                      </p>
                      <p style="margin: 0;">
                        ${invoiceData?.ThuePhong?.PhongTro?.Nha?.DiaChi}
                      </p>
                    </td>
                    <td style="width: 50%; text-align: right; vertical-align: top;">
                      <p style="margin: 0;">
                        ${
                          invoiceData?.NgayLap
                            ? format(
                                new Date(invoiceData.NgayLap),
                                "dd/MM/yyyy"
                              )
                            : ""
                        }
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-bottom: 10px;">
                <h1 style="font-size: 24px; font-weight: 700; color: #003366; margin: 0;">
                  HÓA ĐƠN TIỀN NHÀ
                </h1>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-bottom: 20px;">
                <p style="font-weight: 500; margin: 0;">Tháng ${monthYear}</p>
                <p style="font-size: 14px; margin: 0;">
                  (từ ngày ${firstDay} đến ngày ${lastDay})
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 30px;">
                <p style="margin: 0 0 5px 0;">
                  <span style="font-weight: 500;">Họ và tên:</span> 
                  ${invoiceData?.ThuePhong?.KhachHang?.HoTen}
                </p>
                <p style="margin: 0 0 5px 0;">
                  <span style="font-weight: 500;">Phòng:</span> 
                  ${invoiceData?.ThuePhong?.PhongTro?.TenPhong}
                </p>
                <p style="margin: 0;">
                  <span style="font-weight: 500;">Ngày vào:</span> 
                  ${
                    invoiceData?.ThuePhong?.NgayBatDau
                      ? format(
                          new Date(invoiceData.ThuePhong.NgayBatDau),
                          "dd/MM/yyyy"
                        )
                      : ""
                  }
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 30px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  ${charges
                    .map(
                      (item) => `
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            ${item.id}. ${item.description}
                          </td>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500;">
                            ${formatCurrency(item.amount)}
                          </td>
                        </tr>
                      `
                    )
                    .join("")}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 30px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 2px solid #000;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: 700; font-size: 18px; color: #003366;">
                      TỔNG CỘNG
                    </td>
                    <td style="padding: 10px 0; font-weight: 700; font-size: 18px; text-align: right;">
                      ${formatCurrency(invoiceData?.TongTien || 0)}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="text-align: center; font-style: italic; font-size: 14px; font-weight: 600; padding-top: 5px;">
                      ( Bằng chữ: ${numberToText(invoiceData?.TongTien)} )
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f3f4f6; padding: 15px; border-radius: 6px;">
                <h3 style="font-weight: 700; margin: 0 0 10px 0;">Thông tin số tài khoản</h3>
                <p style="margin: 0 0 5px 0;">
                  <span style="font-weight: 500;">Ngân hàng:</span> 
                  ${displayBank || "Chưa nhập"}
                </p>
                <p style="margin: 0 0 5px 0;">
                  <span style="font-weight: 500;">Số tài khoản:</span> 
                  ${displayAccountNumber || "Chưa nhập"}
                </p>
                <p style="margin: 0;">
                  <span style="font-weight: 500;">Số điện thoại liên hệ:</span> 
                  ${displayPhone}
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    try {
      setLoading(true);
      await sendInvoiceService({
        invoiceId,
        htmlContent,
        fromEmail,
        encryptedPassword,
      });
      setLoading(false);
      toast.success("Hóa đơn đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
      toast.error("Có lỗi xảy ra khi gửi email. Vui lòng kiểm tra console.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        className="bg-transparent border-none rounded-none shadow-none outline-none cursor-pointer"
      >
        <Eye className="size-4 text-blue-600" />
      </Button>

      <DialogContent
        className="max-w-4xl rounded h-[95vh]"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            CHI TIẾT HÓA ĐƠN
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div
            ref={invoiceRef}
            className="w-2xl mx-auto p-1 bg-white overflow-y-auto h-[calc(90vh-120px)] scrollbar-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="flex justify-between mb-2">
              <div className="text-sm">
                <p className="font-semibold">
                  Nhà: {invoiceData?.ThuePhong?.PhongTro?.Nha?.TenNha}
                </p>
                <p>{invoiceData?.ThuePhong?.PhongTro?.Nha?.DiaChi}</p>
              </div>
              <div className="text-sm text-right">
                {invoiceData?.NgayLap
                  ? format(new Date(invoiceData.NgayLap), "dd/MM/yyyy")
                  : ""}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-blue-900 mb-2">
              HÓA ĐƠN TIỀN NHÀ
            </h1>

            <div className="text-center mb-4">
              <p className="font-medium">Tháng {monthYear}</p>
              <p className="text-sm">
                (từ ngày {firstDay} đến ngày {lastDay})
              </p>
            </div>

            <div className="mb-6">
              <p>
                <span className="font-medium">Họ và tên:</span>{" "}
                {invoiceData?.ThuePhong?.KhachHang?.HoTen}
              </p>
              <p>
                <span className="font-medium">Phòng:</span>{" "}
                {invoiceData?.ThuePhong?.PhongTro?.TenPhong}
              </p>
              <p>
                <span className="font-medium">Ngày vào:</span>{" "}
                {invoiceData?.ThuePhong?.NgayBatDau
                  ? format(
                      new Date(invoiceData.ThuePhong.NgayBatDau),
                      "dd/MM/yyyy"
                    )
                  : ""}
              </p>
            </div>

            <div className="mb-6">
              {charges.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-1 border-b border-gray-100"
                >
                  <div>
                    {item.id}. {item.description}
                  </div>
                  <div className="text-right font-medium">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-800">
                <div className="text-blue-900">TỔNG CỘNG</div>
                <div className="text-right">
                  {formatCurrency(invoiceData?.TongTien || 0)}
                </div>
              </div>
              <div className="text-center italic text-sm font-semibold">
                ( Bằng chữ: {numberToText(invoiceData?.TongTien)} )
              </div>
            </div>

            <div className="bg-gray-100 p-3 rounded-md">
              <h3 className="font-bold mb-2">Thông tin số tài khoản</h3>
              <p>
                <span className="font-medium">Ngân hàng:</span>{" "}
                {displayBank || "Chưa nhập"}
              </p>
              <p>
                <span className="font-medium">Số tài khoản:</span>{" "}
                {displayAccountNumber || "Chưa nhập"}
              </p>
              <p>
                <span className="font-medium">Số điện thoại liên hệ:</span>{" "}
                {displayPhone}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="pt-4">
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="rounded cursor-pointer">
                <Button className="bg-blue-500  text-white flex items-center">
                  Xuất file
                  <IoIosArrowDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded">
                <DropdownMenuItem
                  className={` rounded-xs ${
                    imageLoading ? "cursor-no-drop" : "cursor-pointer"
                  }`}
                  onClick={exportAsImage}
                >
                  {imageLoading ? "Đang xuất ảnh ..." : "Xuất ảnh"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`rounded-xs ${
                    pdfLoading ? "cursor-no-drop" : "cursor-pointer"
                  }`}
                  onClick={exportAsPDF}
                >
                  {pdfLoading ? "Đang xuất PDF..." : "Xuất PDF"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={sendInvoice}
              className={` rounded flex items-center bg-blue-500 ${
                loading ? "cursor-no-drop" : "cursor-pointer"
              }`}
              disable={loading}
            >
              {loading ? "Đang gửi ..." : "Gửi hóa đơn"}
              <Send className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded"
              variant="destructive"
            >
              Đóng
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalViewInvoice;
