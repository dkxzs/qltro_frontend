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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStaffService } from "@/services/staffServices";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Plus, SquarePen, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { ImageKitProvider, upload } from "@imagekit/react";
import { deleteImageService } from "@/services/imageServices";
import axios from "@/utils/axiosCustomize";
import imagekitConfig from "@/utils/imagekit";

const ModalUpdateStaff = ({ dataUpdate, refetch }) => {
  const [formData, setFormData] = useState({
    HoTen: "",
    NgaySinh: "",
    GioiTinh: "",
    DienThoai: "",
    Email: "",
    DiaChi: "",
    ChucVu: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [open, setOpen] = useState(false);
  const [tempFile, setTempFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (dataUpdate && open) {
      const newFormData = {
        HoTen: dataUpdate.HoTen || "",
        NgaySinh: dataUpdate.NgaySinh
          ? new Date(dataUpdate.NgaySinh).toISOString().split("T")[0]
          : "",
        GioiTinh: dataUpdate.GioiTinh || "",
        DienThoai: dataUpdate.DienThoai || "",
        Email: dataUpdate.Email || "",
        DiaChi: dataUpdate.DiaChi || "",
        ChucVu: dataUpdate.ChucVu || "",
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
      setPreviewImage(dataUpdate.HinhAnh?.Url || null);
      setIsImageRemoved(false);
      setTempFile(null);
    }
  }, [dataUpdate, open]);

  useEffect(() => {
    return () => {
      if (previewImage && tempFile) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage, tempFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (previewImage && tempFile) {
      URL.revokeObjectURL(previewImage);
    }
    const objectURL = URL.createObjectURL(file);
    setTempFile(file);
    setPreviewImage(objectURL);
    setIsImageRemoved(false);
  };

  const handleRemoveImage = () => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    if (previewImage && tempFile) {
      URL.revokeObjectURL(previewImage);
    }
    setTempFile(null);
    setPreviewImage(null);
    setIsImageRemoved(true);
    if (imgRef.current) {
      imgRef.current.value = "";
    }
  };

  const resetForm = () => {
    setFormData({
      HoTen: "",
      NgaySinh: "",
      GioiTinh: "",
      DienThoai: "",
      Email: "",
      DiaChi: "",
      ChucVu: "",
    });
    setInitialFormData(null);
    setTempFile(null);
    setPreviewImage(null);
    setIsImageRemoved(false);
    if (imgRef.current) {
      imgRef.current.value = "";
    }
  };

  const mutationUpdateEmployee = useMutation({
    mutationFn: async ({ id, data, file, removeImage }) => {
      let imageData = {};
      if (file) {
        const authResponse = await axios.get(
          "http://localhost:8000/api/image/auth"
        );
        const authParams = authResponse.data.DT;

        if (!authParams.signature || !authParams.token || !authParams.expire) {
          throw new Error("Thông tin xác thực không hợp lệ từ backend");
        }

        if (dataUpdate.HinhAnh?.FileId) {
          await deleteImageService(dataUpdate.HinhAnh.FileId);
        }

        const response = await upload({
          file,
          fileName: `staff-image-${Date.now()}.${file.name.split(".").pop()}`,
          publicKey: imagekitConfig.publicKey,
          ...authParams,
        });

        if (!response.url || !response.fileId) {
          throw new Error(
            "Upload không thành công, không nhận được URL hoặc fileId"
          );
        }

        imageData = {
          Url: response.url,
          FileId: response.fileId,
        };
      } else if (removeImage && dataUpdate.HinhAnh?.FileId) {
        await deleteImageService(dataUpdate.HinhAnh.FileId);
        imageData = { Url: null, FileId: null };
      }

      return updateStaffService(id, { ...data, ...imageData });
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setTimeout(() => setOpen(false), 300);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra khi cập nhật nhân viên");
    },
  });

  const validateForm = () => {
    if (!formData.HoTen.trim()) {
      toast.error("Họ tên không được để trống");
      return false;
    }
    return true;
  };

  const isFormDataChanged = () => {
    if (!initialFormData) return true;
    return (
      formData.HoTen !== initialFormData.HoTen ||
      formData.NgaySinh !== initialFormData.NgaySinh ||
      formData.GioiTinh !== initialFormData.GioiTinh ||
      formData.DienThoai !== initialFormData.DienThoai ||
      formData.DiaChi !== initialFormData.DiaChi ||
      formData.ChucVu !== initialFormData.ChucVu ||
      !!tempFile ||
      isImageRemoved
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormDataChanged()) {
      toast.info("Không có thay đổi để cập nhật");
      return;
    }
    if (validateForm()) {
      setIsUploading(true);
      try {
        await mutationUpdateEmployee.mutateAsync({
          id: dataUpdate.MaNV,
          data: formData,
          file: tempFile,
          removeImage: isImageRemoved,
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleClose = () => {
    if (
      isFormDataChanged() &&
      !window.confirm("Dữ liệu chưa lưu sẽ mất. Tiếp tục?")
    ) {
      return;
    }
    setOpen(false);
    resetForm();
  };

  const isFormDisabled = mutationUpdateEmployee.isPending || isUploading;

  return (
    <ImageKitProvider config={imagekitConfig}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-transparent shadow-none outline-none cursor-pointer">
            <SquarePen className="h-4 w-4 text-blue-600" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-3/5 rounded">
          <DialogHeader>
            <DialogTitle>Cập nhật nhân viên</DialogTitle>
            <DialogDescription>
              Vui lòng cập nhật thông tin nhân viên.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hoten">Họ Tên *</Label>
                <Input
                  id="hoten"
                  name="HoTen"
                  value={formData.HoTen}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                  className="mt-2 rounded shadow-none"
                />
              </div>
              <div>
                <Label htmlFor="ngaysinh">Ngày Sinh</Label>
                <Input
                  id="ngaysinh"
                  name="NgaySinh"
                  type="date"
                  value={formData.NgaySinh}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                  className="mt-2 rounded shadow-none"
                />
              </div>
              <div>
                <Label htmlFor="gioitinh">Giới Tính</Label>
                <Select
                  name="GioiTinh"
                  value={formData.GioiTinh}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, GioiTinh: value }))
                  }
                  disabled={isFormDisabled}
                >
                  <SelectTrigger className="mt-2 rounded shadow-none w-full cursor-pointer">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent className="rounded">
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dienthoai">Điện Thoại</Label>
                <Input
                  id="dienthoai"
                  name="DienThoai"
                  value={formData.DienThoai}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 10);
                    setFormData((prev) => ({ ...prev, DienThoai: value }));
                  }}
                  disabled={isFormDisabled}
                  className="mt-2 rounded shadow-none"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  className="mt-2 rounded shadow-none"
                />
              </div>
              <div>
                <Label htmlFor="diachi">Địa Chỉ</Label>
                <Input
                  id="diachi"
                  name="DiaChi"
                  value={formData.DiaChi}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                  className="mt-2 rounded shadow-none"
                />
              </div>
              <div>
                <Label htmlFor="anh">Ảnh nhân viên</Label>
                <Input
                  id="anh"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isFormDisabled}
                  className="hidden"
                  ref={imgRef}
                />
                <div
                  className={`mt-2 w-56 h-44 border-2 border-dashed rounded p-4 flex items-center justify-center ${
                    isFormDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  onClick={isFormDisabled ? null : () => imgRef.current.click()}
                >
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-56 h-36 object-contain rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full cursor-pointer p-1"
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
              <div>
                <Label htmlFor="chucvu">Chức Vụ</Label>
                <Select
                  name="ChucVu"
                  value={formData.ChucVu}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, ChucVu: value }))
                  }
                  disabled={isFormDisabled}
                >
                  <SelectTrigger className="mt-2 rounded shadow-none w-full cursor-pointer">
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent className="rounded">
                    <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                    <SelectItem value="Quản lý">Quản lý</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-600 text-white cursor-pointer rounded shadow-none"
                disabled={isFormDisabled}
              >
                {isFormDisabled ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleClose}
                disabled={isFormDisabled}
                className="rounded shadow-none cursor-pointer"
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

export default ModalUpdateStaff;
