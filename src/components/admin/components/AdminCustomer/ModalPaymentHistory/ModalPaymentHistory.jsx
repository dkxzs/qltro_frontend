import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { paymentHistoryService } from "@/services/customerServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import { FaRegMoneyBillAlt } from "react-icons/fa";

const ModalPaymentHistory = ({ dataPayment }) => {
  const [open, setOpen] = useState(false);

  const {
    data: paymentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["paymentHistory", dataPayment?.MaKT],
    queryFn: () => paymentHistoryService(dataPayment?.MaKT),
    enabled: open && dataPayment?.MaKT !== undefined,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const formatVietnameseDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Xem lịch sử thanh toán"
        >
          <FaRegMoneyBillAlt className="size-4 text-blue-700" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="w-4/5 max-w-4xl rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Lịch sử thanh toán</DialogTitle>
          <DialogDescription>
            Thông tin lịch sử thanh toán của khách hàng. Dữ liệu được sắp xếp
            theo thời gian.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="text-center text-muted-foreground">Đang tải...</div>
        )}
        {error && (
          <div className="text-center text-red-600">
            Lỗi: {error.message || "Không thể tải lịch sử thanh toán"}
          </div>
        )}

        {!isLoading && !error && (
          <div className="max-h-[70vh] overflow-y-auto rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">Stt</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Mô tả</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentData?.DT && paymentData.DT.length > 0 ? (
                  paymentData.DT.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>
                        {item.HoTen || dataPayment?.HoTen || "Không xác định"}
                      </TableCell>
                      <TableCell>
                        {formatVietnameseDate(item.NgayThanhToan)}
                      </TableCell>
                      <TableCell>{formatCurrency(item.SoTien)}</TableCell>
                      <TableCell>
                        Thanh toán tiền phòng {item.TenPhong} - {item.TenNha} -
                        tháng {new Date(item.NgayThanhToan).getMonth() + 1} năm{" "}
                        {new Date(item.NgayThanhToan).getFullYear()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      Không có lịch sử thanh toán.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            className="rounded cursor-pointer"
            onClick={handleClose}
            variant="destructive"
            aria-label="Đóng lịch sử thanh toán"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPaymentHistory;
