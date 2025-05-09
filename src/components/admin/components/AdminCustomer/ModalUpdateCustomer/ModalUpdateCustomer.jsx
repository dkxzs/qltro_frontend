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
import {
  updateCustomerService,
  checkCustomerHasRentService,
} from "@/services/customerServices";
import { formatDateForInput } from "@/utils/dateFormat";
import { useMutation } from "@tanstack/react-query";
import { Pencil, Loader2, SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateUser = ({ dataUpdate, refetch }) => {
  const date = new Date().toISOString().split("T")[0]; // Ngày hiện tại dạng YYYY-MM-DD
  const [formData, setFormData] = useState({
    name: "",
    cardId: "",
    gender: "Nam",
    birthday: "",
    phoneNumber: "",
    email: "",
    address: "",
    avatar: "",
    dateOfIssue: "",
    placeOfIssue: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [hasRent, setHasRent] = useState(false);

  useEffect(() => {
    if (dataUpdate && open) {
      const newFormData = {
        name: dataUpdate?.HoTen || "",
        cardId: dataUpdate?.CCCD || "",
        gender: dataUpdate?.GioiTinh || "Nam",
        birthday: formatDateForInput(dataUpdate?.NgaySinh) || "",
        phoneNumber: dataUpdate?.DienThoai || "",
        email: dataUpdate?.Email || "",
        address: dataUpdate?.DiaChi || "",
        dateOfIssue: formatDateForInput(dataUpdate?.NgayCap) || "",
        placeOfIssue: dataUpdate?.NoiCap || "",
        avatar: dataUpdate?.Anh || "",
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
      setPreviewImage(dataUpdate?.Anh || null);
    }
  }, [dataUpdate, open]);

  useEffect(() => {
    if (open && dataUpdate?.MaKH) {
      const checkHasRent = async () => {
        try {
          const response = await checkCustomerHasRentService(dataUpdate.MaKH);
          if (response.EC === 0) {
            setHasRent(response.DT);
          }
        } catch (error) {
          console.error("Error checking rent status:", error);
          toast.error("Không thể kiểm tra trạng thái thuê. Vui lòng thử lại.");
        }
      };
      checkHasRent();
    }
  }, [open, dataUpdate?.MaKH]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn tệp ảnh (JPG, PNG, v.v.)");
        return;
      }
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      const objectURL = URL.createObjectURL(file);
      setPreviewImage(objectURL);
      setFormData((prev) => ({
        ...prev,
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
      dateOfIssue: "",
      placeOfIssue: "",
    });
    setInitialFormData(null);
    setPreviewImage(null);
  };

  const mutationUpdateCustomer = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await updateCustomerService(id, data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi cập nhật khách trọ");
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
      console.error("Update customer error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Cập nhật khách trọ thất bại: Có dữ liệu liên quan không hợp lệ. Vui lòng kiểm tra lại."
        : error.message || "Đã có lỗi xảy ra khi cập nhật khách trọ";
      toast.error(errorMessage);
    },
  });

  function isOver18(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  }

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

    if (formData.birthday > date) {
      toast.error("Ngày sinh không được lớn hơn ngày hiện tại");
      return false;
    }

    if (!isOver18(formData.birthday)) {
      toast.error("Khách hàng phải lớn hơn 18 tuổi");
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

    if (!formData.dateOfIssue) {
      toast.error("Ngày cấp không được để trống");
      return false;
    }

    if (formData.dateOfIssue > date) {
      toast.error("Ngày cấp không được lớn hơn ngày hiện tại");
      return false;
    }

    if (!formData.placeOfIssue.trim()) {
      toast.error("Nơi cấp không được để trống");
      return false;
    }

    return true;
  };

  const isFormDataChanged = () => {
    if (!initialFormData) return true;
    return (
      formData.name !== initialFormData.name ||
      formData.cardId !== initialFormData.cardId ||
      formData.gender !== initialFormData.gender ||
      formData.birthday !== initialFormData.birthday ||
      formData.phoneNumber !== initialFormData.phoneNumber ||
      formData.email !== initialFormData.email ||
      formData.address !== initialFormData.address ||
      formData.dateOfIssue !== initialFormData.dateOfIssue ||
      formData.placeOfIssue !== initialFormData.placeOfIssue ||
      formData.avatar !== initialFormData.avatar
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormDataChanged()) {
      toast.info("Không có thay đổi để cập nhật");
      return;
    }
    if (validateForm()) {
      mutationUpdateCustomer.mutate({
        id: dataUpdate?.MaKHINVITE_ONLY,
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

  const isFormLocked = hasRent; // Các trường bị khóa khi hasRent
  const isFormProcessing = mutationUpdateCustomer.isPending; // Form đang xử lý mutation

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Cập nhật thông tin khách trọ"
        >
          <SquarePen className="size-5 text-blue-700" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin khách trọ</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin khách trọ. Một số trường có thể bị khóa nếu khách
            trọ đang thuê phòng.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Họ Tên</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Nguyễn Văn A"
                className="rounded mt-2 shadow-none"
                value={formData.name}
                onChange={handleChange}
                disabled={isFormLocked || isFormProcessing}
              />
            </div>
            <div>
              <Label htmlFor="gender">Giới tính</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
                disabled={isFormLocked || isFormProcessing}
                className="mt-3"
              >
                <div className="flex gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Nam"
                      id="r1"
                      className="cursor-pointer border-black"
                      disabled={isFormLocked || isFormProcessing}
                    />
                    <Label
                      htmlFor="r1"
                      className={`font-normal ${
                        isFormLocked || isFormProcessing
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      Nam
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Nu"
                      id="r2"
                      className="cursor-pointer border-slate-500"
                      disabled={isFormLocked || isFormProcessing}
                    />
                    <Label
                      htmlFor="r2"
                      className={`font-normal ${
                        isFormLocked || isFormProcessing
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      Nữ
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="cardId">Số căn cước công dân</Label>
              <Input
                type="text"
                id="cardId"
                name="cardId"
                placeholder="123456789012"
                className="rounded mt-2 shadow-none"
                value={formData.cardId}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 12);
                  setFormData((prev) => ({ ...prev, cardId: value }));
                }}
                disabled={true} // Giữ disabled theo code gốc
              />
            </div>
            <div>
              <Label htmlFor="dateOfIssue">Ngày cấp</Label>
              <Input
                type="date"
                id="dateOfIssue"
                name="dateOfIssue"
                max={date}
                className="rounded mt-2 shadow-none"
                value={formData.dateOfIssue}
                onChange={handleChange}
                disabled={isFormLocked || isFormProcessing}
              />
            </div>
            <div>
              <Label htmlFor="placeOfIssue">Nơi cấp</Label>
              <Input
                type="text"
                id="placeOfIssue"
                name="placeOfIssue"
                placeholder="Công an TP. Hà Nội"
                className="rounded mt-2 shadow-none"
                value={formData.placeOfIssue}
                onChange={handleChange}
                disabled={isFormLocked || isFormProcessing}
              />
            </div>
            <div>
              <Label htmlFor="birthday">Ngày sinh</Label>
              <Input
                type="date"
                id="birthday"
                name="birthday"
                max={date}
                className="rounded mt-2 shadow-none"
                value={formData.birthday}
                onChange={handleChange}
                disabled={isFormLocked || isFormProcessing}
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="0123456789"
                className="rounded mt-2 shadow-none"
                value={formData.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 10);
                  setFormData((prev) => ({ ...prev, phoneNumber: value }));
                }}
                disabled={isFormLocked || isFormProcessing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="abc@gmail.com"
                className="rounded mt-2 shadow-none"
                value={formData.email}
                onChange={handleChange}
                disabled={isFormProcessing} // Luôn cho phép chỉnh sửa khi không xử lý
              />
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="123 Đường ABC, Quận XYZ"
                className="rounded mt-2 shadow-none"
                value={formData.address}
                onChange={handleChange}
                disabled={isFormProcessing} // Luôn cho phép chỉnh sửa khi không xử lý
              />
            </div>
            <div>
              <Label htmlFor="avatar">Ảnh</Label>
              <Input
                type="file"
                id="avatar"
                name="avatar"
                className="hidden"
                accept="image/*"
                onChange={handleChangeImage}
                ref={inputRef}
                disabled={isFormProcessing} // Luôn cho phép chỉnh sửa khi không xử lý
              />
              <div
                className={`mt-2 w-40 h-40 border-2 border-dashed rounded p-4 flex items-center justify-center ${
                  isFormProcessing
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
                onClick={isFormProcessing ? null : handleClickImage}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Avatar preview"
                    className="w-32 h-32 object-contain rounded-full border"
                  />
                ) : (
                  <div className="flex items-center justify-center gap-1 text-lg font-mono">
                    Chọn ảnh
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              disabled={isFormProcessing}
              aria-label="Cập nhật thông tin khách trọ"
            >
              {isFormProcessing ? (
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
              disabled={isFormProcessing}
              variant="destructive"
              aria-label="Hủy cập nhật khách trọ"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateUser;
