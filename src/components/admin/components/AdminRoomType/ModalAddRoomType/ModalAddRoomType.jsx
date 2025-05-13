import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createRoomTypeService } from "@/services/roomTypeServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalAddRoomType = ({ refetch }) => {
  const [formData, setFormData] = useState({
    TenLoaiPhong: "",
    DonGia: "",
    MoTa: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "DonGia") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue ? formatCurrency(numericValue) : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      TenLoaiPhong: "",
      DonGia: "",
      MoTa: "",
    });
  };

  const mutationCreateRoomType = useMutation({
    mutationFn: async (data) => {
      const res = await createRoomTypeService(data);
      return res;
    },
    onSuccess: (data) => {
      if (+data.EC === 0) {
        toast.success(data.EM);
        resetForm();
        setTimeout(() => setOpen(false), 300);
        refetch();
      } else {
        toast.error(data.EM);
      }
    },
    onError: (error) => {
      console.error("Add room type error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Thêm loại phòng thất bại: Có dữ liệu liên quan không hợp lệ. Vui lòng kiểm tra lại."
        : error.response?.data?.EM || "Đã có lỗi xảy ra khi thêm loại phòng";
      toast.error(errorMessage);
    },
  });

  const validateForm = () => {
    const donGiaValue = formData.DonGia.replace(/\./g, "");
    if (!formData.TenLoaiPhong.trim()) {
      toast.error("Tên loại phòng không được để trống");
      return false;
    }

    if (!formData.DonGia.trim()) {
      toast.error("Đơn giá không được để trống");
      return false;
    }

    if (isNaN(donGiaValue) || parseInt(donGiaValue) <= 0) {
      toast.error("Đơn giá phải là số dương");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        DonGia: parseInt(formData.DonGia.replace(/\./g, "")),
      };
      mutationCreateRoomType.mutate(dataToSubmit);
    }
  };

  const handleClose = () => {
    const hasUnsavedChanges =
      formData.TenLoaiPhong || formData.DonGia || formData.MoTa;
    if (
      hasUnsavedChanges &&
      !window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
    ) {
      return;
    }
    setOpen(false);
    resetForm();
  };

  const isFormDisabled = mutationCreateRoomType.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded text-white"
          aria-label="Thêm loại phòng mới"
        >
          <Plus className="h-5 w-5" />
          Thêm loại phòng
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 max-w-2xl rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thêm loại phòng</DialogTitle>
          <DialogDescription>
            Vui lòng nhập đầy đủ thông tin để thêm loại phòng mới.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenloaiphong">Tên loại phòng</Label>
              <Input
                type="text"
                id="tenloaiphong"
                name="TenLoaiPhong"
                placeholder="Phòng VIP"
                className="rounded mt-2 shadow-none"
                value={formData.TenLoaiPhong}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
            <div>
              <Label htmlFor="dongia">Đơn giá (VNĐ)</Label>
              <Input
                type="text"
                id="dongia"
                name="DonGia"
                placeholder="2.000.000"
                className="rounded mt-2 shadow-none"
                value={formData.DonGia}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="mota">Mô tả</Label>
              <Textarea
                id="mota"
                name="MoTa"
                placeholder="Mô tả chi tiết về loại phòng"
                className="rounded mt-2 min-h-[100px] shadow-none"
                value={formData.MoTa}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              disabled={isFormDisabled}
              aria-label="Thêm loại phòng mới"
            >
              {mutationCreateRoomType.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Thêm"
              )}
            </Button>
            <Button
              type="button"
              className="rounded cursor-pointer"
              onClick={handleClose}
              disabled={isFormDisabled}
              variant="destructive"
              aria-label="Hủy thêm loại phòng"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddRoomType;
