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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllInvoiceService,
  invoiceByMonthYearService,
} from "@/services/invoiceServices";
import { exportToExcel } from "@/utils/exportToExcel"; // Thêm import
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import ModalAddInvoice from "./ModalAddInvoice/ModalAddInvoice";
import TableInvoice from "./TableInvoice/TableInvoice";

const AdminInvoice = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  // Xác định queryFn dựa trên selectedMonthYear
  const queryFn = selectedMonthYear
    ? async () => {
        const [year, month] = selectedMonthYear.split("-");
        return await invoiceByMonthYearService(month, year);
      }
    : getAllInvoiceService;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoices", selectedMonthYear],
    queryFn: queryFn,
    enabled: true,
  });

  useEffect(() => {
    if (isError || (data && data.EC !== 0)) {
      toast.error(data?.EM || "Có lỗi xảy ra khi tải danh sách hóa đơn");
    }
  }, [data, isError]);

  const invoices = data?.DT || [];

  // Tính totalPaid và remaining cho mỗi hóa đơn
  const enhancedInvoices = invoices.map((invoice) => {
    const totalPaid =
      invoice.ThanhToan?.reduce((sum, p) => sum + p.SoTien, 0) || 0;
    const totalInvoice = invoice.TongTien || 0;
    const remaining = totalInvoice - totalPaid;

    return {
      ...invoice,
      totalPaid,
      remaining,
    };
  });

  // Lọc dữ liệu theo tên phòng và trạng thái
  const filteredInvoices = enhancedInvoices.filter((invoice) => {
    const matchesRoom =
      searchText === "" ||
      invoice.ThuePhong?.PhongTro?.TenPhong?.toLowerCase().includes(
        searchText.toLowerCase()
      );
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "Chưa thanh toán" && invoice.TrangThai === 0) ||
      (statusFilter === "Đã thanh toán" && invoice.TrangThai === 1);
    return matchesRoom && matchesStatus;
  });

  // Hàm xử lý xuất Excel
  const handleExportExcel = async () => {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      { key: "MaHD", label: "Mã hóa đơn" },
      {
        key: "NgayLap",
        label: "Ngày lập",
      },
      {
        path: "ThuePhong.PhongTro.Nha.TenNha",
        label: "Tên nhà",
      },
      {
        path: "ThuePhong.PhongTro.TenPhong",
        label: "Tên phòng",
        format: (value) => value || "N/A",
      },
      {
        key: "TongTien",
        label: "Tổng tiền (VNĐ)",
      },
      {
        key: "totalPaid",
        label: "Đã thanh toán (VNĐ)",
      },
      {
        key: "remaining",
        label: "Còn lại (VNĐ)",
      },
      {
        key: "TrangThai",
        label: "Trạng thái",
        format: (value) => (value === 0 ? "Chưa thanh toán" : "Đã thanh toán"),
      },
    ];

    try {
      const success = await exportToExcel(
        filteredInvoices,
        headers,
        `Danh_sach_hoa_don_${new Date().toISOString().split("T")[0]}`,
        "Danh sách hóa đơn",
        { title: "DANH SÁCH HÓA ĐƠN" }
      );

      if (success) {
        toast.success("Xuất dữ liệu thành công");
      } else {
        toast.error("Xuất dữ liệu thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
      toast.error("Xuất dữ liệu thất bại");
    }
  };

  return (
    <div className="mx-auto p-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <LiaFileInvoiceSolid className="size-6" />
          <h1 className="text-2xl font-semibold">Quản lý hoá đơn</h1>
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
                Quản lý hoá đơn
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
            <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-24 text-sm">Tên phòng:</label>
                  <Input
                    placeholder="Nhập tên phòng"
                    className="flex-1 rounded outline-none shadow-none"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-24 text-sm">Tháng/Năm:</label>
                  <Input
                    type="month"
                    className="flex-1 rounded outline-none shadow-none"
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-24 text-sm">Trạng thái:</label>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    className="rounded outline-none focus-visible:ring-0 focus-visible:border-0 shadow-none"
                  >
                    <SelectTrigger className="flex-1 rounded cursor-pointer focus-visible:border-0 focus:none shadow-none">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      <SelectItem
                        className="hover:bg-transparent cursor-pointer"
                        value="all"
                      >
                        Tất cả
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-transparent cursor-pointer"
                        value="Chưa thanh toán"
                      >
                        Chưa thanh toán
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-transparent cursor-pointer"
                        value="Đã thanh toán"
                      >
                        Đã thanh toán
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <h1 className="text-sm md:text-lg font-semibold">Danh sách hoá đơn</h1>
        <div className="flex items-center gap-2">
          <ModalAddInvoice />
          <Button
            className="rounded cursor-pointer bg-yellow-500 hover:bg-yellow-600"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4" /> Xuất dữ liệu
          </Button>
        </div>
      </div>
      <div className="rounded">
        <TableInvoice invoices={filteredInvoices} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AdminInvoice;
