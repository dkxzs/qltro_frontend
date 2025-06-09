import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import TableAsset from "./TableAsset/TableAsset";
import ModalAddAsset from "./ModalAddAsset/ModalAddAsset";
import Pagination from "../Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { getAllAssetsService } from "@/services/assetServices";

const AdminAsset = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: assetData, refetch } = useQuery({
    queryKey: ["assetData"],
    queryFn: () => getAllAssetsService(),
  });

  const filteredAssetData = assetData?.DT
    ? assetData.DT.filter((asset) =>
        asset.TenTS.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  // Phân trang
  const totalItems = filteredAssetData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredAssetData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          <Package className="size-6" />
          <h1 className="text-2xl font-semibold">Quản lý tài sản</h1>
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
                Quản lý tài sản
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
                  <label className="w-20 text-sm">Tên tài sản:</label>
                  <Input
                    placeholder="Nhập tên tài sản"
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
        <h3 className="text-xl font-medium">Danh sách tài sản</h3>
        <ModalAddAsset refetch={refetch} />
      </div>

      <div className="min-h-[400px]">
        <div className="rounded border overflow-hidden">
          <TableAsset assetData={paginatedData} refetch={refetch} />
        </div>
      </div>

      <div className="mt-5">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminAsset;
