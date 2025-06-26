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
    <div className="w-full overflow-x-auto border rounded">
      <Table className="table-auto min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-12">
              STT
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Tên loại phòng
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Đơn giá
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Mô tả
            </TableHead>
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-32">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roomTypeData?.map((roomType, index) => (
            <TableRow
              key={index}
              className={
                index % 2 === 0
                  ? "bg-blue-50 border-b hover:bg-gray-50"
                  : "border-b hover:bg-gray-50"
              }
            >
              <TableCell className="py-2 px-4 text-center shrink-0 w-12">
                {index + 1}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[200px]">
                {roomType.TenLoaiPhong}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[150px]">
                {roomType.DonGia.toLocaleString()} VNĐ
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[300px]">
                {roomType.MoTa}
              </TableCell>
              <TableCell className="py-2 px-4 text-center shrink-0 w-32">
                <div className="flex space-x-2 justify-center items-center">
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
          {!roomTypeData?.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Không có dữ liệu loại phòng
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableRoomType;
