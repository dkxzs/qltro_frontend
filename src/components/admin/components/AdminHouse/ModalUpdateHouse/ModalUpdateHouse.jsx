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

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateHouse = (props) => {
  const { dataUpdate, refetch } = props;
  const [formData, setFormData] = useState({
    TenNha: "",
    DiaChi: "",
    MoTa: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dataUpdate && open) {
      setFormData({
        TenNha: dataUpdate.TenNha || "",
        DiaChi: dataUpdate.DiaChi || "",
        MoTa: dataUpdate.MoTa || "",
      });
    }
  }, [dataUpdate, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
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
      setOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutationUpdateHouse.mutate({
        id: dataUpdate.MaNha,
        data: formData,
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
          <DialogTitle>Cập nhật thông tin nhà</DialogTitle>
          <DialogDescription>
            Vui lòng cập nhật thông tin nhà.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tennha">Tên nhà</Label>
              <Input
                type="text"
                id="tennha"
                name="TenNha"
                placeholder="Nhà A"
                className="rounded mt-2"
                value={formData.TenNha}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="diachi">Địa chỉ</Label>
              <Input
                type="text"
                id="diachi"
                name="DiaChi"
                placeholder="123 Đường ABC, Quận XYZ"
                className="rounded mt-2"
                value={formData.DiaChi}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="mota">Mô tả</Label>
              <Textarea
                id="mota"
                name="MoTa"
                placeholder="Mô tả chi tiết về nhà"
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

export default ModalUpdateHouse;
