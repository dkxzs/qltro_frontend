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
import { historyCustomerRentService } from "@/services/customerServices";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns"; // Import hàm format từ date-fns
import { vi } from "date-fns/locale"; // Import locale tiếng Việt (nếu cần hỗ trợ tiếng Việt)

const ModalRentHistory = ({ dataHistory }) => {
  const [open, setOpen] = useState(false);

  const {
    data: historyData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["history", dataHistory?.MaKH],
    queryFn: () => historyCustomerRentService(dataHistory?.MaKH),
    enabled: dataHistory?.MaKH !== undefined,
  });

  const handleClose = () => {
    setOpen(false);
  };

  console.log("dataHistory", dataHistory);

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
          aria-label="Xem lịch sử thuê phòng"
        >
          <History className="size-4 text-orange-600" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="w-4/5 max-w-4xl rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Lịch sử thuê phòng</DialogTitle>
          <DialogDescription>
            Thông tin lịch sử thuê phòng của khách hàng. Dữ liệu được sắp xếp
            theo thời gian.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="text-center text-muted-foreground">Đang tải...</div>
        )}
        {error && (
          <div className="text-center text-red-600">
            Lỗi: {error.message || "Không thể tải lịch sử"}
          </div>
        )}

        {!isLoading && !error && (
          <div className="max-h-[60vh] overflow-y-auto rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center">Stt</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Nhà</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Hành động</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData?.DT && historyData.DT.length > 0 ? (
                  historyData.DT.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>
                        {dataHistory.HoTen || "Không xác định"}
                      </TableCell>
                      <TableCell>
                        {item.PhongTro?.Nha?.TenNha || "Không xác định"}
                      </TableCell>
                      <TableCell>
                        {item.PhongTro?.TenPhong || "Không xác định"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.TrangThai === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.TrangThai === 1 ? "Đang thuê" : "Trả phòng"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatVietnameseDate(item.NgayBatDau)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      Không có lịch sử thuê phòng.
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
            aria-label="Đóng lịch sử thuê phòng"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRentHistory;
