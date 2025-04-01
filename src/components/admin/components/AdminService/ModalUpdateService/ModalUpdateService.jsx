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
import { updateServiceService } from "@/services/serviceServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation } from "@tanstack/react-query";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateService = (props) => {
  const { dataUpdate, refetch } = props;
  const [formData, setFormData] = useState({
    TenDV: "",
    DonGia: "",
    DonViTinh: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dataUpdate && open) {
      setFormData({
        TenDV: dataUpdate.TenDV || "",
        DonGia: dataUpdate.DonGia ? dataUpdate.DonGia.toLocaleString() : "",
        DonViTinh: dataUpdate.DonViTinh || "",
      });
    }
  }, [dataUpdate, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "DonGia" ? formatCurrency(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      TenDV: "",
      DonGia: "",
      DonViTinh: "",
    });
  };

  const mutationUpdateService = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateServiceService(id, data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi cập nhật dịch vụ");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra");
    },
  });

  const validateForm = () => {
    const donGiaValue = formData.DonGia.replace(/\./g, "");

    if (!formData.TenDV.trim()) {
      toast.error("Tên dịch vụ không được để trống");
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

    if (!formData.DonViTinh.trim()) {
      toast.error("Đơn vị tính không được để trống");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        DonGia: parseInt(formData.DonGia.replace(/\./g, "")),
      };
      mutationUpdateService.mutate({
        id: dataUpdate.MaDV,
        data: dataToSubmit,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        if (!open) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="mr-2 flex items-center cursor-pointer bg-blue-500 hover:bg-blue-600 rounded text-white">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin dịch vụ</DialogTitle>
          <DialogDescription>
            Vui lòng cập nhật thông tin dịch vụ.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tendichvu">Tên dịch vụ</Label>
              <Input
                type="text"
                id="tendichvu"
                name="TenDV"
                placeholder="Điện, Nước, Internet, ..."
                className="rounded mt-2"
                value={formData.TenDV}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="dongia">Đơn giá (VNĐ)</Label>
              <Input
                type="text"
                id="dongia"
                name="DonGia"
                placeholder="3000"
                className="rounded mt-2"
                value={formData.DonGia}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="donvitinh">Đơn vị tính</Label>
              <Input
                type="text"
                id="donvitinh"
                name="DonViTinh"
                placeholder="kW/h, m3, ..."
                className="rounded mt-2"
                value={formData.DonViTinh}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            className="cursor-pointer rounded"
            onClick={() => {
              setOpen(!open);
            }}
          >
            Đóng
          </Button>
          <Button
            type="submit"
            className="cursor-pointer rounded"
            onClick={(e) => handleSubmit(e)}
          >
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateService;
