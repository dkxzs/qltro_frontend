import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { useState } from "react";

const ModalViewIssue = ({ dataView }) => {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Không có dữ liệu";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hàm format trạng thái
  const formatStatus = (status) => {
    return status === 1 ? "Hoàn thành" : "Đang xử lý";
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
            aria-label="Xem chi tiết báo cáo sự cố"
          >
            <Eye className="size-4 text-green-700" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl rounded">
          <DialogHeader>
            <DialogTitle>Chi tiết báo cáo sự cố</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tên nhà */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700">Nhà:</span>
                <span className="text-gray-600">
                  {dataView?.TenNha || "Không có dữ liệu"}
                </span>
              </div>

              {/* Tên phòng */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700">Phòng:</span>
                <span className="text-gray-600">
                  {dataView?.TenPhong || "Không có dữ liệu"}
                </span>
              </div>

              {/* Ngày báo cáo */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700">
                  Ngày báo cáo:
                </span>
                <span className="text-gray-600">
                  {formatDate(dataView?.NgayBaoCao)}
                </span>
              </div>

              {/* Trạng thái */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700">Trạng thái:</span>
                <span
                  className={
                    dataView?.TrangThai === 1
                      ? "text-green-600 font-medium"
                      : "text-orange-600 font-medium"
                  }
                >
                  {formatStatus(dataView?.TrangThai)}
                </span>
              </div>
            </div>

            {/* Mô tả */}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700">Mô tả:</span>
              <p className="text-gray-600 mt-1 p-2 bg-gray-50 rounded border border-gray-200 min-h-[100px]">
                {dataView?.MoTa || "Không có mô tả"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              className="rounded cursor-pointer"
              onClick={() => setOpen(false)}
              variant="destructive"
              aria-label="Đóng modal xem chi tiết"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalViewIssue;
