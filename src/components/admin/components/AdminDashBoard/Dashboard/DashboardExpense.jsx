import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Rectangle,
} from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getExpenseReportService } from "@/services/reportServices";
import { exportToExcel } from "@/utils/exportToExcel";

const DashboardExpense = () => {
  const [timeRange, setTimeRange] = useState("current-month");

  const { data: expenseData, isLoading: expenseLoading } = useQuery({
    queryKey: ["expenseReportDashboard", timeRange],
    queryFn: () => getExpenseReportService(timeRange),
  });

  const processedExpense = expenseLoading ? [] : expenseData?.DT || [];

  const hasData =
    processedExpense.length > 0 &&
    Object.keys(processedExpense[0] || {}).some(
      (key) => key !== "name" && processedExpense[0][key] > 0
    );

  const handleExportExcel = () => {
    if (!processedExpense || processedExpense.length === 0 || !hasData) {
      toast.warning("Không có dữ liệu chi phí để xuất");
      return;
    }

    const headers = [
      { key: "name", label: "Tháng" },
      ...Object.keys(processedExpense[0] || {})
        .filter((key) => key !== "name")
        .map((house) => ({
          key: house,
          label: `Chi phí ${house} (VND)`,
          format: (value) => value.toLocaleString("vi-VN"),
        })),
    ];

    const success = exportToExcel(
      processedExpense,
      headers,
      `Bao_cao_chi_phi_${new Date().toISOString().split("T")[0]}`,
      "Báo cáo chi phí",
      { title: "BÁO CÁO CHI PHÍ" }
    );

    if (success) {
      toast.success("Xuất dữ liệu chi phí thành công");
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
          Chi phí (VND)
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] border border-gray-300 rounded px-2 py-1 text-sm">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Tháng hiện tại</SelectItem>
              <SelectItem value="2-months">2 tháng gần đây</SelectItem>
              <SelectItem value="5-months">5 tháng gần đây</SelectItem>
              <SelectItem value="1-year">1 năm gần đây</SelectItem>
              <SelectItem value="2-years">2 năm gần đây</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer rounded"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {expenseLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Đang tải...</p>
            </div>
          ) : !hasData ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Không có dữ liệu chi phí</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedExpense}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis
                  tickFormatter={(value) => `${value / 1000000}M`}
                  stroke="#6b7280"
                />
                <Tooltip formatter={(value) => `${value / 1000000}M`} />
                <Legend />
                <Bar
                  dataKey="Nhà Xuân Phương"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                />
                <Bar
                  dataKey="Nhà Cầu Giấy"
                  fill="#82ca9d"
                  activeBar={<Rectangle fill="gold" stroke="purple" />}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardExpense;
