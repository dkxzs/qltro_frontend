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
import { Loader2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ModalAddRoom = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({
    tenPhong: "",
    maNha: "",
    maLoaiPhong: "",
    dienTich: "",
    moTa: "",
    soLuongNguoiToiDa: "",
    trangThai: ROOM_STATUS_VALUE["Còn trống"],
    anh: null,
    chiSoDien: "",
    chiSoNuoc: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

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
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

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
        anh: file,
      }));
    }
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
      anh: null,
      chiSoDien: "",
      chiSoNuoc: "",
    });
    setPreviewImage(null);
  };

  const mutationCreateRoom = useMutation({
    mutationFn: async ({ data }) => {
      const res = await createRoomService(data);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM || "Thêm phòng thành công");
      resetForm();
      setTimeout(() => setOpen(false), 300);
      if (refetch) refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra khi thêm phòng");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.tenPhong) {
      toast.error("Vui lòng nhập tên phòng");
      return;
    }
    if (!formData.maNha) {
      toast.error("Vui lòng chọn nhà");
      return;
    }
    if (!formData.maLoaiPhong) {
      toast.error("Vui lòng chọn loại phòng");
      return;
    }
    if (!formData.dienTich) {
      toast.error("Vui lòng nhập diện tích phòng");
      return;
    }
    if (!formData.soLuongNguoiToiDa) {
      toast.error("Vui lòng nhập số lượng người tối đa");
      return;
    }
    if (!formData.chiSoDien) {
      toast.error("Vui lòng nhập chỉ số điện");
      return;
    }
    if (!formData.chiSoNuoc) {
      toast.error("Vui lòng nhập chỉ số nước");
      return;
    }
    if (!formData.anh) {
      toast.error("Vui lòng chọn ảnh");
      return;
    }

    mutationCreateRoom.mutate({ data: formData });
  };

  const isFormDisabled =
    mutationCreateRoom.isPending || isRoomTypeLoading || isHouseLoading;

  return (
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
                  <div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maLoaiPhong" className="text-right">
                    Loại phòng
                  </Label>
                  <div>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dienTich" className="text-right">
                    Diện tích (m²)
                  </Label>
                  <Input
                    id="dienTich"
                    name="dienTich"
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
                  <div>
                    <Input
                      id="chiSoDien"
                      name="chiSoDien"
                      value={formData.chiSoDien}
                      onChange={handleChange}
                      className="rounded shadow-none"
                      placeholder="Nhập chỉ số điện ban đầu"
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chiSoNuoc" className="text-right">
                    Chỉ số nước ban đầu
                  </Label>
                  <div>
                    <Input
                      id="chiSoNuoc"
                      name="chiSoNuoc"
                      value={formData.chiSoNuoc}
                      onChange={handleChange}
                      className="rounded shadow-none"
                      placeholder="Nhập chỉ số nước ban đầu"
                      disabled={isFormDisabled}
                    />
                  </div>
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
                <Label htmlFor="anh" className="text-right">
                  Hình ảnh
                </Label>
                <div>
                  <Input
                    id="anh"
                    name="anh"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChangeImage(e)}
                    hidden
                    className="rounded cursor-pointer"
                    ref={inputRef}
                    disabled={isFormDisabled}
                  />
                  {previewImage ? (
                    <div
                      className="w-35 rounded border-dashed border-2 cursor-pointer"
                      onClick={() =>
                        !isFormDisabled && inputRef.current.click()
                      }
                    >
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-35 h-35 rounded p-1"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-35 h-35 cursor-pointer rounded border-dashed border-2 flex items-center justify-center"
                      onClick={() =>
                        !isFormDisabled && inputRef.current.click()
                      }
                    >
                      Chọn ảnh
                    </div>
                  )}
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
                {mutationCreateRoom.isPending ? (
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
                className=" cursor-pointer rounded"
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
  );
};

export default ModalAddRoom;
