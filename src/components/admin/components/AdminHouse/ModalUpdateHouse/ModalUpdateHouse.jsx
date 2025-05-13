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
import { updateHouseService } from "@/services/houseServices";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Loader2, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateHouse = ({ dataUpdate, refetch }) => {
  const [formData, setFormData] = useState({
    TenNha: "",
    DiaChi: "",
    MoTa: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dataUpdate && open) {
      const newFormData = {
        TenNha: dataUpdate.TenNha || "",
        DiaChi: dataUpdate.DiaChi || "",
        MoTa: dataUpdate.MoTa || "",
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
  }, [dataUpdate, open]);

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
    setInitialFormData(null);
  };

  const mutationUpdateHouse = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateHouseService(id, data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi cập nhật nhà");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setTimeout(() => setOpen(false), 300); // Độ trễ để toast hiển thị
      refetch();
    },
    onError: (error) => {
      console.error("Update house error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Cập nhật nhà thất bại: Nhà đang có phòng hoặc dữ liệu liên quan. Vui lòng kiểm tra lại."
        : error.message || "Đã có lỗi xảy ra khi cập nhật nhà";
      toast.error(errorMessage);
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

  const isFormDataChanged = () => {
    if (!initialFormData) return true;
    return (
      formData.TenNha !== initialFormData.TenNha ||
      formData.DiaChi !== initialFormData.DiaChi ||
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
      mutationUpdateHouse.mutate({
        id: dataUpdate.MaNha,
        data: formData,
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

  const isFormDisabled = mutationUpdateHouse.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className=" flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Cập nhật thông tin nhà"
        >
          <SquarePen className="size-4 text-blue-700" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 max-w-2xl rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin nhà</DialogTitle>
          <DialogDescription>
            Vui lòng cập nhật thông tin nhà.
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
              aria-label="Cập nhật thông tin nhà"
            >
              {mutationUpdateHouse.isPending ? (
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
              aria-label="Hủy cập nhật nhà"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateHouse;
