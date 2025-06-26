import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalDeleteDeposit from "../ModalDeleteDeposit/ModalDeleteDeposit";
import ModalUpdateDeposit from "../ModalUpdateDeposit/ModalUpdateDeposit";
import ModalAddContractForEmpty from "../ModalAddContractForDeposit/ModalAddContractForDeposit";

const TableDeposit = ({ depositData, refetch }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đặt cọc</TableHead>
            <TableHead>Nhà</TableHead>
            <TableHead>Phòng</TableHead>
            <TableHead>Tên khách</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Ngày đặt cọc</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {depositData?.length > 0 ? (
            depositData.map((deposit) => (
              <TableRow key={deposit.MaDC}>
                <TableCell>{deposit.MaDC}</TableCell>
                <TableCell>{deposit.PhongTro.Nha.TenNha}</TableCell>
                <TableCell>{deposit.PhongTro.TenPhong}</TableCell>
                <TableCell>{deposit.TenKH}</TableCell>
                <TableCell>{deposit.SoDienThoai}</TableCell>
                <TableCell>{deposit.SoTien.toLocaleString()} VND</TableCell>
                <TableCell>
                  {new Date(deposit.NgayDatCoc).toLocaleDateString()}
                </TableCell>
                <TableCell>{deposit.GhiChu || ""}</TableCell>
                <TableCell>{deposit.TrangThai}</TableCell>
                <TableCell>
                  {deposit.TrangThai === "Đang cọc" && (
                    <ModalAddContractForEmpty
                      deposit={deposit}
                      refetch={refetch}
                    />
                  )}
                  <ModalUpdateDeposit deposit={deposit} refetch={refetch} />
                  <ModalDeleteDeposit deposit={deposit} refetch={refetch} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TableDeposit;
