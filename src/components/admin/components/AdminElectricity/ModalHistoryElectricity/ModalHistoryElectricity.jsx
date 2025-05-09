// File: components/ModalHistoryElectricity/ModalHistoryElectricity.jsx
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
import { Label } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getElectricWaterByRoomAndMonthService } from "@/services/electricWaterServices";
import { Button } from "@/components/ui/button";

const ModalHistoryElectricity = ({
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

  const {
    data: selectedMonthData,
    refetch: fetchMonthData,
    isLoading: isFetchingMonth,
  } = useQuery({
    queryKey: ["electric-by-month", MaPT, MaDV, selectedMonthYear],
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

  // Hiển thị dữ liệu: giữ dữ liệu cũ (historyData) trong khi đang tải
  const displayData = selectedMonthYear
    ? isFetchingMonth
      ? historyData || [] // Giữ dữ liệu cũ trong khi đang tải
      : selectedMonthData?.DT
      ? [selectedMonthData.DT] // Hiển thị dữ liệu của tháng được chọn
      : [] // Nếu không có dữ liệu, để mảng rỗng
    : historyData || []; // Nếu không chọn tháng, hiển thị toàn bộ lịch sử

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            Lịch sử chỉ số điện - Phòng {roomName} (Nhà {houseName})
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <Label className="text-md">Tháng/Năm</Label>
          <Input
            type="month"
            value={selectedMonthYear}
            onChange={handleMonthYearChange}
            className="rounded w-4/12 shadow-none"
          />
        </div>
        <div className="mt-4">
          {isFetchingMonth ? (
            <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
          ) : displayData.length === 0 ? (
            <p className="text-center text-gray-500">
              Không có dữ liệu lịch sử
            </p>
          ) : (
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
                {displayData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      {String(record.Thang).padStart(2, "0")}/{record.Nam}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.ChiSoCu}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.ChiSoMoi}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.ChiSoMoi - record.ChiSoCu}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer rounded"
            onClick={() => onOpenChange(false)}
            variant="destructive"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalHistoryElectricity;
