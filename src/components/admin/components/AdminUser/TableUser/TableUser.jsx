import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

const TableUser = (props) => {
  const { userData } = props;
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-center">STT</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>CCCD</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Điện thoại</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.map((room, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-blue-50 " : ""}
            >
              <TableCell className="text-center">{room.id}</TableCell>
              <TableCell>{room.HoTen}</TableCell>
              <TableCell>{room.CCCD}</TableCell>
              <TableCell>{room.GioiTinh}</TableCell>
              <TableCell>{room.Email.toLocaleString()}</TableCell>
              <TableCell className="max-w-md truncate">
                {room.DienThoai}
              </TableCell>
              <TableCell>{room.DiaChi}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 hover:text-white cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 hover:text-white cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TableUser;
