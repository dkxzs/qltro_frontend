import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getElectricWaterByRoomAndMonthService } from "@/services/electricWaterServices";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ModalHistoryWater = ({
  open,
  onOpenChange,
  historyData,
  roomName,
  houseName,
  MaPT,
  MaDV,
}) => {
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [year, month] = selectedMonthYear
    ? selectedMonthYear.split("-").map(Number)
    : [null, null];
  const { data: selectedMonthData, refetch: fetchMonthData } = useQuery({
    queryKey: ["water-by-month", roomName, houseName, selectedMonthYear],
    queryFn: () => {
      if (!month || !year || isNaN(month) || isNaN(year)) {
        throw new Error("Tháng hoặc năm không hợp lệ");
      }
      return getElectricWaterByRoomAndMonthService(MaPT, MaDV, month, year);
    },
    enabled: !!selectedMonthYear && !!MaPT && !!MaDV && !!month && !!year,
  });

  const handleMonthYearChange = (e) => {
    const value = e.target.value;
    setSelectedMonthYear(value);
    if (value) {
      fetchMonthData(); // Gọi API để lấy dữ liệu của tháng được chọn
    }
  };

  const displayData = selectedMonthYear
    ? selectedMonthData?.DT
      ? [selectedMonthData.DT] // Hiển thị dữ liệu của tháng được chọn (chuyển thành mảng để map)
      : [] // Nếu không có dữ liệu, để mảng rỗng (sẽ hiển thị mặc định trong bảng)
    : historyData || []; // Nếu không chọn tháng, hiển thị toàn bộ lịch sử

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded w-3/5">
        <DialogHeader>
          <DialogTitle>
            Lịch sử chỉ số nước - Phòng {roomName} - Nhà {houseName}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <Label className="mr-2">Chọn tháng:</Label>
            <Input
              type="month"
              value={selectedMonthYear}
              onChange={handleMonthYearChange}
              className="w-3/12"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Tháng/Năm</TableHead>
                <TableHead className="text-center">Chỉ số cũ</TableHead>
                <TableHead className="text-center">Chỉ số mới</TableHead>
                <TableHead className="text-center">Tiêu thụ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {item.Thang}/{item.Nam}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.ChiSoCu}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.ChiSoMoi}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.ChiSoMoi - item.ChiSoCu}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer rounded"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalHistoryWater;
