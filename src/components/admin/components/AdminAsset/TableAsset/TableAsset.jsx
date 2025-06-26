import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalUpdateAsset from "../ModalUpdateAsset/ModalUpdateAsset";
import ModalDeleteAsset from "../ModalDeleteAsset/ModalDeleteAsset";

const TableAsset = ({ assetData, refetch }) => {
  const dataToDisplay = assetData;

  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-12">
              STT
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Nhà
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Phòng
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Tên tài sản
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Số lượng
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Mô tả
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
          {dataToDisplay.map((asset, index) => (
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
              <TableCell className="py-2 px-4 truncate max-w-[150px]">
                {asset.TenNha}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[150px]">
                {asset.TenPhong}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[200px]">
                {asset.TenTS}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[100px]">
                {asset.SoLuong}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[300px]">
                {asset.MoTa || "Không có mô tả"}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[150px]">
                {asset.TinhTrang}
              </TableCell>
              <TableCell className="py-2 px-4 text-center shrink-0 w-32">
                <div className="flex justify-center gap-2">
                  <ModalUpdateAsset dataUpdate={asset} refetch={refetch} />
                  <ModalDeleteAsset dataDelete={asset} refetch={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {dataToDisplay.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Không có dữ liệu tài sản
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableAsset;
