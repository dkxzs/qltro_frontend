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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateCustomerService } from "@/services/customerServices";
import { formatDateForInput } from "@/utils/dateFormat";
import { useMutation } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateUser = (props) => {
  const { dataUpdate, refetch } = props;
  const [formData, setFormData] = useState({
    name: "",
    cardId: "",
    gender: "Nam",
    birthday: "",
    phoneNumber: "",
    email: "",
    address: "",
    avatar: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (dataUpdate && open) {
      setFormData({
        name: dataUpdate?.HoTen || "",
        cardId: dataUpdate?.CCCD || "",
        gender: dataUpdate?.GioiTinh || "Nam",
        birthday: formatDateForInput(dataUpdate?.NgaySinh) || "",
        phoneNumber: dataUpdate?.DienThoai || "",
        email: dataUpdate?.Email || "",
        address: dataUpdate?.DiaChi || "",
        avatar: dataUpdate?.Anh || "",
      });
      setPreviewImage(dataUpdate?.Anh || null);
    }
  }, [dataUpdate, open]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      const objectURL = URL.createObjectURL(file);
      setPreviewImage(objectURL);
      setFormData((prevFormData) => ({
        ...prevFormData,
        avatar: file,
      }));
    }
  };

  const handleClickImage = () => {
    inputRef.current.click();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cardId: "",
      gender: "Nam",
      birthday: "",
      phoneNumber: "",
      email: "",
      address: "",
      avatar: "",
    });
    setPreviewImage(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Tên không được để trống");
      return false;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error("Số điện thoại phải là 10 chữ số");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Địa chỉ không được để trống");
      return false;
    }
    const cardIdRegex = /^\d{12}$/;
    if (!cardIdRegex.test(formData.cardId)) {
      toast.error("Số căn cước công dân phải là 12 chữ số");
      return false;
    }
    if (!formData.birthday) {
      toast.error("Ngày sinh không được để trống");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không đúng định dạng");
      return false;
    }
    if (!formData.avatar) {
      toast.error("Ảnh không được để trống");
      return false;
    }
    return true;
  };

  const mutationUpdateCustomer = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateCustomerService(id, data);
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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutationUpdateCustomer.mutate({ id: dataUpdate?.MaKH, data: formData });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="mr-2 flex items-center cursor-pointer bg-blue-500 hover:bg-blue-600 rounded text-white p-0 h-auto"
          onClick={() => setOpen(true)}
        >
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
          <DialogTitle>Sửa thông tin khách trọ</DialogTitle>
          <DialogDescription>
            Vui lòng cập nhật đầy đủ thông tin khách trọ.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Họ Tên</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Nguyễn Văn A"
                className="rounded mt-2"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="cardId">Số căn cước công dân</Label>
              <Input
                type="number"
                id="cardId"
                name="cardId"
                placeholder="123456789"
                className="rounded mt-2"
                value={formData.cardId}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="gender">Giới tính</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <div className="flex mt-3 gap-2 items-center">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Nam"
                      id="r1"
                      className="cursor-pointer"
                    />
                    <Label htmlFor="r1" className="font-normal cursor-pointer">
                      Nam
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Nu"
                      id="r2"
                      className="cursor-pointer"
                    />
                    <Label htmlFor="r2" className="font-normal cursor-pointer">
                      Nữ
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="birthday">Ngày sinh</Label>
              <Input
                type="date"
                id="birthday"
                name="birthday"
                className="rounded mt-2"
                value={formData.birthday}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="0123456789"
                className="rounded mt-2"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="abc@gmail.com"
                className="rounded mt-2"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="Địa chỉ"
                className="rounded mt-2"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="avatar">Ảnh</Label>
              <Input
                type="file"
                id="avatar"
                name="avatar"
                className="rounded mt-2"
                hidden
                accept="image/*"
                onChange={(e) => handleChangeImage(e)}
                ref={inputRef}
              />
              <div
                className="mt-2 border rounded p-4 flex items-center justify-center cursor-pointer"
                onClick={handleClickImage}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Avatar"
                    className="w-25 h-25 object-contain rounded-full border"
                  />
                ) : (
                  <div className="flex items-center justify-center cursor-pointer">
                    Không có ảnh
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
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

export default ModalUpdateUser;
