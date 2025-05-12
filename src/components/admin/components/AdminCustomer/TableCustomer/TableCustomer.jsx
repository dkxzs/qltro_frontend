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
import ModalDeleteCustomer from "../ModalDeleteCustomer/ModalDeleteCustomer";
import ModalRentHistory from "../ModalHistoryRent/ModalRentHistory";
import ModalPaymentHistory from "../ModalPaymentHistory/ModalPaymentHistory";
import ModalUpdateUser from "../ModalUpdateCustomer/ModalUpdateCustomer";

const TableUser = (props) => {
  const { userData, refetch } = props;

  return (
    <TooltipProvider>
      <div className="w-full overflow-x-auto">
        <Table className="text-sm min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-10 text-center font-medium">
                STT
              </TableHead>
              <TableHead className="w-24 font-medium">Họ tên</TableHead>
              <TableHead className="w-32 font-medium">
                Căn cước công dân
              </TableHead>
              <TableHead className="w-16 font-medium">Giới tính</TableHead>
              <TableHead className="w-32 font-medium">Email</TableHead>
              <TableHead className="w-24 font-medium">Điện thoại</TableHead>
              <TableHead className="w-32 font-medium">Địa chỉ</TableHead>
              <TableHead className="w-24 font-medium">Trạng thái</TableHead>
              <TableHead className="w-36 text-center font-medium">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData?.map((user, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-blue-50" : ""}
              >
                <TableCell className="w-10 text-center">{index + 1}</TableCell>
                <TableCell className="w-24">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate">{user.HoTen}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.HoTen}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="w-32">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate">{user.CCCD}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.CCCD}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="w-16">
                  {user.GioiTinh === "Nam" ? "Nam" : "Nữ"}
                </TableCell>
                <TableCell className="w-32">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate">{user.Email}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.Email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="w-24">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate">{user.DienThoai}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.DienThoai}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="w-32 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate">{user.DiaChi}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.DiaChi}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="w-24">
                  {user.TrangThai ? "Đang thuê" : "Hết hạn"}
                </TableCell>
                <TableCell className="w-36">
                  <div className="flex justify-center gap-0.5">
                    <ModalUpdateUser dataUpdate={user} refetch={refetch} />
                    <ModalDeleteCustomer dataDelete={user} refetch={refetch} />
                    <ModalRentHistory dataHistory={user} />
                    <ModalPaymentHistory dataPayment={user} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!userData?.length && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  Không có dữ liệu khách trọ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default TableUser;
