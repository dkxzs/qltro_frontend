import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import ModalConfirmLockAccount from "../ModalConfirmLockAccount/ModalConfirmLockAccount";

const TableAccount = ({ accountData, refetch }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSwitchChange = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-12">
              STT
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Tên tài khoản
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Loại tài khoản
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Trạng thái
            </TableHead>
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-32">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountData.map((account, index) => (
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
                {account.TenTK}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[150px]">
                {account.LoaiTaiKhoan === "nhanvien"
                  ? "Nhân viên"
                  : "Khách hàng"}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[150px]">
                {account.TrangThai ? "Kích hoạt" : "Khóa"}
              </TableCell>
              <TableCell className="py-2 px-4 text-center shrink-0 w-32">
                <div className="flex justify-center">
                  <Switch
                    checked={account.TrangThai}
                    onCheckedChange={() => handleSwitchChange(account)}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500 cursor-pointer"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {accountData.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Không có dữ liệu tài khoản
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedAccount && (
        <ModalConfirmLockAccount
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          account={selectedAccount}
          onConfirm={() => {
            setIsModalOpen(false);
            setSelectedAccount(null);
          }}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default TableAccount;
