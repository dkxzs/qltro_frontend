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
import { createServiceService } from "@/services/serviceServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ModalAddService = ({ refetch }) => {
  const [formData, setFormData] = useState({
    TenDV: "",
    DonGia: "",
    DonViTinh: "",
    BatBuoc: false,
    Code: "",
    CachTinhPhi: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "DonGia") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCachTinhPhiChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      CachTinhPhi: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      TenDV: "",
      DonGia: "",
      DonViTinh: "",
      BatBuoc: false,
      Code: "",
      CachTinhPhi: "",
    });
  };

  const mutationCreateService = useMutation({
    mutationFn: async (data) => {
      const res = await createServiceService(data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi thêm dịch vụ");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setTimeout(() => setOpen(false), 300);
      refetch();
    },
    onError: (error) => {
      console.error("Add service error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Thêm dịch vụ thất bại: Có dữ liệu liên quan không hợp lệ."
        : error.message.includes("duplicate")
        ? "Tên dịch vụ đã tồn tại. Vui lòng chọn tên khác."
        : error.message || "Đã có lỗi xảy ra khi thêm dịch vụ";
      toast.error(errorMessage);
    },
  });

  const validateForm = () => {
    if (!formData.TenDV.trim()) {
      toast.error("Tên dịch vụ không được để trống");
      return false;
    }

    const donGiaValue = formData.DonGia.replace(/\./g, "");
    if (!donGiaValue) {
      toast.error("Đơn giá không được để trống");
      return false;
    }

    if (isNaN(donGiaValue) || parseInt(donGiaValue) <= 0) {
      toast.error("Đơn giá phải là số dương");
      return false;
    }

    if (!formData.DonViTinh.trim()) {
      toast.error("Đơn vị tính không được để trống");
      return false;
    }

    if (!formData.CachTinhPhi) {
      toast.error("Cách tính phí phải được chọn");
      return false;
    }

    return true;
  };

  const hasUnsavedChanges = () => {
    return (
      formData.TenDV ||
      formData.DonGia ||
      formData.DonViTinh ||
      formData.BatBuoc ||
      formData.Code ||
      formData.CachTinhPhi
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        DonGia: parseInt(formData.DonGia.replace(/\./g, "")),
        Code: formData.Code.trim() || null,
      };
      mutationCreateService.mutate(dataToSubmit);
    }
  };

  const handleClose = () => {
    if (
      hasUnsavedChanges() &&
      !window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
    ) {
      return;
    }
    setOpen(false);
    resetForm();
  };

  const isFormDisabled = mutationCreateService.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mr-2 flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded text-white"
          aria-label="Thêm dịch vụ mới"
        >
          <Plus className="h-5 w-5" />
          Thêm dịch vụ
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-6/12 rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ</DialogTitle>
          <DialogDescription>
            Vui lòng nhập đầy đủ thông tin để thêm dịch vụ mới.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="tendichvu">Tên dịch vụ</Label>
              <Input
                type="text"
                id="tendichvu"
                name="TenDV"
                placeholder="Điện, Nước, Internet, ..."
                className="rounded mt-2 shadow-none"
                value={formData.TenDV}
                onChange={handleChange}
                disabled={isFormDisabled}
                aria-label="Tên dịch vụ"
              />
            </div>
            <div>
              <Label htmlFor="dongia">Đơn giá (VNĐ)</Label>
              <Input
                type="text"
                id="dongia"
                name="DonGia"
                placeholder="3.000"
                className="rounded mt-2 shadow-none text-right"
                value={formData.DonGia}
                onChange={handleChange}
                disabled={isFormDisabled}
                aria-label="Đơn giá dịch vụ"
              />
            </div>
            <div>
              <Label htmlFor="donvitinh">Đơn vị tính</Label>
              <Input
                type="text"
                id="donvitinh"
                name="DonViTinh"
                placeholder="kWh, m³, tháng, ..."
                className="rounded mt-2 shadow-none"
                value={formData.DonViTinh}
                onChange={handleChange}
                disabled={isFormDisabled}
                aria-label="Đơn vị tính"
              />
            </div>
            <div>
              <Label htmlFor="code">Mã dịch vụ</Label>
              <Input
                type="text"
                id="code"
                name="Code"
                placeholder="DV001, ..."
                className="rounded mt-2 shadow-none"
                value={formData.Code}
                onChange={handleChange}
                disabled={isFormDisabled}
                aria-label="Mã dịch vụ"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="cachtinhphi">Cách tính phí</Label>
              <Select
                value={formData.CachTinhPhi}
                onValueChange={handleCachTinhPhiChange}
                disabled={isFormDisabled}
              >
                <SelectTrigger
                  id="cachtinhphi"
                  className="rounded mt-2 shadow-none w-full cursor-pointer"
                  aria-label="Cách tính phí"
                >
                  <SelectValue placeholder="Chọn cách tính phí" />
                </SelectTrigger>
                <SelectContent className="rounded">
                  <SelectItem className="cursor-pointer" value="CHI_SO">
                    Tính theo chỉ số
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="SO_LUONG">
                    Tính theo số lượng
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="CO_DINH">
                    Tính theo tháng
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="batbuoc"
                name="BatBuoc"
                checked={formData.BatBuoc}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, BatBuoc: checked }))
                }
                disabled={isFormDisabled}
                aria-label="Dịch vụ bắt buộc"
                className="rounded-xs cursor-pointer"
              />
              <Label htmlFor="batbuoc" className="cursor-pointer">
                Dịch vụ bắt buộc
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              disabled={isFormDisabled}
              aria-label="Thêm dịch vụ mới"
            >
              {mutationCreateService.isPending ? (
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
              aria-label="Hủy thêm dịch vụ"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddService;
