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

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateRoomType = (props) => {
  const { dataUpdate, refetch } = props;
  const [formData, setFormData] = useState({
    TenLoaiPhong: "",
    DonGia: "",
    MoTa: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dataUpdate && open) {
      setFormData({
        TenLoaiPhong: dataUpdate.TenLoaiPhong || "",
        DonGia: dataUpdate.DonGia ? dataUpdate.DonGia.toLocaleString() : "",
        MoTa: dataUpdate.MoTa || "",
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
      TenLoaiPhong: "",
      DonGia: "",
      MoTa: "",
    });
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
        setOpen(false);
        refetch();
      } else {
        toast.error(data.EM);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.EM || "Đã có lỗi xảy ra");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <DialogTitle>Cập nhật loại phòng</DialogTitle>
          <DialogDescription>
            Vui lòng cập nhật thông tin loại phòng.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenloaiphong">Tên loại phòng</Label>
              <Input
                type="text"
                id="tenloaiphong"
                name="TenLoaiPhong"
                placeholder="Phòng VIP"
                className="rounded mt-2"
                value={formData.TenLoaiPhong}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="dongia">Đơn giá (VNĐ)</Label>
              <Input
                type="text"
                id="dongia"
                name="DonGia"
                placeholder="2000000"
                className="rounded mt-2"
                value={formData.DonGia}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="mota">Mô tả</Label>
              <Textarea
                type="area"
                id="mota"
                name="MoTa"
                placeholder="Mô tả chi tiết về loại phòng"
                className="rounded mt-2 min-h-[100px]"
                value={formData.MoTa}
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

export default ModalUpdateRoomType;
