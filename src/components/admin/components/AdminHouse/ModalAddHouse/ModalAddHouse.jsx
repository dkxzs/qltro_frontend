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
import { createHouseService } from "@/services/houseServices";
import { useMutation } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalAddHouse = ({ refetch }) => {
  const [formData, setFormData] = useState({
    TenNha: "",
    DiaChi: "",
    MoTa: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      TenNha: "",
      DiaChi: "",
      MoTa: "",
    });
  };

  const mutationCreateHouse = useMutation({
    mutationFn: async ({ data }) => {
      const res = await createHouseService(data);
      if (res.EC !== 0) {
        return { error: true, EC: res.EC, EM: res.EM };
      }
      return res;
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.EM || "Lỗi không xác định từ server");
      } else {
        toast.success(data.EM || "Thêm nhà thành công");
        resetForm();
        setTimeout(() => setOpen(false), 300);
        refetch();
      }
    },
    onError: () => {
      toast.error("Có lỗi, vui lòng thử lại.");
    },
  });

  const validateForm = () => {
    if (!formData.TenNha.trim()) {
      toast.error("Tên nhà không được để trống");
      return false;
    }
    if (!formData.DiaChi.trim()) {
      toast.error("Địa chỉ không được để trống");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutationCreateHouse.mutate({ data: formData });
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const isFormDisabled = mutationCreateHouse.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mr-2 flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded text-white"
          aria-label="Thêm nhà mới"
        >
          <Plus className="h-5 w-5" />
          Thêm nhà
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 max-w-2xl rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thêm nhà</DialogTitle>
          <DialogDescription>
            Vui lòng nhập đầy đủ thông tin để thêm nhà mới.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="w-full">
              <Label htmlFor="tennha">Tên nhà</Label>
              <Input
                type="text"
                id="tennha"
                name="TenNha"
                placeholder="Nhà A"
                className="rounded mt-2 shadow-none"
                value={formData.TenNha}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="diachi">Địa chỉ</Label>
              <Input
                type="text"
                id="diachi"
                name="DiaChi"
                placeholder="123 Đường ABC, Quận XYZ"
                className="rounded mt-2 shadow-none"
                value={formData.DiaChi}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="mota">Mô tả</Label>
              <Textarea
                id="mota"
                name="MoTa"
                placeholder="Mô tả chi tiết về nhà"
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
              aria-label="Thêm nhà mới"
            >
              {mutationCreateHouse.isPending ? (
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
              aria-label="Hủy thêm nhà"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddHouse;
