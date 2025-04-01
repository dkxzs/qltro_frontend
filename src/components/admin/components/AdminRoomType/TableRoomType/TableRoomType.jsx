import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalDeleteRoomType from "../ModalDeleteRoomType/ModalDeleteRoomType";
import ModalUpdateRoomType from "../ModalUpdateRoomType/ModalUpdateRoomType";

const TableRoomType = (props) => {
  const { roomTypeData, refetch } = props;

  return (
    <div>
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-3 px-4 text-left font-medium">
              STT
            </TableHead>
            <TableHead className="py-3 px-4 text-left font-medium">
              Tên loại phòng
            </TableHead>
            <TableHead className="py-3 px-4 text-left font-medium">
              Đơn giá
            </TableHead>
            <TableHead className="py-3 px-4 text-left font-medium">
              Mô tả
            </TableHead>
            <TableHead className="py-3 px-4 text-left font-medium">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roomTypeData?.map((roomType, index) => (
            <TableRow key={index} className="border-b hover:bg-gray-50">
              <TableCell className="py-3 px-4">{index + 1}</TableCell>
              <TableCell className="py-3 px-4">
                {roomType.TenLoaiPhong}
              </TableCell>
              <TableCell className="py-3 px-4">
                {roomType.DonGia.toLocaleString()}
              </TableCell>
              <TableCell className="py-3 px-4">{roomType.MoTa}</TableCell>
              <TableCell className="py-3 px-4">
                <div className="flex space-x-2">
                  <ModalUpdateRoomType
                    dataUpdate={roomType}
                    refetch={refetch}
                  />
                  <ModalDeleteRoomType
                    dataDelete={roomType}
                    refetch={refetch}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableRoomType;
