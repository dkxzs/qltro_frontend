import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalUpdateBuilding from "../ModalUpdateBuilding/ModalUpdateBuilding";
import ModalDeleteBuilding from "../ModalDeleteBuilding/ModalDeleteBuilding";

const TableBuilding = (props) => {
  const { buildingData, refetch } = props;

  return (
    <div>
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-3 px-4 text-left font-medium">
              STT
            </TableHead>
            <TableHead className="py-3 px-4 text-left font-medium">
              Tên nhà
            </TableHead>
            <TableHead className="py-3 px-4 text-left font-medium">
              Địa chỉ
            </TableHead>
            <TableHead className="py-3 px-4 text-left font-medium">
              Mô tả
            </TableHead>
            <TableHead className="py-3 px-4 text-left font-medium">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildingData.map((building, index) => (
            <TableRow key={index} className="border-b hover:bg-gray-50">
              <TableCell className="py-3 px-4">{index + 1}</TableCell>
              <TableCell className="py-3 px-4">
                {building.TenNha}
              </TableCell>
              <TableCell className="py-3 px-4">
                {building.DiaChi}
              </TableCell>
              <TableCell className="py-3 px-4 max-w-xs truncate">
                {building.MoTa}
              </TableCell>
              <TableCell className="py-3 px-4">
                <div className="flex space-x-2">
                  <ModalUpdateBuilding dataUpdate={building} refetch={refetch} />
                  <ModalDeleteBuilding dataDelete={building} refetch={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableBuilding;