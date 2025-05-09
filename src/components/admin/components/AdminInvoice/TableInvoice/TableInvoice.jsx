import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import ModalViewInvoice from "../ModalViewInvoice/ModalViewInvoice";
import ModalPayment from "../ModalPayment/ModalPayment";

const TableInvoice = ({ invoices, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="rounded overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Mã hóa đơn</TableHead>
              <TableHead>Mã hợp đồng</TableHead>
              <TableHead>Tên nhà</TableHead>
              <TableHead>Tên phòng</TableHead>
              <TableHead>Ngày lập</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Tiền đã đóng</TableHead>
              <TableHead>Số tiền còn lại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <TableRow key={invoice.MaHD}>
                  <TableCell>{invoice.MaHD}</TableCell>
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
                    {invoice.totalPaid?.toLocaleString("vi-VN") || 0} VNĐ
                  </TableCell>
                  <TableCell>
                    {invoice.remaining?.toLocaleString("vi-VN") || 0} VNĐ
                  </TableCell>
                  <TableCell>
                    {invoice.TrangThai === 0
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <ModalViewInvoice invoiceId={invoice.MaHD} />
                    </div>
                    <div>
                      <ModalPayment
                        invoiceId={invoice.MaHD}
                        invoiceData={invoice}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Không có hóa đơn nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableInvoice;
