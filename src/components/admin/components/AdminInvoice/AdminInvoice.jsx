import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Eye, FileText } from "lucide-react";

const AdminInvoice = () => {
  const invoices = [
    {
      id: 1,
      room: "Phòng 0",
      status: "Đã thanh toán",
      amount: "1,142,500 vnd",
      date: "03/07/2023 17:47:07",
    },
    // You can add more invoice data here if needed
  ];

  return (
    <div className=" mx-auto px-2">
      <h1 className="text-2xl font-semibold">Danh sách hóa đơn</h1>

      <div className="rounded border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] py-4">STT</TableHead>
              <TableHead className="w-[200px] py-4">Phòng</TableHead>
              <TableHead className="w-[200px]">Trạng thái</TableHead>
              <TableHead className="w-[200px]">Tổng tiền</TableHead>
              <TableHead className="w-[250px]">Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell className="font-medium">{invoice.room}</TableCell>
                <TableCell className="font-medium">{invoice.status}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-sky-100 hover:bg-sky-200 text-sky-700 cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminInvoice;
