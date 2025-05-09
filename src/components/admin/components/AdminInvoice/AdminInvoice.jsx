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
  ChevronDown,
  ChevronUp,
  CreditCard,
  Eye,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import ModalAddInvoice from "./ModalAddInvoice/ModalAddInvoice";
import TableInvoice from "./TableInvoice/TableInvoice";
import { useQuery } from "@tanstack/react-query";
import { getAllInvoiceService } from "@/services/invoiceServices";
import { toast } from "react-toastify";
import { useEffect } from "react";

const AdminInvoice = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoices"],
    queryFn: getAllInvoiceService,
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
      invoice.ThanhToans?.reduce((sum, p) => sum + p.SoTien, 0) || 0;
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
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label className="w-27 text-sm">Tên phòng:</label>
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
                  <label className="w-25 text-sm">Trạng thái:</label>
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
        <h1 className="text-lg font-semibold">Danh sách hoá đơn</h1>
        <div className="flex items-center gap-2">
          <ModalAddInvoice />
          <Button className="rounded cursor-pointer bg-yellow-500 hover:bg-yellow-600">
            Xuất dữ liệu
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
