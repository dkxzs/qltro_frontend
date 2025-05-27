import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalUpdateStaff from "../ModalUpdateStaff/ModalUpdateStaff";
import ModalDeleteStaff from "../ModalDeleteStaff/ModalDeleteStaff";

const TableStaff = (props) => {
  const { employeeData, refetch } = props;

  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-12">
              STT
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Họ Tên
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Ngày Sinh
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Giới Tính
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Điện Thoại
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Email
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Chức Vụ
            </TableHead>
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-32">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeData.map((employee, index) => (
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
                {employee.HoTen}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[150px]">
                {employee.NgaySinh ? new Date(employee.NgaySinh).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[100px]">
                {employee.GioiTinh || "-"}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[150px]">
                {employee.DienThoai || "-"}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[200px]">
                {employee.Email || "-"}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[150px]">
                {employee.ChucVu || "-"}
              </TableCell>
              <TableCell className="py-2 px-4 text-center shrink-0 w-32">
                <div className="flex justify-center">
                  <ModalUpdateStaff dataUpdate={employee} refetch={refetch} />
                  <ModalDeleteStaff dataDelete={employee} refetch={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {employeeData.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Không có dữ liệu nhân viên
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableStaff;