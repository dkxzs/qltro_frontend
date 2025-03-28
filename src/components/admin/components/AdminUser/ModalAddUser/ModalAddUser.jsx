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
import { createCustomerService } from "@/services/customerServices";
import { useMutation } from "@tanstack/react-query";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ModalAddUser = () => {
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
    return () => {
      if (previewImage) {
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
      if (previewImage) {
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

  const mutationCreateCustomer = useMutation({
    mutationFn: async (data) => {
      const res = await createCustomerService(data);
      return res;
    },
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success("Thêm khách trọ thành công");
        resetForm();
        setOpen(false);
      } else {
        toast.error("Thêm thất bại");
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    mutationCreateCustomer.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mr-2 flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded">
          <Plus className="h-5 w-5" />
          Thêm khách trọ
        </Button>
      </DialogTrigger>
      <DialogContent className="w-3/5 rounded">
        <DialogHeader>
          <DialogTitle>Thêm khách trọ</DialogTitle>
          <DialogDescription>
            Vui lòng nhập đầy đủ thông tin để thêm khách trọ.
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
                {formData.avatar ? (
                  <>
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Avatar"
                        className="w-25 h-25 object-contain rounded-full border"
                      />
                    )}
                  </>
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
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddUser;
