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
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ImageKitProvider, upload } from "@imagekit/react";
import axios from "@/utils/axiosCustomize";

const imagekitConfig = {
  publicKey: "public_5flKnxY8+H0nvPurdYRPyk/kKEU=",
  urlEndpoint: "https://ik.imagekit.io/sudodev",
  authenticationEndpoint: "http://localhost:8000/api/image/auth",
};

const ModalAddCustomer = ({ refetch }) => {
  const date = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    cardId: "",
    gender: "Nam",
    birthday: "",
    phoneNumberMain: "",
    phoneNumberSub: "",
    vehicleNumber: "",
    occupation: "",
    email: "",
    address: "",
    dateOfIssue: "",
    placeOfIssue: "",
  });
  const [tempFile, setTempFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); 
  const fileInputRef = useRef(null);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh (JPG, PNG, v.v.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB!");
      return;
    }

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    const objectURL = URL.createObjectURL(file);
    setTempFile(file);
    setPreviewImage(objectURL);
  };

  const handleRemoveImage = () => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setTempFile(null);
    setPreviewImage(null);
    fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cardId: "",
      gender: "Nam",
      birthday: "",
      phoneNumberMain: "",
      phoneNumberSub: "",
      vehicleNumber: "",
      occupation: "",
      email: "",
      address: "",
      dateOfIssue: "",
      placeOfIssue: "",
    });
    setTempFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const mutationCreateCustomer = useMutation({
    mutationFn: async (data) => {
      let image = null;
      if (tempFile) {
        const authResponse = await axios.get(
          "http://localhost:8000/api/image/auth"
        );
        const authParams = authResponse.data.DT;

        if (!authParams.signature || !authParams.token || !authParams.expire) {
          throw new Error("Thông tin xác thực không hợp lệ từ backend");
        }

        const response = await upload({
          file: tempFile,
          fileName: `customer-avatar-${Date.now()}-${tempFile.name}`,
          publicKey: imagekitConfig.publicKey,
          ...authParams,
        });

        if (!response.url || !response.fileId) {
          throw new Error(
            "Upload không thành công, không nhận được URL hoặc fileId"
          );
        }

        image = {
          Url: response.url,
          FileId: response.fileId,
        };
      }

      const payload = {
        name: data.name,
        cardId: data.cardId,
        gender: data.gender,
        birthday: data.birthday,
        phoneNumberMain: data.phoneNumberMain,
        phoneNumberSub: data.phoneNumberSub,
        vehicleNumber: data.vehicleNumber,
        occupation: data.occupation,
        email: data.email,
        address: data.address,
        dateOfIssue: data.dateOfIssue,
        placeOfIssue: data.placeOfIssue,
        image,
      };

      const res = await createCustomerService(payload);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi thêm khách trọ");
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
      console.error("Add customer error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Thêm khách trọ thất bại: Có dữ liệu liên quan không hợp lệ. Vui lòng kiểm tra lại."
        : error.message || "Đã có lỗi xảy ra khi thêm khách trọ";
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
    if (!phoneRegex.test(formData.phoneNumberMain)) {
      toast.error("Số điện thoại chính phải là 10 chữ số");
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

  const hasUnsavedChanges = () => {
    return (
      formData.name ||
      formData.cardId ||
      formData.phoneNumberMain ||
      formData.phoneNumberSub ||
      formData.vehicleNumber ||
      formData.occupation ||
      formData.email ||
      formData.address ||
      formData.birthday ||
      formData.dateOfIssue ||
      formData.placeOfIssue ||
      formData.gender !== "Nam" ||
      tempFile
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutationCreateCustomer.mutate(formData);
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

  const isFormDisabled = mutationCreateCustomer.isPending;

  return (
    <ImageKitProvider config={imagekitConfig}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded text-white"
            aria-label="Thêm khách trọ mới"
          >
            <Plus className="size-4" />
            Thêm khách trọ
          </Button>
        </DialogTrigger>
        <DialogContent
          className="w-3/5 max-h-[90vh] rounded transition-all duration-300 ease-in-out overflow-auto"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Thêm khách trọ</DialogTitle>
            <DialogDescription>
              Vui lòng nhập đầy đủ thông tin để thêm khách trọ.
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
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <Label htmlFor="gender">Giới tính</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                  disabled={isFormDisabled}
                  className="mt-3"
                >
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Nam"
                        id="r1"
                        className="cursor-pointer border-black"
                        disabled={isFormDisabled}
                      />
                      <Label
                        htmlFor="r1"
                        className={`font-normal ${
                          isFormDisabled
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
                        disabled={isFormDisabled}
                      />
                      <Label
                        htmlFor="r2"
                        className={`font-normal ${
                          isFormDisabled
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
                  disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumberMain">Số điện thoại 1</Label>
                <Input
                  type="tel"
                  id="phoneNumberMain"
                  name="phoneNumberMain"
                  placeholder="0123456789"
                  className="rounded mt-2 shadow-none"
                  value={formData.phoneNumberMain}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10);
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumberMain: value,
                    }));
                  }}
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumberSub">Số điện thoại 2</Label>
                <Input
                  type="tel"
                  id="phoneNumberSub"
                  name="phoneNumberSub"
                  placeholder="0123456789"
                  className="rounded mt-2 shadow-none"
                  value={formData.phoneNumberSub}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10);
                    setFormData((prev) => ({ ...prev, phoneNumberSub: value }));
                  }}
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <Label htmlFor="vehicleNumber">Số xe</Label>
                <Input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  placeholder="Ví dụ: 30A-123.45"
                  className="rounded mt-2 shadow-none"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <Label htmlFor="occupation">Nghề nghiệp</Label>
                <Input
                  type="text"
                  id="occupation"
                  name="occupation"
                  placeholder="Nhập nghề nghiệp"
                  className="rounded mt-2 shadow-none"
                  value={formData.occupation}
                  onChange={handleChange}
                  disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
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
                  onChange={handleImageSelect}
                  ref={fileInputRef}
                  disabled={isFormDisabled}
                />
                <div
                  className={`mt-2 w-56 h-44 border-2 border-dashed rounded p-4 flex items-center justify-center ${
                    isFormDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  onClick={
                    isFormDisabled ? null : () => fileInputRef.current.click()
                  }
                >
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Avatar preview"
                        className="w-56 h-36 object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full cursor-pointer"
                        onClick={handleRemoveImage}
                        disabled={isFormDisabled}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-lg font-mono">
                      <Plus className="size-7 text-black" />
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
                disabled={isFormDisabled}
                aria-label="Thêm khách trọ mới"
              >
                {mutationCreateCustomer.isPending ? (
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
                aria-label="Hủy thêm khách trọ"
              >
                Đóng
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ImageKitProvider>
  );
};

export default ModalAddCustomer;
