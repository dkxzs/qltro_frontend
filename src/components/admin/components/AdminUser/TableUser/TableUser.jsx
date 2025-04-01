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
    <>
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-12">STT</TableHead>
            <TableHead className="max-w-xs">Họ tên</TableHead>
            <TableHead className="max-w-md">Căn cước công dân</TableHead>
            <TableHead className="max-w-xs">Giới tính</TableHead>
            <TableHead className="max-w-md">Email</TableHead>
            <TableHead className="max-w-xs">Điện thoại</TableHead>
            <TableHead className="max-w-lg">Địa chỉ</TableHead>
            <TableHead className="w-32 text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData?.map((user, index) => (
            <TableRow
              key={index}
              className={index % 2 === 0 ? "bg-blue-50" : ""}
            >
              <TableCell className="text-center">{index + 1}</TableCell>
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
              <TableCell>
                <div className="flex justify-center gap-1">
                  <ModalUpdateUser dataUpdate={user} refetch={refetch} />
                  <ModalDeleteCustomer dataDelete={user} refetch={refetch} />
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
