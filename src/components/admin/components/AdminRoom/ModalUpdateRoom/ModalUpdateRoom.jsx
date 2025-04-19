import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  checkRoomHasRentService,
  updateRoomService,
} from "@/services/roomServices";
import { getAllRoomTypeService } from "@/services/roomTypeServices";
import { getAllServiceService } from "@/services/serviceServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateRoom = ({ dataUpdate, refetch }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hasRent, setHasRent] = useState(false);
  const [status] = useState([
    { value: "0", label: "Còn trống" },
    { value: "1", label: "Đã cho thuê" },
    { value: "2", label: "Đang sửa chữa" },
    { value: "3", label: "Đặt cọc" },
  ]);
  const [formData, setFormData] = useState({
    tenPhong: "",
    maNha: "",
    maLoaiPhong: "",
    dienTich: "",
    diaChi: "",
    moTa: "",
    trangThai: "",
    anh: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const { data: dataRoomType } = useQuery({
    queryKey: ["roomType"],
    queryFn: () => getAllRoomTypeService(),
  });

  useEffect(() => {
    if (dataRoomType?.DT) {
      setRoomTypes(dataRoomType.DT);
    }
  }, [dataRoomType]);

  useEffect(() => {
    if (dataUpdate && open) {
      setFormData({
        tenPhong: dataUpdate.TenPhong || "",
        maNha: parseInt(dataUpdate.MaNha?.toString()),
        maLoaiPhong: dataUpdate.MaLP?.toString() || "1",
        dienTich: dataUpdate.DienTich?.toString() || "",
        moTa: dataUpdate.MoTa || "",
        trangThai: dataUpdate.TrangThai?.toString(),
        anh: null,
      });

      if (dataUpdate.Anh) {
        setPreviewImage(dataUpdate.Anh);
      } else {
        setPreviewImage(null);
      }
    }
  }, [dataUpdate, open]);

  const { data: dataService } = useQuery({
    queryKey: ["checkRoomHasRent", dataUpdate.MaPT],
    queryFn: () => getAllServiceService(dataUpdate.MaPT),
  });

  useEffect(() => {
    if (open && dataUpdate.MaPT) {
      const checkHasRent = async () => {
        try {
          const res = await checkRoomHasRentService(dataUpdate.MaPT);
          if (res?.EC === 0) {
            setHasRent(res.DT);
          }
        } catch (error) {
          console.error("Error checking rent status:", error);
        }
      };
      checkHasRent();
    }
  }, [open, dataUpdate.MaPT]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "anh" && files && files.length > 0) {
      setFormData({ ...formData, anh: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (name === "dienTich") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const mutationUpdateRoom = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await updateRoomService(id, data);
      return response;
    },
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM);
        setOpen(false);
        if (refetch) refetch();
      } else {
        toast.error(data.EM);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.EM || error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.tenPhong.trim()) {
      toast.error("Vui lòng nhập tên phòng");
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

    mutationUpdateRoom.mutate({ id: dataUpdate.MaPT, data: formData });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mr-2 flex items-center cursor-pointer bg-blue-500 hover:bg-blue-600 rounded text-white">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-1/2 max-h-[90vh] overflow-y-auto rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật phòng</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin phòng. Nhấn Lưu khi hoàn tất.
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
                  placeholder="Nhập tên phòng"
                  className="rounded shadow-none"
                  disabled={hasRent}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maLoaiPhong" className="text-right">
                  Loại phòng
                </Label>
                <Select
                  value={formData.maLoaiPhong}
                  onValueChange={(value) =>
                    handleSelectChange("maLoaiPhong", value)
                  }
                >
                  <SelectTrigger
                    className="col-span-3 w-full rounded shadow-none cursor-pointer"
                    disabled={hasRent}
                  >
                    <SelectValue placeholder="Chọn loại phòng" />
                  </SelectTrigger>
                  <SelectContent className="rounded">
                    {roomTypes.map((type) => (
                      <SelectItem
                        key={type.MaLP}
                        value={type.MaLP.toString()}
                        className="cursor-pointer"
                      >
                        {type.TenLoaiPhong}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dienTich" className="text-right">
                  Diện tích (m²)
                </Label>
                <Input
                  id="dienTich"
                  name="dienTich"
                  value={formData.dienTich}
                  onChange={handleChange}
                  placeholder="Nhập diện tích"
                  className="rounded shadow-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trangThai" className="text-right">
                  Trạng thái
                </Label>
                <Select
                  value={formData.trangThai}
                  onValueChange={(value) =>
                    handleSelectChange("trangThai", value)
                  }
                >
                  <SelectTrigger
                    className=" w-full rounded cursor-pointer"
                    disabled={hasRent}
                  >
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="rounded">
                    {status.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="cursor-pointer"
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moTa" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="moTa"
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                placeholder="Nhập mô tả phòng"
                className="col-span-3 shadow-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anh" className="text-right">
                Hình ảnh
              </Label>
              <Input
                id="anh"
                name="anh"
                type="file"
                accept="image/*"
                hidden
                onChange={handleChange}
                className="col-span-3"
                ref={inputRef}
              />
              {previewImage ? (
                <>
                  <div
                    className="border-2 w-30 h-30 border-dashed cursor-pointer"
                    onClick={() => inputRef.current.click()}
                  >
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="p-1 object-contain rounded"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="w-30 h-30 border-2 border-dashed flex items-center justify-center cursor-pointer"
                    onClick={() => inputRef.current.click()}
                  >
                    <Plus className="h-8 w-8 mx-auto mt-2" />
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
        {hasRent && (
          <>
            <h2>Dịch vụ phòng</h2>
            <div>
              {dataService &&
                dataService?.DT.map((service, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 my-1 rounded bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <Checkbox
                          id={service.MaDV}
                          // checked={selectedServices.includes(service.MaDV)}
                          // onCheckedChange={(checked) =>
                          //   handleServiceChange(service.MaDV, checked)
                          // }
                          // disabled={isDefaultService(service)}
                          className="h-5 w-5 rounded cursor-pointer"
                        />
                        <Label
                          htmlFor={service.MaDV}
                          className="cursor-pointer flex-1"
                        >
                          {service.TenDV}
                        </Label>
                      </div>
                      <span className="text-sm text-gray-600 w-32 text-right">
                        {formatCurrency(service.DonGia || 0)} VNĐ
                      </span>
                    </div>
                  );
                })}
            </div>
          </>
        )}
        <DialogFooter>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="mr-2 rounded cursor-pointer"
          >
            Đóng
          </Button>
          <Button
            type="submit"
            disabled={mutationUpdateRoom.isPending}
            className=" rounded cursor-pointer"
          >
            {mutationUpdateRoom.isPending ? "Đang xử lý..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateRoom;
