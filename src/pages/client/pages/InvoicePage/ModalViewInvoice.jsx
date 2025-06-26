import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getInvoiceByIdService } from "@/services/invoiceServices";
import { formatCurrency, numberToText } from "@/utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

const ModalViewInvoice = ({ invoiceId }) => {
  const [open, setOpen] = useState(false);
  const invoiceRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoiceByIdService(invoiceId),
    enabled: open && !!invoiceId,
  });

  const invoiceData = data?.DT?.invoice || {};
  const invoiceDetails = data?.DT?.invoiceDetails || [];
  const dienNuoc = data?.DT?.dienNuoc || [];

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
                {invoiceData?.ThuePhong?.KhachTro?.HoTen}
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

            <div className="mb-2">
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
          </div>
        )}

        <DialogFooter>
          <div className="flex justify-end gap-2">
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
