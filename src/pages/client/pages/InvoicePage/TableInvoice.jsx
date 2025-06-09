import ModalViewInvoice from "@/components/admin/components/AdminInvoice/ModalViewInvoice/ModalViewInvoice";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { AlertCircle, Loader2 } from "lucide-react";

const TableInvoice = ({ invoices, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="rounded border shadow-sm mb-10 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-50 hover:bg-blue-50">
            <TableHead className="font-semibold text-blue-700">
              Mã hóa đơn
            </TableHead>
            <TableHead className="font-semibold text-blue-700">
              Mã hợp đồng
            </TableHead>
            <TableHead className="font-semibold text-blue-700">
              Tên nhà
            </TableHead>
            <TableHead className="font-semibold text-blue-700">
              Tên phòng
            </TableHead>
            <TableHead className="font-semibold text-blue-700">
              Ngày lập
            </TableHead>
            <TableHead className="font-semibold text-blue-700">
              Tổng tiền
            </TableHead>
            <TableHead className="font-semibold text-blue-700">
              Trạng thái
            </TableHead>
            <TableHead className="font-semibold text-blue-700">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.DT.length > 0 ? (
            invoices?.DT.map((invoice, index) => (
              <TableRow
                key={invoice.MaHD}
                className={
                  index % 2 === 0 ? "bg-gray-50" : "bg-white hover:bg-gray-100"
                }
              >
                <TableCell className="font-medium">{invoice.MaHD}</TableCell>
                <TableCell>{invoice.MaTP}</TableCell>
                <TableCell>
                  {invoice.ThuePhong?.PhongTro?.Nha?.TenNha || "-"}
                </TableCell>
                <TableCell>
                  {invoice.ThuePhong?.PhongTro?.TenPhong || "-"}
                </TableCell>
                <TableCell>
                  {invoice.NgayLap
                    ? format(new Date(invoice.NgayLap), "dd/MM/yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                  {invoice.TongTien?.toLocaleString("vi-VN") || 0} VNĐ
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.TrangThai === 0 ? "destructive" : "success"
                    }
                    className={
                      invoice.TrangThai === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }
                  >
                    {invoice.TrangThai === 0
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
                  </Badge>
                </TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <ModalViewInvoice invoiceId={invoice.MaHD} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-500 italic">Không có hóa đơn</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableInvoice;
