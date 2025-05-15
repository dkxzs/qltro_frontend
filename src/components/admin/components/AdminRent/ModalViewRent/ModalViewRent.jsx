import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency, numberToText } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { Download, Eye } from "lucide-react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ModalViewRent = ({ open, setOpen, rentData }) => {
  const contractRef = useRef(null);
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
  const replacePlaceholders = (text) => {
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
        format(personalInfo.NgaySinh, "yyyy") || "[Năm sinh]"
      )
      .replace("[CCCDCT]", personalInfo.CCCD || "[Số CCCD]")
      .replace(
        "[NgayCapCT]",
        format(personalInfo.NgayCap, "dd/MM/yyyy") || "[Ngày cấp]"
      )
      .replace("[NoiCapCT]", personalInfo.NoiCap || "[Nơi cấp]")
      .replace("[DiaChiCT]", personalInfo.DiaChi || "[Địa chỉ chủ trọ]")
      .replace("[DienThoaiCT]", personalInfo.DienThoai || "[Số điện thoại]")
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
    template && Object.keys(template).length > 0 ? template : "";

  const handleDownloadWord = async () => {
    try {
      const province = extractProvince(rentData.PhongTro?.Nha?.DiaChi);
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Header
              ...safeTemplate.header.preamble.map(
                (line, index) =>
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: replacePlaceholders(line),
                        bold: index === 0,
                        size: index === 0 ? 28 : 26,
                      }),
                    ],
                  })
              ),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: replacePlaceholders(safeTemplate.header.title),
                    bold: true,
                    size: 32,
                  }),
                ],
                spacing: { before: 400, after: 400 },
              }),

              // Thêm thông tin hợp đồng
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: replacePlaceholders(safeTemplate.header.contractInfo),
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),

              // Thêm căn cứ pháp lý
              ...safeTemplate.header.legalBasis.map(
                (basis) =>
                  new Paragraph({
                    children: [new TextRun(replacePlaceholders(basis))],
                    spacing: { after: 100 },
                  })
              ),

              // Bên A
              new Paragraph({
                children: [
                  new TextRun({
                    text: replacePlaceholders(safeTemplate.benA.title),
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              ...safeTemplate.benA.details.map(
                (detail) =>
                  new Paragraph({
                    children: [new TextRun(replacePlaceholders(detail))],
                    indent: { left: 720 },
                  })
              ),
              new Paragraph({ spacing: { after: 200 } }),

              // Bên B
              new Paragraph({
                children: [
                  new TextRun({
                    text: replacePlaceholders(safeTemplate.benB.title),
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              ...safeTemplate.benB.details.map(
                (detail) =>
                  new Paragraph({
                    children: [new TextRun(replacePlaceholders(detail))],
                    indent: { left: 720 },
                  })
              ),
              new Paragraph({ spacing: { after: 200 } }),

              // Thỏa thuận
              new Paragraph({
                children: [
                  new TextRun(replacePlaceholders(safeTemplate.thoaThuan)),
                ],
                spacing: { after: 200 },
              }),

              // Điều khoản
              ...safeTemplate.dieuKhoan.flatMap((dieu) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: replacePlaceholders(dieu.title),
                      bold: true,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                ...dieu.items.map(
                  (item) =>
                    new Paragraph({
                      children: [new TextRun(`• ${replacePlaceholders(item)}`)],
                      indent: { left: 720 },
                    })
                ),
                new Paragraph({ spacing: { after: 200 } }),
              ]),

              // Footer
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun(
                    `${replacePlaceholders(
                      province
                    )}, Ngày ${replacePlaceholders(safeTemplate.footer.date)}`
                  ),
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
                    children: safeTemplate.footer.signatures.map(
                      (sig) =>
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
                                  text: replacePlaceholders(sig.party),
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
                        })
                    ),
                  }),
                  new TableRow({
                    children: safeTemplate.footer.signatures.map(
                      () =>
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
                        })
                    ),
                    height: { value: 1000 },
                  }),
                  new TableRow({
                    children: safeTemplate.footer.signatures.map(
                      (sig) =>
                        new TableCell({
                          width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                          },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun(replacePlaceholders(sig.note)),
                              ],
                            }),
                          ],
                          borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                          },
                        })
                    ),
                  }),
                ],
              }),
            ],
          },
        ],
      });

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

  // Lấy tỉnh/thành phố từ địa chỉ nhà
  const province = extractProvince(rentData.PhongTro?.Nha?.DiaChi);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-transparent outline-none border-none shadow-none rounded-none cursor-pointer hover:text-white"
          onClick={() => setOpen(true)}
        >
          <Eye className="size-5 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[95vh] rounded overflow-hidden"
        aria-describedby={undefined}
      >
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
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            {/* Header */}
            <div className="text-center mb-6">
              {(safeTemplate.header?.preamble || []).map((line, index) => (
                <p
                  key={index}
                  className={
                    index === 0 ? "uppercase font-bold text-lg" : "font-medium"
                  }
                >
                  {replacePlaceholders(line)}
                </p>
              ))}
              <h1 className="uppercase font-bold text-xl mt-4">
                {replacePlaceholders(safeTemplate.header?.title || "")}
              </h1>
              <p className="text-lg mt-1 font-semibold">
                {replacePlaceholders(safeTemplate.header?.contractInfo || "")}
              </p>
              <div className="mt-5">
                {(safeTemplate.header?.legalBasis || []).map((line, index) => {
                  return (
                    <p key={index} className="text-left">
                      {replacePlaceholders(line)}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Bên A */}
            <div className="mb-4">
              <p className="font-bold">
                {replacePlaceholders(safeTemplate.benA?.title || "")}
              </p>
              <div className="ml-4 mt-2 space-y-2">
                {(safeTemplate.benA?.details || []).map((detail, index) => (
                  <p key={index}>{replacePlaceholders(detail)}</p>
                ))}
              </div>
            </div>

            {/* Bên B */}
            <div className="mb-4">
              <p className="font-bold">
                {replacePlaceholders(safeTemplate.benB?.title || "")}
              </p>
              <div className="ml-4 mt-2 space-y-2">
                {(safeTemplate.benB?.details || []).map((detail, index) => (
                  <p key={index}>{replacePlaceholders(detail)}</p>
                ))}
              </div>
            </div>

            <p className="mb-4">
              {replacePlaceholders(safeTemplate.thoaThuan || "")}
            </p>

            {/* Điều khoản */}
            {(safeTemplate.dieuKhoan || []).map((dieu, index) => (
              <div key={index} className="mb-4">
                <p className="font-bold">{replacePlaceholders(dieu.title)}</p>
                <ul className="list-disc ml-8 mt-2 space-y-2">
                  {(dieu.items || []).map((item, idx) => (
                    <li key={idx}>{replacePlaceholders(item)}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Footer */}
            <div className="mt-8 text-right">
              <p>
                {replacePlaceholders(province)}, Ngày{" "}
                {replacePlaceholders(safeTemplate.footer.date)}
              </p>
              <div className="flex justify-between mt-4">
                {(safeTemplate.footer?.signatures || []).map((sig, index) => (
                  <div key={index} className="text-center">
                    <p className="font-bold">
                      {replacePlaceholders(sig.party)}
                    </p>
                    <p className="mt-16">{replacePlaceholders(sig.note)}</p>
                  </div>
                ))}
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
              <Download className="size-4" />
              Tải xuống
            </Button>
          </div>
          <Button
            onClick={() => setOpen(false)}
            className="text-white rounded cursor-pointer"
            variant="destructive"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalViewRent;
