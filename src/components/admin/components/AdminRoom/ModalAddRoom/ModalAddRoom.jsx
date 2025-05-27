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
import { Textarea } from "@/components/ui/textarea";
import { getAllHouseService } from "@/services/houseServices";
import { createRoomService } from "@/services/roomServices";
import { getAllRoomTypeService } from "@/services/roomTypeServices";
import { ROOM_STATUS_VALUE } from "@/utils/roomStatusUtils";
import { useMutation, useQuery } from "@tanstack/react-query";
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

const ModalAddRoom = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    tenPhong: "",
    maNha: "",
    maLoaiPhong: "",
    dienTich: "",
    moTa: "",
    soLuongNguoiToiDa: "",
    trangThai: ROOM_STATUS_VALUE["Còn trống"],
    chiSoDien: "",
    chiSoNuoc: "",
  });
  const [tempFiles, setTempFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: roomTypeData, isLoading: isRoomTypeLoading } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getAllRoomTypeService,
    enabled: open,
  });

  const { data: houseData, isLoading: isHouseLoading } = useQuery({
    queryKey: ["houses"],
    queryFn: getAllHouseService,
    enabled: open,
  });

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "chiSoDien" || name === "chiSoNuoc") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.every((file) => file.type.startsWith("image/"))) {
      toast.error("Vui lòng chỉ chọn file ảnh!");
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      toast.error("Mỗi file ảnh không được vượt quá 5MB!");
      return;
    }
    if (tempFiles.length + files.length > 5) {
      toast.error("Chỉ được chọn tối đa 5 ảnh!");
      return;
    }

    const newPreviews = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });
    });

    Promise.all(newPreviews).then((newPreviewUrls) => {
      setTempFiles((prev) => [...prev, ...files]);
      setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    });
  };

  const handleRemoveImage = (index) => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    setTempFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      tenPhong: "",
      maNha: "",
      maLoaiPhong: "",
      dienTich: "",
      moTa: "",
      soLuongNguoiToiDa: "",
      trangThai: ROOM_STATUS_VALUE["Còn trống"],
      chiSoDien: "",
      chiSoNuoc: "",
    });
    setTempFiles([]);
    setPreviewImages([]);
  };

  const mutationCreateRoom = useMutation({
    mutationFn: async ({ data, files }) => {
      const images = [];
      if (files.length > 0) {
        // Upload từng ảnh với authParams riêng
        for (const file of files) {
          // Gọi API xác thực cho mỗi ảnh
          const authResponse = await axios.get(
            "http://localhost:8000/api/image/auth"
          );
          const authParams = authResponse.data.DT;

          if (
            !authParams.signature ||
            !authParams.token ||
            !authParams.expire
          ) {
            throw new Error("Thông tin xác thực không hợp lệ từ backend");
          }

          const response = await upload({
            file,
            fileName: `room-image-${Date.now()}-${file.name}`,
            publicKey: imagekitConfig.publicKey,
            ...authParams,
          });

          if (!response.url || !response.fileId) {
            throw new Error(
              "Upload không thành công, không nhận được URL hoặc fileId"
            );
          }

          images.push({
            Url: response.url,
            FileId: response.fileId,
          });
        }
      }

      return createRoomService({
        ...data,
        images,
      });
    },
    onSuccess: (data) => {
      toast.success(
        data.EM || `Thêm phòng thành công, đã upload ${tempFiles.length} ảnh`
      );
      resetForm();
      setTimeout(() => setOpen(false), 300);
      if (refetch) refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra khi thêm phòng");
    },
  });

  const validateForm = () => {
    if (!formData.tenPhong) {
      toast.error("Vui lòng nhập tên phòng");
      return false;
    }
    if (!formData.maNha) {
      toast.error("Vui lòng chọn nhà");
      return false;
    }
    if (!formData.maLoaiPhong) {
      toast.error("Vui lòng chọn loại phòng");
      return false;
    }
    if (!formData.dienTich) {
      toast.error("Vui lòng nhập diện tích phòng");
      return false;
    }
    if (!formData.soLuongNguoiToiDa) {
      toast.error("Vui lòng nhập số lượng người tối đa");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsUploading(true);
      try {
        await mutationCreateRoom.mutateAsync({
          data: formData,
          files: tempFiles,
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const isFormDisabled =
    mutationCreateRoom.isPending ||
    isRoomTypeLoading ||
    isHouseLoading ||
    isUploading;

  return (
    <ImageKitProvider config={imagekitConfig}>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) resetForm();
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-green-700 hover:bg-green-800 cursor-pointer rounded hover:text-white">
            <Plus className="h-4 w-4" />
            Thêm phòng
          </Button>
        </DialogTrigger>
        <DialogContent
          className="w-1/2 rounded max-h-[95vh] overflow-hidden transition-all duration-300 ease-in-out"
          onInteractOutside={(event) => {
            event.preventDefault();
          }}
        >
          <div
            className="scrollbar-hide overflow-y-auto pr-1"
            style={{
              maxHeight: "90vh",
            }}
          >
            <DialogHeader>
              <DialogTitle>Thêm phòng mới</DialogTitle>
              <DialogDescription>
                Vui lòng nhập thông tin của phòng mới.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenPhong" className="text-right">
                      Tên phòng
                    </Label>
                    <Input
                      id="tenPhong"
                      name="tenPhong"
                      value={formData.tenPhong}
                      onChange={handleChange}
                      className="rounded shadow-none"
                      placeholder="Nhập tên phòng"
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maNha" className="text-right">
                      Nhà
                    </Label>
                    <Select
                      value={formData.maNha}
                      onValueChange={(value) =>
                        setFormData({ ...formData, maNha: value })
                      }
                      disabled={isFormDisabled}
                    >
                      <SelectTrigger className="w-full rounded cursor-pointer shadow-none">
                        <SelectValue placeholder="Chọn nhà" />
                      </SelectTrigger>
                      <SelectContent className="rounded w-full">
                        {isHouseLoading ? (
                          <SelectItem disabled value="loading">
                            Đang tải...
                          </SelectItem>
                        ) : (
                          houseData?.DT &&
                          houseData.DT.length > 0 &&
                          houseData.DT.map((house) => (
                            <SelectItem
                              key={house.MaNha}
                              value={house.MaNha.toString()}
                              className="cursor-pointer"
                            >
                              {house.TenNha}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maLoaiPhong" className="text-right">
                      Loại phòng
                    </Label>
                    <Select
                      value={formData.maLoaiPhong}
                      onValueChange={(value) =>
                        setFormData({ ...formData, maLoaiPhong: value })
                      }
                      disabled={isFormDisabled}
                    >
                      <SelectTrigger className="w-full rounded cursor-pointer shadow-none">
                        <SelectValue placeholder="Chọn loại phòng" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        {isRoomTypeLoading ? (
                          <SelectItem disabled value="loading">
                            Đang tải...
                          </SelectItem>
                        ) : (
                          roomTypeData?.DT &&
                          roomTypeData.DT.length > 0 &&
                          roomTypeData.DT.map((type) => (
                            <SelectItem
                              key={type.MaLP}
                              value={type.MaLP.toString()}
                              className="cursor-pointer"
                            >
                              {type.TenLoaiPhong} -{" "}
                              {type.DonGia.toLocaleString()}đ
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dienTich" className="text-right">
                      Diện tích (m²)
                    </Label>
                    <Input
                      id="dienTich"
                      name="dienTich"
                      type="number"
                      value={formData.dienTich}
                      onChange={handleChange}
                      className="rounded shadow-none"
                      placeholder="Nhập diện tích phòng"
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chiSoDien" className="text-right">
                      Chỉ số điện ban đầu
                    </Label>
                    <Input
                      id="chiSoDien"
                      name="chiSoDien"
                      type="number"
                      value={formData.chiSoDien}
                      onChange={handleChange}
                      className="rounded shadow-none"
                      placeholder="Nhập chỉ số điện ban đầu"
                      disabled={isFormDisabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chiSoNuoc" className="text-right">
                      Chỉ số nước ban đầu
                    </Label>
                    <Input
                      id="chiSoNuoc"
                      name="chiSoNuoc"
                      type="number"
                      value={formData.chiSoNuoc}
                      onChange={handleChange}
                      className="rounded shadow-none"
                      placeholder="Nhập chỉ số nước ban đầu"
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soLuongNguoiToiDa" className="text-right">
                      Số lượng người tối đa
                    </Label>
                    <Input
                      id="soLuongNguoiToiDa"
                      name="soLuongNguoiToiDa"
                      type="number"
                      value={formData.soLuongNguoiToiDa}
                      onChange={handleChange}
                      className="rounded shadow-none"
                      placeholder="Nhập số lượng người tối đa"
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>
                <div className="grid items-start gap-2">
                  <Label htmlFor="moTa" className="text-right">
                    Mô tả
                  </Label>
                  <Textarea
                    id="moTa"
                    name="moTa"
                    value={formData.moTa}
                    onChange={handleChange}
                    className="shadow-none"
                    placeholder="Nhập mô tả phòng"
                    rows={4}
                    disabled={isFormDisabled}
                  />
                </div>
                <div className="grid items-start gap-2">
                  <Label className="text-right">Hình ảnh</Label>
                  <div className="flex flex-wrap gap-4 overflow-x-auto">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="max-w-[150px] h-auto rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-0 right-0 rounded-full p-1"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isFormDisabled}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div
                      className="flex items-center w-40 h-40 justify-center border-2 border-dashed border-gray-300 rounded p-4 cursor-pointer"
                      onClick={() =>
                        !isFormDisabled && fileInputRef.current.click()
                      }
                    >
                      <Plus />
                      Chọn ảnh
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      disabled={isFormDisabled}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-red-500 mt-1 font-bold">
                * Lưu ý: Chỉ số điện và nước sẽ không thể chỉnh sửa sau khi lưu.
                Vui lòng nhập chính xác.
              </p>
              <DialogFooter className="mb-1">
                <Button
                  type="submit"
                  disabled={isFormDisabled}
                  className="cursor-pointer rounded bg-blue-600 flex items-center gap-2"
                >
                  {isFormDisabled ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Lưu"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded"
                  disabled={isFormDisabled}
                  variant="destructive"
                >
                  Đóng
                </Button>
              </DialogFooter>
            </form>
          </div>
          <style>
            {`
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
        </DialogContent>
      </Dialog>
    </ImageKitProvider>
  );
};

export default ModalAddRoom;
