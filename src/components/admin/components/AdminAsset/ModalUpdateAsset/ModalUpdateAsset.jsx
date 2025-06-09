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
import { Pencil, SquarePen } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModalUpdateAsset = ({ dataUpdate }) => {
  const [formData, setFormData] = useState({
    TenTS: dataUpdate.TenTS,
    SoLuong: dataUpdate.SoLuong,
    TinhTrang: dataUpdate.TinhTrang,
    MoTa: dataUpdate.MoTa,
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "SoLuong") {
      const cleanValue = value.replace(/\D/g, "");
      const numericValue = cleanValue === "" ? "" : parseInt(cleanValue, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      TenTS: dataUpdate.TenTS,
      SoLuong: dataUpdate.SoLuong,
      TinhTrang: dataUpdate.TinhTrang,
      MoTa: dataUpdate.MoTa,
    });
  };

  const validateForm = () => {
    if (!formData.TenTS.trim()) {
      toast.error("Tên tài sản không được để trống");
      return false;
    }
    if (!formData.SoLuong || formData.SoLuong <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return false;
    }
    if (!formData.TinhTrang) {
      toast.error("Vui lòng chọn tình trạng");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Giả lập cập nhật tài sản (do chưa có API)
      toast.success("Cập nhật tài sản thành công");
      setTimeout(() => setOpen(false), 300);
    }
  };

  const handleClose = () => {
    const hasUnsavedChanges =
      formData.TenTS !== dataUpdate.TenTS ||
      formData.SoLuong !== dataUpdate.SoLuong ||
      formData.TinhTrang !== dataUpdate.TinhTrang ||
      formData.MoTa !== dataUpdate.MoTa;
    if (
      hasUnsavedChanges &&
      !window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
    ) {
      return;
    }
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer outline-none rounded-none border-none shadow-none bg-transparent"
          aria-label="Chỉnh sửa tài sản"
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
          <DialogTitle>Chỉnh sửa tài sản</DialogTitle>
          <DialogDescription>
            Vui lòng nhập thông tin để chỉnh sửa tài sản.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tents">Tên tài sản</Label>
              <Input
                type="text"
                id="tents"
                name="TenTS"
                placeholder="Giường gỗ"
                className="rounded shadow-none"
                value={formData.TenTS}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soluong">Số lượng</Label>
              <Input
                type="text"
                id="soluong"
                name="SoLuong"
                placeholder="1"
                className="rounded shadow-none"
                value={formData.SoLuong}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tinhtrang">Tình trạng</Label>
              <Select
                id="tinhtrang"
                name="TinhTrang"
                value={formData.TinhTrang}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, TinhTrang: value }))
                }
              >
                <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
                <SelectContent className="rounded">
                  <SelectItem value="Tốt" className="cursor-pointer">
                    Tốt
                  </SelectItem>
                  <SelectItem value="Hỏng" className="cursor-pointer">
                    Hỏng
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mota">Mô tả</Label>
            <Textarea
              id="mota"
              name="MoTa"
              placeholder="Mô tả chi tiết về tài sản"
              className="rounded min-h-[100px] shadow-none"
              value={formData.MoTa}
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              aria-label="Cập nhật tài sản"
            >
              Lưu
            </Button>
            <Button
              type="button"
              className="rounded cursor-pointer"
              onClick={handleClose}
              variant="destructive"
              aria-label="Hủy chỉnh sửa tài sản"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateAsset;
