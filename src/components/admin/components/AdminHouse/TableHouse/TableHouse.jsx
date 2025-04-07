import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalUpdateHouse from "../ModalUpdateHouse/ModalUpdateHouse";
import ModalDeleteHouse from "../ModalDeleteHouse/ModalDeleteHouse";

const TableHouse = (props) => {
  const { houseData, refetch } = props;

  return (
    <div className="w-full overflow-x-auto">
      <Table className="table-auto min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-12">
              STT
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Tên nhà
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Địa chỉ
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Mô tả
            </TableHead>
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-32">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {houseData.map((house, index) => (
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
                {house.TenNha}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[250px]">
                {house.DiaChi}
              </TableCell>
              <TableCell className="py-2 px-4 truncate max-w-[300px]">
                {house.MoTa}
              </TableCell>
              <TableCell className="py-2 px-4 text-center shrink-0 w-32">
                <div className="flex space-x-2 justify-center">
                  <ModalUpdateHouse dataUpdate={house} refetch={refetch} />
                  <ModalDeleteHouse dataDelete={house} refetch={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {houseData.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Không có dữ liệu tòa nhà
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableHouse;
