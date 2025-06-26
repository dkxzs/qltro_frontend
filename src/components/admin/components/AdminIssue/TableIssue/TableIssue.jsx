import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModalUpdateIssue from "../ModalUpdateIssue/ModalUpdateIssue";
import ModalViewIssue from "../ModalViewIssue/ModaViewIssue";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ModalDeleteIssue from "../ModalDeleteIssue/ModalDeleteIssue";

const TableIssue = ({ reportData, refetch, refetchStatus }) => {
  return (
    <div className="w-full overflow-x-auto rounded border">
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
              Ngày báo cáo
            </TableHead>
            <TableHead className="py-2 px-4 text-left font-medium">
              Mô tả
            </TableHead>
            <TableHead className="py-2 px-4 text-center font-medium">
              Trạng thái
            </TableHead>
            <TableHead className="py-2 px-4 text-center shrink-0 font-medium w-32">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.length > 0 ? (
            reportData.map((report, index) => (
              <TableRow
                key={report.MaSC}
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
                  {report.TenNha || "Chưa có thông tin"}
                </TableCell>
                <TableCell className="py-2 px-4 truncate max-w-[150px]">
                  {report.TenPhong || "Chưa có thông tin"}
                </TableCell>
                <TableCell className="py-2 px-4 truncate max-w-[150px]">
                  {format(new Date(report.NgayBaoCao), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="py-2 px-4 truncate max-w-[300px]">
                  {report.MoTa}
                </TableCell>
                <TableCell className="py-2 px-4 truncate text-ellipsis text-center max-w-[300px]">
                  <Badge
                    className={`${
                      report.TrangThai === 0
                        ? "bg-red-200 px-2 rounded text-gray-900 font-normal text-sm "
                        : "bg-green-200 px-2 rounded text-gray-900 font-normal text-sm"
                    }`}
                  >
                    {report.TrangThai === 0 ? "Đang xử lý" : "Hoàn thành"}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 px-4 text-center shrink-0 w-32">
                  <div className="flex items-center justify-center gap-2">
                    <ModalViewIssue dataView={report} />
                    {report.TrangThai === 0 && (
                      <>
                        <ModalUpdateIssue
                          dataUpdate={report}
                          refetch={refetch}
                          refetchStatus={refetchStatus}
                        />
                        <ModalDeleteIssue
                          dataDelete={report}
                          refetch={refetch}
                        />
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-4 font-semibold text-gray-500"
              >
                Không có báo cáo sự cố
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableIssue;
