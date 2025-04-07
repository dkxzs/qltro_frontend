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
import { createRoomService } from "@/services/roomServices";
import { getAllRoomTypeService } from "@/services/roomTypeServices";
import { getAllHouseService } from "@/services/houseServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
    trangThai: 0,
    anh: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const { data: roomTypeData } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getAllRoomTypeService,
    enabled: open,
  });

  const { data: houseData } = useQuery({
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
      trangThai: 0,
      anh: null,
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
      setOpen(false);
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
    if (!formData.anh) {
      toast.error("Vui lòng chọn ảnh");
      return;
    }

    mutationCreateRoom.mutate({ data: formData });
  };

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
        className="w-1/2 rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenPhong" className="text-right">
                Tên phòng
              </Label>
              <Input
                id="tenPhong"
                name="tenPhong"
                value={formData.tenPhong}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                placeholder="Nhập tên phòng"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maNha" className="text-right">
                Nhà
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.maNha}
                  onValueChange={(value) =>
                    setFormData({ ...formData, maNha: value })
                  }
                >
                  <SelectTrigger className="w-full rounded cursor-pointer shadow-none">
                    <SelectValue placeholder="Chọn nhà" />
                  </SelectTrigger>
                  <SelectContent className="rounded">
                    {houseData?.DT &&
                      houseData.DT.length > 0 &&
                      houseData.DT.map((house) => (
                        <SelectItem
                          key={house.MaNha}
                          value={house.MaNha.toString()}
                          className="cursor-pointer"
                        >
                          {house.TenNha}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maLoaiPhong" className="text-right">
                Loại phòng
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.maLoaiPhong}
                  onValueChange={(value) =>
                    setFormData({ ...formData, maLoaiPhong: value })
                  }
                >
                  <SelectTrigger className="w-full rounded cursor-pointer shadow-none">
                    <SelectValue placeholder="Chọn loại phòng" />
                  </SelectTrigger>
                  <SelectContent className="rounded">
                    {roomTypeData?.DT &&
                      roomTypeData.DT.length > 0 &&
                      roomTypeData.DT.map((type) => (
                        <SelectItem
                          key={type.MaLP}
                          value={type.MaLP.toString()}
                          className="cursor-pointer"
                        >
                          {type.TenLoaiPhong} - {type.DonGia.toLocaleString()}đ
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dienTich" className="text-right">
                Diện tích (m²)
              </Label>
              <Input
                id="dienTich"
                name="dienTich"
                value={formData.dienTich}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                placeholder="Nhập diện tích phòng"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="moTa" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="moTa"
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                className="col-span-3 shadow-none"
                placeholder="Nhập mô tả phòng"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="anh" className="text-right">
                Hình ảnh
              </Label>
              <div className="col-span-3">
                <Input
                  id="anh"
                  name="anh"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChangeImage(e)}
                  hidden
                  className="col-span-3 rounded cursor-pointer"
                  ref={inputRef}
                />
                {previewImage ? (
                  <>
                    <div
                      className="w-35 rounded border-dashed border-2 cursor-pointer"
                      onClick={() => inputRef.current.click()}
                    >
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-35 h-35 rounded p-1"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="w-35 h-35 cursor-pointer rounded border-dashed border-2 flex items-center justify-center"
                      onClick={() => inputRef.current.click()}
                    >
                      Chọn ảnh
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="mr-2 cursor-pointer rounded"
            >
              Đóng
            </Button>
            <Button
              type="submit"
              disabled={mutationCreateRoom.isPending}
              className="cursor-pointer rounded"
            >
              {mutationCreateRoom.isPending ? "Đang xử lý..." : "Thêm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddRoom;
