import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getContractReportService } from "@/services/reportServices";
import { exportToExcel } from "@/utils/exportToExcel";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const DashboardContractExpiring = ({ timeRange }) => {
  const [localTimeRange] = useState(timeRange);

  // Lấy dữ liệu hợp đồng sắp hết hạn
  const { data: contractData, isLoading: contractLoading } = useQuery({
    queryKey: ["contractReport", localTimeRange],
    queryFn: () => getContractReportService(localTimeRange),
  });

  const processedContracts = contractData?.DT?.contracts || [];

  const handleExportContracts = async () => {
    if (!processedContracts.length) {
      toast.warning("Không có dữ liệu hợp đồng để xuất");
      return;
    }
    const headers = [
      { key: "contractId", label: "Mã hợp đồng" },
      { key: "customerName", label: "Khách thuê" },
      { key: "roomName", label: "Phòng" },
      {
        key: "endDate",
        label: "Ngày hết hạn",
        format: (value) => format(new Date(value), "dd/MM/yyyy"),
      },
    ];
    await exportToExcel(
      processedContracts,
      headers,
      `Hop_dong_sap_het_han_${localTimeRange}`,
      "Hợp đồng sắp hết hạn"
    );
    toast.success("Xuất danh sách hợp đồng thành công");
  };

  return (
    <>
      {contractLoading ? (
        <div className="text-center text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          Đang tải dữ liệu hợp đồng...
        </div>
      ) : processedContracts.length > 0 ? (
        <Card className="mt-6 rounded-lg border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-black">
              Khách hàng sắp hết hạn hợp đồng
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleExportContracts}>
              <Download className="h-4 w-4 text-gray-500" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">STT</TableHead>
                  <TableHead className="text-black">Mã hợp đồng</TableHead>
                  <TableHead className="text-black">Khách thuê</TableHead>
                  <TableHead className="text-black">Phòng</TableHead>
                  <TableHead className="text-black">Ngày hết hạn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedContracts.map((contract, index) => (
                  <TableRow key={contract.contractId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{contract.contractId}</TableCell>
                    <TableCell>{contract.customerName}</TableCell>
                    <TableCell>{contract.roomName}</TableCell>
                    <TableCell>
                      {format(new Date(contract.endDate), "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 text-center text-gray-500">
          Không có dữ liệu hợp đồng
        </div>
      )}
    </>
  );
};

export default DashboardContractExpiring;
