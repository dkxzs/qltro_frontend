import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import ModalDeleteExpense from "../ModalDeleteExpense/ModalDeleteExpense";
import ModalUpdateExpense from "../ModalUpdateExpense/ModalUpdateExpense";

const TableExpense = ({ expenseData, refetch }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const isPastMonth = (thang, nam) => {
    console.log(
      `Thang: ${thang} (type: ${typeof thang}), Nam: ${nam} (type: ${typeof nam})`
    );

    const parsedThang = Number(thang);
    const parsedNam = Number(nam);

    if (
      isNaN(parsedThang) ||
      isNaN(parsedNam) ||
      parsedThang < 1 ||
      parsedThang > 12 ||
      parsedNam < 1900
    ) {
      console.log(
        `Invalid Thang: ${parsedThang}, Nam: ${parsedNam}, returning false`
      );
      return false;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const isPast =
      parsedNam < currentYear ||
      (parsedNam === currentYear && parsedThang < currentMonth);

    console.log(
      `Parsed Thang: ${parsedThang}, Nam: ${parsedNam}, isPastMonth: ${isPast}`
    );
    return isPast;
  };

  const isLocked = (expense) => {
    const pastMonth = isPastMonth(expense.Thang, expense.Nam);
    const hasInvoice = expense.hasInvoice || false; // Từ API
    console.log(
      `Expense MaCPPS: ${
        expense.MaCPPS
      }, isPastMonth: ${pastMonth}, hasInvoice: ${hasInvoice}, isLocked: ${
        pastMonth || hasInvoice
      }`
    );
    return pastMonth || hasInvoice;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="px-2 py-2">STT</TableHead>
            <TableHead className="px-2 py-2">Phòng</TableHead>
            <TableHead className="px-2 py-2">Thời gian</TableHead>
            <TableHead className="px-2 py-2">Người chi trả</TableHead>
            <TableHead className="px-2 py-2">Tổng tiền</TableHead>
            <TableHead className="px-2 py-2 text-center">Mô tả</TableHead>
            <TableHead className="text-right pr-7 py-2">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenseData && expenseData.length > 0 ? (
            expenseData.map((expense, index) => (
              <TableRow key={expense.MaCPPS}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {expense.PhongTro?.TenPhong || "Không có phòng"}
                </TableCell>
                <TableCell>
                  {expense.Thang}/{expense.Nam}
                </TableCell>
                <TableCell>{expense.NguoiChiTra}</TableCell>
                <TableCell>{formatCurrency(expense.TongTien)}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {expense.MoTa}
                </TableCell>
                <TableCell className="">
                  <div className="flex justify-end gap-1">
                    <ModalUpdateExpense
                      dataUpdate={expense}
                      refetch={refetch}
                      disabled={isLocked(expense)}
                    />
                    <ModalDeleteExpense
                      dataDelete={expense}
                      refetch={refetch}
                      disabled={isLocked(expense)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TableExpense;
