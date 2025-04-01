import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalUpdateService from "../ModalUpdateService/ModalUpdateService";
import ModalDeleteService from "../ModalDeleteService/ModalDeleteService";

const TableService = (props) => {
  const { serviceData, refetch } = props;

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-3 px-4 text-center w-12">STT</TableHead>
            <TableHead className="py-3 px-4 text-left min-w-[200px]">
              Tên dịch vụ
            </TableHead>
            <TableHead className="py-3 px-4 text-left min-w-[150px]">
              Đơn giá
            </TableHead>
            <TableHead className="py-3 px-4 text-left min-w-[150px]">
              Đơn vị tính
            </TableHead>
            <TableHead className="py-3 px-4 pl-1.5 text-center w-32">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceData.map((service, index) => (
            <TableRow key={index} className="border-b hover:bg-gray-50">
              <TableCell className="py-2 px-4 text-center">
                {index + 1}
              </TableCell>
              <TableCell className="py-2 px-4 truncate">
                {service.TenDV}
              </TableCell>
              <TableCell className="py-2 px-4 truncate">
                {service.DonGia.toLocaleString()} VNĐ
              </TableCell>
              <TableCell className="py-2 px-4 truncate">
                {service.DonViTinh}
              </TableCell>
              <TableCell className="py-2 px-4">
                <div className="flex space-x-2 justify-center">
                  <ModalUpdateService dataUpdate={service} refetch={refetch} />
                  <ModalDeleteService dataDelete={service} refetch={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {serviceData.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Không có dữ liệu dịch vụ
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableService;
