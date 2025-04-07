import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalDeleteCustomer from "../ModalDeleteCustomer/ModalDeleteCustomer";
import ModalUpdateUser from "../ModalUpdateCustomer/ModalUpdateCustomer";

const TableUser = (props) => {
  const { userData, refetch } = props;

  return (
    <div className="w-full overflow-x-auto">
      <Table className="text-sm min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-12 text-center font-medium">STT</TableHead>
            <TableHead className="max-w-xs font-medium">Họ tên</TableHead>
            <TableHead className="max-w-md font-medium">Căn cước công dân</TableHead>
            <TableHead className="max-w-xs font-medium">Giới tính</TableHead>
            <TableHead className="max-w-md font-medium">Email</TableHead>
            <TableHead className="max-w-xs font-medium">Điện thoại</TableHead>
            <TableHead className="max-w-lg font-medium">Địa chỉ</TableHead>
            <TableHead className="w-32 text-center font-medium">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData?.map((user, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-blue-50" : ""}
            >
              <TableCell className="w-12 text-center">{index + 1}</TableCell>
              <TableCell className="max-w-xs truncate">{user.HoTen}</TableCell>
              <TableCell className="max-w-md truncate">{user.CCCD}</TableCell>
              <TableCell className="max-w-xs truncate">
                {user.GioiTinh === "Nam" ? "Nam" : "Nữ"}
              </TableCell>
              <TableCell className="max-w-md truncate">{user.Email}</TableCell>
              <TableCell className="max-w-xs truncate">
                {user.DienThoai}
              </TableCell>
              <TableCell className="max-w-lg truncate">{user.DiaChi}</TableCell>
              <TableCell className="w-32">
                <div className="flex justify-center gap-1">
                  <ModalUpdateUser dataUpdate={user} refetch={refetch} />
                  <ModalDeleteCustomer dataDelete={user} refetch={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!userData?.length && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Không có dữ liệu khách trọ
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableUser;