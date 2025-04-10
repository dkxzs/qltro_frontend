import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ModalUpdateRoom from "../ModalUpdateRoom/ModalUpdateRoom";
import ModalDeleteRoom from "../ModalDeleteRoom/ModalDeleteRoom";

const TableRoom = ({ roomData, refetch }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-green-100 text-green-800";
      case 1:
        return "bg-blue-100 text-red-800";
      case 2:
        return "bg-red-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Còn trống";
      case 1:
        return "Đã cho thuê";
      case 2:
        return "Đang sửa chữa";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="w-full">
      <Table className="w-full table-fixed border-collapse">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-3 px-2 text-center w-[5%] min-w-[40px]">
              STT
            </TableHead>
            <TableHead className="py-3 px-4 text-left w-[15%] min-w-[100px]">
              Tên phòng
            </TableHead>
            <TableHead className="py-3 px-2 text-left w-[15%] min-w-[100px]">
              Loại phòng
            </TableHead>
            <TableHead className="py-3 px-2 text-left w-[10%] min-w-[60px]">
              Diện tích (m²)
            </TableHead>
            <TableHead className="py-3 px-3 text-left w-[15%] min-w-[100px]">
              Giá phòng
            </TableHead>
            <TableHead className="py-3 px-2 text-left w-[25%] min-w-[150px]">
              Mô tả
            </TableHead>
            <TableHead className="py-3 px-2 text-center w-[15%] min-w-[100px]">
              Trạng thái
            </TableHead>
            <TableHead className="py-3 px-2 text-center w-[10%] min-w-[100px]">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roomData && roomData.length > 0 ? (
            roomData.map((room, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-blue-50" : ""}
              >
                <TableCell className="py-2 px-2 text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="py-2 px-5 truncate">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>{room.TenPhong}</TooltipTrigger>
                      <TooltipContent>{room.TenPhong}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-2 px-2 truncate">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {room.LoaiPhong.TenLoaiPhong}
                      </TooltipTrigger>
                      <TooltipContent>
                        {room.LoaiPhong.TenLoaiPhong}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-2 px-2 text-center">
                  {room.DienTich}
                </TableCell>
                <TableCell className="py-2 px-2 truncate">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {room.LoaiPhong?.DonGia
                          ? formatPrice(room.LoaiPhong?.DonGia)
                          : "N/A"}
                      </TooltipTrigger>
                      <TooltipContent>
                        {room.LoaiPhong?.DonGia
                          ? formatPrice(room.LoaiPhong?.DonGia)
                          : "N/A"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-2 px-2 truncate">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>{room.MoTa}</TooltipTrigger>
                      <TooltipContent>{room.MoTa}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-2 px-2">
                  <div className="flex justify-center">
                    <div
                      className={`px-2 py-1 rounded text-center whitespace-nowrap ${getStatusColor(
                        room.TrangThai
                      )}`}
                    >
                      {getStatusText(room.TrangThai)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-2 px-2">
                  <div className="flex justify-center space-x-2">
                    <ModalUpdateRoom dataUpdate={room} refetch={refetch} />
                    <ModalDeleteRoom dataDelete={room} refetch={refetch} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Không có dữ liệu phòng
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableRoom;
