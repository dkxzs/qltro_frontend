import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllRentService } from "@/services/rentServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useState } from "react";
import ModalViewRent from "../ModalViewRent/ModalViewRent";
import { getStatusText } from "@/utils/rentStatusUtils";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const TableRent = ({ filteredData }) => {
  const [selectedRent, setSelectedRent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: rentData, isLoading } = useQuery({
    queryKey: ["rent-list"],
    queryFn: getAllRentService,
  });

  const handleViewRent = (rent) => {
    setSelectedRent(rent);
    setIsViewModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="text-gray-600 text-sm">Đang tải dữ liệu...</span>
      </div>
    );
  }

  const displayData = filteredData || rentData?.DT || [];

  return (
    <>
      <div className="rounded border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-[10%]  py-2">Mã HĐ</TableHead>
                <TableHead className="w-[15%]  py-2">Khách trọ</TableHead>
                <TableHead className="w-[12%]  py-2">Phòng</TableHead>
                <TableHead className="w-[12%]  py-2">Nhà</TableHead>
                <TableHead className="w-[12%]  py-2">Ngày bắt đầu</TableHead>
                <TableHead className="w-[12%]  py-2">Ngày kết thúc</TableHead>
                <TableHead className="w-[12%]  py-2">Đơn giá (VNĐ)</TableHead>
                <TableHead className="w-[10%]  py-2">Trạng thái</TableHead>
                <TableHead className="w-[7%] min-w-[4rem]  py-2 text-right">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length > 0 ? (
                displayData.map((rent) => (
                  <TableRow
                    key={rent.MaTP}
                    className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
                  >
                    <TableCell className="py-2">
                      HD{rent.MaTP.toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell className="text-gray-700 py-2 truncate">
                      {rent.KhachHang?.HoTen}
                    </TableCell>
                    <TableCell className="text-gray-700 py-2 truncate">
                      {rent.PhongTro?.TenPhong}
                    </TableCell>
                    <TableCell className="text-gray-700 py-2 truncate">
                      {rent.PhongTro?.Nha?.TenNha}
                    </TableCell>
                    <TableCell className="text-gray-700 py-2">
                      {formatDate(rent.NgayBatDau)}
                    </TableCell>
                    <TableCell className="text-gray-700 py-2">
                      {formatDate(rent.NgayKetThuc)}
                    </TableCell>
                    <TableCell className="text-gray-700 py-2">
                      {formatCurrency(rent.DonGia)}
                    </TableCell>
                    <TableCell className="text-gray-700 py-2">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded font-medium ${
                          rent.TrangThai === "Hoạt động"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStatusText(rent.TrangThai)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <div className="flex justify-end">
                        <Button
                          className="bg-transparent border-none rounded-none shadow-none outline-none cursor-pointer"
                          onClick={() => handleViewRent(rent)}
                        >
                          <Eye className="size-4 text-blue-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-gray-500"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedRent && (
        <ModalViewRent
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          rentData={selectedRent}
        />
      )}
    </>
  );
};

export default TableRent;
