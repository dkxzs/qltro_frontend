import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalDeleteService from "../ModalDeleteService/ModalDeleteService";
import ModalUpdateService from "../ModalUpdateService/ModalUpdateService";

const TableService = (props) => {
  const { serviceData, refetch } = props;

  const getText = (text) => {
    switch (text) {
      case "CHI_SO":
        return "Theo chỉ số";
      case "CO_DINH":
        return "Theo tháng";
      case "SO_LUONG":
        return "Theo số lượng";
      default:
        return "";
    }
  };

  return (
    <div className="w-full overflow-x-auto border rounded">
      <Table className="table-auto min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-12">
              STT
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Tên dịch vụ
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Đơn giá
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Đơn vị tính
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Bắt buộc
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Cách tính
            </TableHead>
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-32">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceData.map((service, index) => (
            <TableRow
              key={index}
              className={
                index % 2 === 0
                  ? "bg-blue-50 border-b hover:bg-gray-50"
                  : "border-b hover:bg-gray-50"
              }
            >
              <TableCell className="py-[7px] px-4 text-center shrink-0 w-12">
                {index + 1}
              </TableCell>
              <TableCell className="py-[7px] px-4 truncate max-w-[250px]">
                {service.TenDV}
              </TableCell>
              <TableCell className="py-[7px] px-4 truncate max-w-[150px]">
                {service.DonGia.toLocaleString()} VNĐ
              </TableCell>
              <TableCell className="py-[7px] px-4 truncate max-w-[150px]">
                {service.DonViTinh}
              </TableCell>
              <TableCell className="py-[7px] px-4 truncate max-w-[150px]">
                {service.BatBuoc ? "Có" : "Không"}
              </TableCell>
              <TableCell className="py-[7px] px-4 truncate max-w-[150px]">
                {getText(service.CachTinhPhi)}
              </TableCell>
              <TableCell className="py-[7px] px-4 text-center shrink-0 w-32">
                <div className="flex space-x-2 justify-center">
                  <ModalUpdateService dataUpdate={service} refetch={refetch} />
                  <ModalDeleteService dataDelete={service} refetch={refetch} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {serviceData.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
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
