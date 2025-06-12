import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getProfitReportService } from "@/services/reportServices";
import { exportToExcel } from "@/utils/exportToExcel";

const mockProfitData = [
  { name: "Tháng 1", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 2", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 3", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 4", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 5", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 6", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 7", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 8", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 9", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 10", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 11", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
  { name: "Tháng 12", "Nhà Q7": 0, "Nhà Nhà Bè": 0 },
];

const DashboardProfit = ({ customTooltip }) => {
  const { data: profitData, isLoading: profitLoading } = useQuery({
    queryKey: ["profitReport"],
    queryFn: () => getProfitReportService(),
  });

  const houses =
    profitData?.DT?.length > 0
      ? Object.keys(profitData.DT[0]).filter((key) => key !== "name")
      : Object.keys(mockProfitData[0]).filter((key) => key !== "name");

  const processedProfit = profitData?.DT || mockProfitData;
  const hasNoData =
    !profitData?.DT?.length ||
    profitData.DT.every((item) =>
      Object.values(item).every((value) => value === 0 || value === "0")
    );

  const handleExportExcel = () => {
    if (!processedProfit || processedProfit.length === 0 || hasNoData) {
      toast.warning("Không có dữ liệu lợi nhuận để xuất");
      return;
    }

    const headers = [
      { key: "name", label: "Tháng" },
      ...houses.map((house) => ({
        key: house,
        label: `Lợi nhuận ${house} (VND)`,
        format: (value) => value.toLocaleString("vi-VN"),
      })),
    ];

    const success = exportToExcel(
      processedProfit,
      headers,
      `Bao_cao_loi_nhuan_${new Date().toISOString().split("T")[0]}`,
      "Báo cáo lợi nhuận",
      { title: "BÁO CÁO LỢI NHIỆN" }
    );

    if (success) {
      toast.success("Xuất dữ liệu lợi nhuận thành công");
    } else {
      toast.error(
        "Xuất dữ liệu thất bại. Vui lòng kiểm tra console để biết thêm chi tiết."
      );
    }
  };

  return (
    <Card className="rounded border border-gray-200 shadow-none px-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-black">
          Lợi nhuận (VND)
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer rounded"
          onClick={handleExportExcel}
        >
          <Download className="h-4 w-4 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {hasNoData ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Không có dữ liệu doanh thu
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={profitLoading ? [] : processedProfit}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis
                  tickFormatter={(value) => `${value / 1000000}M`}
                  stroke="#6b7280"
                />
                <Tooltip content={customTooltip} />
                <Legend />
                {houses.map((house, index) => (
                  <Bar
                    key={house}
                    dataKey={house}
                    fill={index % 2 === 0 ? "#36A2EB" : "#4BC0C0"}
                    radius={[4, 4, 0, 0]}
                    activeBar={
                      <Rectangle
                        fill={index % 2 === 0 ? "#60a5fa" : "#5eead4"}
                        stroke={index % 2 === 0 ? "#1d4ed8" : "#0d9488"}
                      />
                    }
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardProfit;
