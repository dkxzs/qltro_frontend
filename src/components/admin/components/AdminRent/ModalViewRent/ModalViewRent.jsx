import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatCurrency";
import { Download } from "lucide-react";
import { useRef } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const ModalViewRent = ({ open, onOpenChange, rentData }) => {
  const contractRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const calculateMonths = (startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return months;
  };

  const getCurrentDate = () => {
    return format(new Date(), "dd 'tháng' MM 'năm' yyyy", { locale: vi });
  };

  const handleDownloadWord = async () => {
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Header
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                    bold: true,
                    size: 28,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Độc Lập-Tự Do-Hạnh Phúc",
                    size: 26,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun("---oOo---")],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ",
                    bold: true,
                    size: 32,
                  }),
                ],
                spacing: { before: 400, after: 400 },
              }),

              // Bên A
              new Paragraph({
                children: [
                  new TextRun({
                    text: "BÊN A : BÊN CHO THUÊ PHÒNG TRỌ",
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [new TextRun("Họ và Tên: Nguyễn Văn A")],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [new TextRun("Năm sinh: 1980")],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "CCCD số: 123456789012 Ngày cấp: 01/01/2020 Nơi cấp: Cục Cảnh sát quản lý hành chính về trật tự xã hội"
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    `Thường Trú: ${rentData.PhongTro?.Nha?.DiaChi || ""}`
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [new TextRun("Số điện thoại: 0987654321")],
                indent: { left: 720 },
                spacing: { after: 200 },
              }),

              // Bên B
              new Paragraph({
                children: [
                  new TextRun({
                    text: "BÊN B : BÊN THUÊ PHÒNG TRỌ",
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun(`Họ và Tên: ${rentData.KhachHang?.HoTen || ""}`),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    `Năm sinh: ${
                      rentData.KhachHang?.NgaySinh
                        ? format(new Date(rentData.KhachHang.NgaySinh), "yyyy")
                        : ""
                    }`
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    `CCCD số: ${rentData.KhachHang?.CCCD || ""} Ngày cấp: ${
                      rentData.KhachHang?.NgayCap
                        ? formatDate(rentData.KhachHang.NgayCap)
                        : ""
                    } Nơi cấp: ${rentData.KhachHang?.NoiCap || ""}`
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    `Thường Trú: ${rentData.KhachHang?.DiaChi || ""}`
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    `Số điện thoại: ${rentData.KhachHang?.DienThoai || ""}`
                  ),
                ],
                indent: { left: 720 },
                spacing: { after: 200 },
              }),

              new Paragraph({
                children: [
                  new TextRun(
                    "Hai bên cùng thỏa thuận và đồng ý với nội dung sau :"
                  ),
                ],
                spacing: { after: 200 },
              }),

              // Điều 1
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Điều 1:",
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    `• Bên A đồng ý cho bên B thuê một phòng trọ thuộc địa chỉ: ${
                      rentData.PhongTro?.TenPhong || ""
                    }, ${rentData.PhongTro?.Nha?.TenNha || ""}, ${
                      rentData.PhongTro?.Nha?.DiaChi || ""
                    }`
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    `• Thời hạn thuê phòng trọ là ${calculateMonths(
                      rentData.NgayBatDau,
                      rentData.NgayKetThuc
                    )} tháng kể từ ngày ${formatDate(rentData.NgayBatDau)}`
                  ),
                ],
                indent: { left: 720 },
                spacing: { after: 200 },
              }),

              // Điều 2
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Điều 2:",
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    `• Giá tiền thuê phòng trọ là ${formatCurrency(
                      rentData.DonGia
                    )}/tháng (Bằng chữ: Một triệu hai trăm nghìn đồng)`
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Tiền thuê phòng trọ bên B thanh toán cho bên A từ ngày 05 hàng tháng."
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Bên B đặt tiền thế chân trước 2,000,000 đồng (Bằng chữ: Hai triệu đồng) cho bên A. Tiền thế chân sẽ được trả lại đầy đủ cho bên thuê (Bên B) khi hết hợp đồng thuê phòng trọ và thanh toán đầy đủ tiền điện, nước, phí dịch vụ và các khoản khác liên quan."
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Bên B ngưng hợp đồng trước thời hạn thì phải chịu mất tiền thế chân."
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Bên A ngưng hợp đồng (lấy lại phòng trọ) trước thời hạn thì bồi thường gấp đôi số tiền bên B đã thế chân."
                  ),
                ],
                indent: { left: 720 },
                spacing: { after: 200 },
              }),

              // Điều 3
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Điều 3: Trách nhiệm bên A.",
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Giao phòng trọ, trang thiết bị trong phòng trọ cho bên B đúng ngày ký hợp đồng."
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Hướng dẫn bên B chấp hành đúng các quy định của địa phương, hoàn tất mọi thủ tục giấy tờ đăng ký tạm trú cho bên B."
                  ),
                ],
                indent: { left: 720 },
                spacing: { after: 200 },
              }),

              // Điều 4
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Điều 4: Trách nhiệm bên B.",
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Trả tiền thuê phòng trọ hàng tháng theo hợp đồng."
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Sử dụng đúng mục đích thuê nhà, khi cần sửa chữa, cải tạo theo yêu cầu sử dụng riêng phải được sự đồng ý của bên A."
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Đồ đạt trang thiết bị trong phòng trọ phải có trách nhiệm bảo quản cẩn thận không làm hư hỏng mất mát."
                  ),
                ],
                indent: { left: 720 },
                spacing: { after: 200 },
              }),

              // Điều 5
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Điều 5: Điều khoản chung.",
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Bên A và bên B thực hiện đúng các điều khoản ghi trong hợp đồng."
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Trường hợp có tranh chấp hoặc một bên vi phạm hợp đồng thì hai bên cùng nhau bàn bạc giải quyết, nếu không giải quyết được thì yêu cầu cơ quan có thẩm quyền giải quyết."
                  ),
                ],
                indent: { left: 720 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    "• Hợp đồng được lập thành 02 bản có giá trị ngang nhau, mỗi bên giữ 01 bản"
                  ),
                ],
                indent: { left: 720 },
                spacing: { after: 400 },
              }),

              // Footer
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun(`Tp. Hồ Chí Minh, Ngày ${getCurrentDate()}`),
                ],
                spacing: { before: 400, after: 400 },
              }),

              // Chữ ký
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "BÊN A",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                      }),
                      new TableCell({
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "BÊN B",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph({ text: "" })],
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                      }),
                      new TableCell({
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE,
                        },
                        children: [new Paragraph({ text: "" })],
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                      }),
                    ],
                    height: { value: 1000 },
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun("(Ký và ghi rõ họ tên)")],
                          }),
                        ],
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                      }),
                      new TableCell({
                        width: {
                          size: 50,
                          type: WidthType.PERCENTAGE,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun("(Ký và ghi rõ họ tên)")],
                          }),
                        ],
                        borders: {
                          top: { style: BorderStyle.NONE },
                          bottom: { style: BorderStyle.NONE },
                          left: { style: BorderStyle.NONE },
                          right: { style: BorderStyle.NONE },
                        },
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        ],
      });

      // Tạo file và tải xuống
      Packer.toBlob(doc).then((blob) => {
        saveAs(
          blob,
          `Hop_dong_thue_phong_${rentData.KhachHang?.HoTen || ""}.docx`
        );
        toast.success("Tải xuống hợp đồng thành công!");
      });
    } catch (error) {
      console.error("Lỗi khi tạo file Word:", error);
      toast.error("Có lỗi xảy ra khi tạo file Word!");
    }
  };

  if (!rentData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] rounded overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Hợp đồng thuê phòng trọ
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div
            ref={contractRef}
            className="contract-container p-6 border-2 rounded bg-white overflow-y-auto max-h-[70vh] scrollbar-hide"
          >
            <style>
              {`
                .scrollbar-hide {
                  -ms-overflow-style: none; /* IE and Edge */
                  scrollbar-width: none; /* Firefox */
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none; /* Chrome, Safari, and Opera */
                }
              `}
            </style>

            {/* Header */}
            <div className="text-center mb-6">
              <p className="uppercase font-bold text-lg">
                CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p className="font-medium">Độc Lập-Tự Do-Hạnh Phúc</p>
              <p className="my-2">---oOo---</p>
              <h1 className="uppercase font-bold text-xl mt-4">
                HỢP ĐỒNG CHO THUẺ PHÒNG TRỌ
              </h1>
            </div>

            {/* Bên A */}
            <div className="mb-4">
              <p className="font-bold">BÊN A : BÊN CHO THUÊ PHÒNG TRỌ</p>
              <div className="ml-4 mt-2 space-y-2">
                <p>Họ và Tên: Nguyễn Văn A</p>
                <p>Năm sinh: 1980</p>
                <p>
                  CCCD số: 123456789012 Ngày cấp: 01/01/2020 Nơi cấp: Cục Cảnh
                  sát quản lý hành chính về trật tự xã hội
                </p>
                <p>Thường Trú: Xuân Phương, Nam Từ Liêm, Hà Nội</p>
                <p>Số điện thoại: 0987654321</p>
              </div>
            </div>

            {/* Bên B */}
            <div className="mb-4">
              <p className="font-bold">BÊN B : BÊN THUÊ PHÒNG TRỌ</p>
              <div className="ml-4 mt-2 space-y-2">
                <p>Họ và Tên: {rentData.KhachHang?.HoTen || ""}</p>
                <p>
                  Năm sinh:{" "}
                  {rentData.KhachHang?.NgaySinh
                    ? format(new Date(rentData.KhachHang.NgaySinh), "yyyy")
                    : ""}
                </p>
                <p>
                  CCCD số: {rentData.KhachHang?.CCCD || ""} Ngày cấp:{" "}
                  {rentData.KhachHang?.NgayCap
                    ? formatDate(rentData.KhachHang.NgayCap)
                    : ""}{" "}
                  Nơi cấp: {rentData.KhachHang?.NoiCap || ""}
                </p>
                <p>Thường Trú: {rentData.KhachHang?.DiaChi || ""}</p>
                <p>Số điện thoại: {rentData.KhachHang?.DienThoai || ""}</p>
              </div>
            </div>

            <p className="mb-4">
              Hai bên cùng thỏa thuận và đồng ý với nội dung sau :
            </p>

            {/* Điều 1 */}
            <div className="mb-4">
              <p className="font-bold">Điều 1:</p>
              <ul className="list-disc ml-8 mt-2 space-y-2">
                <li>
                  Bên A đồng ý cho bên B thuê một phòng trọ thuộc địa chỉ:{" "}
                  {rentData.PhongTro?.TenPhong || ""},{" "}
                  {rentData.PhongTro?.Nha?.TenNha || ""},{" "}
                  {rentData.PhongTro?.Nha?.DiaChi || ""}
                </li>
                <li>
                  Thời hạn thuê phòng trọ là{" "}
                  {calculateMonths(rentData.NgayBatDau, rentData.NgayKetThuc)}{" "}
                  tháng kể từ ngày {formatDate(rentData.NgayBatDau)}
                </li>
              </ul>
            </div>

            {/* Điều 2 */}
            <div className="mb-4">
              <p className="font-bold">Điều 2:</p>
              <ul className="list-disc ml-8 mt-2 space-y-2">
                <li>
                  Giá tiền thuê phòng trọ là {formatCurrency(rentData.DonGia)}
                  /tháng (Bằng chữ: Một triệu hai trăm nghìn đồng)
                </li>
                <li>
                  Tiền thuê phòng trọ bên B thanh toán cho bên A từ ngày 05 hàng
                  tháng.
                </li>
                <li>
                  Bên B đặt tiền thế chân trước 2,000,000 đồng (Bằng chữ: Hai
                  triệu đồng) cho bên A. Tiền thế chân sẽ được trả lại đầy đủ
                  cho bên thuê (Bên B) khi hết hợp đồng thuê phòng trọ và thanh
                  toán đầy đủ tiền điện, nước, phí dịch vụ và các khoản khác
                  liên quan.
                </li>
                <li>
                  Bên B ngưng hợp đồng trước thời hạn thì phải chịu mất tiền thế
                  chân.
                </li>
                <li>
                  Bên A ngưng hợp đồng (lấy lại phòng trọ) trước thời hạn thì
                  bồi thường gấp đôi số tiền bên B đã thế chân.
                </li>
              </ul>
            </div>

            {/* Điều 3 */}
            <div className="mb-4">
              <p className="font-bold">Điều 3: Trách nhiệm bên A.</p>
              <ul className="list-disc ml-8 mt-2 space-y-2">
                <li>
                  Giao phòng trọ, trang thiết bị trong phòng trọ cho bên B đúng
                  ngày ký hợp đồng.
                </li>
                <li>
                  Hướng dẫn bên B chấp hành đúng các quy định của địa phương,
                  hoàn tất mọi thủ tục giấy tờ đăng ký tạm trú cho bên B.
                </li>
              </ul>
            </div>

            {/* Điều 4 */}
            <div className="mb-4">
              <p className="font-bold">Điều 4: Trách nhiệm bên B.</p>
              <ul className="list-disc ml-8 mt-2 space-y-2">
                <li>Trả tiền thuê phòng trọ hàng tháng theo hợp đồng.</li>
                <li>
                  Sử dụng đúng mục đích thuê nhà, khi cần sửa chữa, cải tạo theo
                  yêu cầu sử dụng riêng phải được sự đồng ý của bên A.
                </li>
                <li>
                  Đồ đạt trang thiết bị trong phòng trọ phải có trách nhiệm bảo
                  quản cẩn thận không làm hư hỏng mất mát.
                </li>
              </ul>
            </div>

            {/* Điều 5 */}
            <div className="mb-4">
              <p className="font-bold">Điều 5: Điều khoản chung.</p>
              <ul className="list-disc ml-8 mt-2 space-y-2">
                <li>
                  Bên A và bên B thực hiện đúng các điều khoản ghi trong hợp
                  đồng.
                </li>
                <li>
                  Trường hợp có tranh chấp hoặc một bên vi phạm hợp đồng thì hai
                  bên cùng nhau bàn bạc giải quyết, nếu không giải quyết được
                  thì yêu cầu cơ quan có thẩm quyền giải quyết.
                </li>
                <li>
                  Hợp đồng được lập thành 02 bản có giá trị ngang nhau, mỗi bên
                  giữ 01 bản
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-8 text-right">
              <p>Tp. Hồ Chí Minh, Ngày {getCurrentDate()}</p>
              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <p className="font-bold">BÊN A</p>
                  <p className="mt-16">(Ký và ghi rõ họ tên)</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">BÊN B</p>
                  <p className="mt-16">(Ký và ghi rõ họ tên)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end mb-2">
            <Button
              onClick={handleDownloadWord}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Tải xuống
            </Button>
          </div>
          <Button
            onClick={() => {
              onOpenChange(false);
            }}
            className="text-white rounded cursor-pointer"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalViewRent;
