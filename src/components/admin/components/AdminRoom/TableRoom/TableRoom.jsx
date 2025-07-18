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
import { getRoomStatusColor, getRoomStatusText } from "@/utils/roomStatusUtils";
import ModalAddMember from "../ModalAddMember/ModalAddMember";
import { useNavigate } from "react-router-dom";
import ModalAddContractForEmpty from "../ModalAddContractForEmpty/ModalAddContractForEmpty";
import ModalAddContractForDeposit from "../../AdminDeposit/ModalAddContractForDeposit/ModalAddContractForDeposit";

const TableRoom = ({ roomData, refetch }) => {
  const navigate = useNavigate();
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleViewInfo = (roomId) => {
    navigate(`/admin/view-room`, { state: { roomId } });
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
            <TableHead className="py-3 px-2 text-center w-[10%] min-w-[100px]">
              Trạng thái
            </TableHead>
            <TableHead className="py-3 px-2 text-center w-[15%] min-w-[100px]">
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
                <TableCell className="py-[9px] px-2 text-center">
                  {index + 1}
                </TableCell>
                <TableCell
                  className="py-[9px] px-5 truncate cursor-pointer"
                  onClick={() => handleViewInfo(room.MaPT)}
                >
                  {room.TenPhong}
                </TableCell>
                <TableCell className="py-[9px] px-2 truncate">
                  {room.LoaiPhong.TenLoaiPhong}
                </TableCell>
                <TableCell className="py-[9px] px-2 text-center">
                  {room.DienTich}
                </TableCell>
                <TableCell className="py-[9px] px-2 truncate">
                  {room.LoaiPhong?.DonGia
                    ? formatPrice(room.LoaiPhong?.DonGia)
                    : "N/A"}
                </TableCell>
                <TableCell className="py-[9px] px-2 truncate">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>{room.MoTa}</TooltipTrigger>
                      <TooltipContent>{room.MoTa}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-[9px] px-2">
                  <div className="flex justify-center">
                    <div
                      className={`px-2 py-1 rounded text-center whitespace-nowrap ${getRoomStatusColor(
                        room.TrangThai
                      )}`}
                    >
                      {getRoomStatusText(room.TrangThai)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-[9px] px-2">
                  <div className="flex justify-center gap-1">
                    {room.TrangThai === 0 && (
                      <ModalAddContractForEmpty
                        houseId={room.Nha?.MaNha}
                        roomId={room.MaPT}
                        room={room}
                        status={room.TrangThai}
                        refetch={refetch}
                      />
                    )}
                    {room.TrangThai === 2 && (
                      <ModalAddContractForDeposit
                        deposit={null}
                        roomId={room.MaPT}
                        room={room}
                        refetch={refetch}
                      />
                    )}
                    {room.TrangThai === 1 && <ModalAddMember room={room} />}
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
