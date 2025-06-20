import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getContractReportService } from "@/services/reportServices";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const DashboardContractExpiring = () => {
  const { data: contractData, isLoading: contractLoading } = useQuery({
    queryKey: ["contractReport"],
    queryFn: () => getContractReportService(),
  });

  const processedContracts = contractData?.DT?.contracts || [];

  return (
    <>
      {contractLoading ? (
        <div className="text-center text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Đang tải dữ liệu hợp đồng...
        </div>
      ) : (
        processedContracts && (
          <Card className="mt-3 rounded border border-gray-200 shadow-none px-2">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 px-2">
              <CardTitle className="text-lg font-semibold text-black">
                Khách hàng sắp hết hạn hợp đồng
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="rounded border">
                <Table className="w-full border-collapse">
                  <TableHeader>
                    <TableRow className="bg-sky-100">
                      <TableHead className="text-black text-center py-3 px-4">
                        STT
                      </TableHead>
                      <TableHead className="text-black text-center py-3 px-4">
                        Nhà
                      </TableHead>
                      <TableHead className="text-black text-center py-3 px-4">
                        Phòng
                      </TableHead>
                      <TableHead className="text-black text-center py-3 px-4">
                        Họ Tên
                      </TableHead>
                      <TableHead className="text-black text-center py-3 px-4">
                        Ngày hết hạn
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedContracts.length > 0 ? (
                      processedContracts.map((contract, index) => (
                        <TableRow
                          key={contract.MaTP}
                          className="hover:bg-gray-100 transition-colors"
                        >
                          <TableCell className="p-2 text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            {contract.TenNha || "Chưa có thông tin"}
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            {contract.TenPhong || "Chưa có thông tin"}
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            {contract.HoTen || "Chưa có thông tin"}
                          </TableCell>
                          <TableCell className="p-2 text-center">
                            {format(new Date(contract.endDate), "dd/MM/yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center font-semibold text-lg text-gray-500 py-20"
                        >
                          Không có hợp đồng sắp hết hạn
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </>
  );
};

export default DashboardContractExpiring;
