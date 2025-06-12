import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRevenueReportService } from "@/services/reportServices";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { toast } from "react-toastify";
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
import { exportToExcel } from "@/utils/exportToExcel";

const mockRevenueData = [
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

const DashboardRevenue = ({ customTooltip }) => {
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["revenueReport"],
    queryFn: () => getRevenueReportService(),
  });

  const houses =
    revenueData?.DT?.length > 0
      ? Object.keys(revenueData.DT[0]).filter((key) => key !== "name")
      : Object.keys(mockRevenueData[0]).filter((key) => key !== "name");

  const processedRevenue = revenueData?.DT || mockRevenueData;
  const hasNoData =
    !revenueData?.DT?.length ||
    revenueData.DT.every((item) =>
      Object.values(item).every((value) => value === 0 || value === "0")
    );

  const handleExportExcel = () => {
    if (!processedRevenue || processedRevenue.length === 0 || hasNoData) {
      toast.warning("Không có dữ liệu doanh thu để xuất");
      return;
    }

    const headers = [
      { key: "name", label: "Tháng" },
      ...houses.map((house) => ({
        key: house,
        label: `Doanh thu ${house} (VND)`,
        format: (value) => value.toLocaleString("vi-VN"),
      })),
    ];

    const success = exportToExcel(
      processedRevenue,
      headers,
      `Bao_cao_doanh_thu_${new Date().toISOString().split("T")[0]}`,
      "Báo cáo doanh thu",
      { title: "BÁO CÁO DOANH THU" }
    );

    if (success) {
      toast.success("Xuất dữ liệu doanh thu thành công");
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
          Doanh thu (VND)
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="rounded cursor-pointer"
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
                data={revenueLoading ? [] : processedRevenue}
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

export default DashboardRevenue;
