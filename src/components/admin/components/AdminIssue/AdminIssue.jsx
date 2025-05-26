import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllIssueService } from "@/services/issueService";
import { exportToExcel } from "@/utils/exportToExcel";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Download, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ModalAddIssue from "./ModalAddIssue/ModalAddIssue";
import TableIssue from "./TableIssue/TableIssue";

const AdminIssue = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");

  const {
    data: reportData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["baoCaoSuCo"],
    queryFn: getAllIssueService,
  });

  const filteredReportData = reportData?.DT
    ? reportData.DT.filter((report) =>
        report.MoTa.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const handleExportExcel = () => {
    if (!filteredReportData || filteredReportData.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaSC", label: "Mã sự cố" },
      { key: "TenPhong", label: "Phòng" },
      { key: "TenNha", label: "Nhà" },
      {
        key: "NgayBaoCao",
        label: "Ngày báo cáo",
        format: (value) => format(new Date(value), "dd/MM/yyyy"),
      },
      { key: "MoTa", label: "Mô tả" },
      {
        key: "TrangThai",
        label: "Trạng thái",
        format: (value) => (value === 0 ? "Đang xử lý" : "Hoàn thành"),
      },
    ];

    const success = exportToExcel(
      filteredReportData,
      headers,
      `Danh_sach_bao_cao_su_co_${new Date().toISOString().split("T")[0]}`,
      "Danh sách báo cáo sự cố",
      { title: "DANH SÁCH BÁO CÁO SỰ CỐ" }
    );

    if (success) {
      toast.success("Xuất dữ liệu thành công");
    } else {
      toast.error("Xuất dữ liệu thất bại");
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          <TriangleAlert className="size-6" />
          <h1 className="text-2xl font-semibold">Quản lý sự cố / bảo trì</h1>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-md font-semibold">
                Tổng quan
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-md font-semibold">
                Quản lý báo cáo sự cố
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card className="mb-4 rounded py-2 shadow-none">
        <CardContent className="p-0">
          <div
            className="flex items-center cursor-pointer border-b"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          >
            {isFilterExpanded ? (
              <ChevronDown className="h-5 w-5 mr-2 mb-2 ml-3" />
            ) : (
              <ChevronUp className="h-5 w-5 mr-2 mb-2 ml-3" />
            )}
            <span className="font-medium mb-2">Bộ lọc tìm kiếm</span>
          </div>

          {isFilterExpanded && (
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-20 text-sm">Mô tả:</label>
                  <Input
                    placeholder="Nhập mô tả sự cố"
                    className="flex-1 rounded outline-none shadow-none"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Danh sách báo cáo sự cố</h3>
        <div className="flex gap-2">
          <ModalAddIssue refetch={refetch} />
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded cursor-pointer hover:text-white"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      <div className="rounded border overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">Đang tải dữ liệu...</div>
        ) : (
          <TableIssue reportData={filteredReportData} refetch={refetch} />
        )}
      </div>
    </div>
  );
};

export default AdminIssue;
