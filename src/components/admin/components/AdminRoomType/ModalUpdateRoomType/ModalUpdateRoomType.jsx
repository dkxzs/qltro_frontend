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
import { updateRoomTypeService } from "@/services/roomTypeServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Loader2, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateRoomType = ({ dataUpdate, refetch }) => {
  const [formData, setFormData] = useState({
    TenLoaiPhong: "",
    DonGia: "",
    MoTa: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dataUpdate && open) {
      const newFormData = {
        TenLoaiPhong: dataUpdate.TenLoaiPhong || "",
        DonGia: dataUpdate.DonGia ? formatCurrency(dataUpdate.DonGia) : "",
        MoTa: dataUpdate.MoTa || "",
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
  }, [dataUpdate, open]);

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
    setInitialFormData(null);
  };

  const mutationUpdateRoomType = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateRoomTypeService(id, data);
      return res;
    },
    onSuccess: (data) => {
      if (+data.EC === 0) {
        toast.success(data.EM);
        resetForm();
        setTimeout(() => setOpen(false), 300); // Độ trễ để toast hiển thị
        refetch();
      } else {
        toast.error(data.EM);
      }
    },
    onError: (error) => {
      console.error("Update room type error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Cập nhật loại phòng thất bại: Loại phòng đang được sử dụng hoặc có dữ liệu liên quan. Vui lòng kiểm tra lại."
        : error.response?.data?.EM ||
          "Đã có lỗi xảy ra khi cập nhật loại phòng";
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

  const isFormDataChanged = () => {
    if (!initialFormData) return true;
    return (
      formData.TenLoaiPhong !== initialFormData.TenLoaiPhong ||
      formData.DonGia !== initialFormData.DonGia ||
      formData.MoTa !== initialFormData.MoTa
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormDataChanged()) {
      toast.info("Không có thay đổi để cập nhật");
      return;
    }
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        DonGia: parseInt(formData.DonGia.replace(/\./g, "")),
      };
      mutationUpdateRoomType.mutate({
        id: dataUpdate.MaLP,
        data: dataToSubmit,
      });
    }
  };

  const handleClose = () => {
    if (
      isFormDataChanged() &&
      !window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
    ) {
      return;
    }
    setOpen(false);
    resetForm();
  };

  const isFormDisabled = mutationUpdateRoomType.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Cập nhật loại phòng"
        >
          <SquarePen className="size-5 text-blue-700" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 max-w-2xl rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật loại phòng</DialogTitle>
          <DialogDescription>
            Vui lòng cập nhật thông tin loại phòng.
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
              aria-label="Cập nhật loại phòng"
            >
              {mutationUpdateRoomType.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
            <Button
              type="button"
              className="rounded cursor-pointer"
              onClick={handleClose}
              disabled={isFormDisabled}
              variant="destructive"
              aria-label="Hủy cập nhật loại phòng"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateRoomType;
