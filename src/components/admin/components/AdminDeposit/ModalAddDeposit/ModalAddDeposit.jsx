import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAllHouseService } from "@/services/houseServices";
import { getAvailableRoomsByHouseService } from "@/services/roomServices";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { createDepositService } from "@/services/depositServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModalAddDeposit = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [formData, setFormData] = useState({
    MaNha: "",
    MaPT: "",
    TenKH: "",
    SoDienThoai: "",
    SoTien: "",
    NgayDatCoc: "",
    GhiChu: "",
    TrangThai: "Đang cọc",
  });

  // Lấy danh sách nhà
  const { data: houseData, isLoading: houseLoading } = useQuery({
    queryKey: ["houseData"],
    queryFn: () => getAllHouseService(),
    enabled: open,
  });

  // Lấy danh sách phòng trống dựa trên mã nhà
  const {
    data: roomData,
    isLoading: roomLoading,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["availableRooms", selectedHouse],
    queryFn: () => getAvailableRoomsByHouseService(selectedHouse),
    enabled: !!selectedHouse && open,
  });

  // Đặt nhà mặc định là nhà đầu tiên khi dữ liệu nhà được tải
  useEffect(() => {
    if (!houseLoading && houseData?.DT?.length > 0 && !selectedHouse) {
      const firstHouse = houseData.DT[0].MaNha.toString();
      setSelectedHouse(firstHouse);
      setFormData((prev) => ({ ...prev, MaNha: firstHouse }));
    }
  }, [houseData, houseLoading, selectedHouse, open]);

  // Reset selectedRoom và MaPT khi selectedHouse thay đổi
  useEffect(() => {
    if (selectedHouse) {
      setSelectedRoom("");
      setFormData((prev) => ({ ...prev, MaPT: "" }));
      refetchRooms();
    }
  }, [selectedHouse, refetchRooms]);

  const handleHouseChange = (value) => {
    setSelectedHouse(value);
    setFormData((prev) => ({
      ...prev,
      MaNha: value,
      MaPT: "",
    }));
  };

  const handleRoomChange = (value) => {
    setSelectedRoom(value);
    setFormData((prev) => ({
      ...prev,
      MaPT: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "SoTien") {
      const cleanValue = value.replace(/\D/g, "");
      const numericValue = cleanValue === "" ? "" : parseInt(cleanValue, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.MaNha ||
      !formData.MaPT ||
      !formData.TenKH ||
      !formData.SoDienThoai ||
      !formData.SoTien ||
      !formData.NgayDatCoc
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      const response = await createDepositService(formData);

      if (response.EC === 0) {
        toast.success("Thêm đặt cọc thành công!");
        setOpen(false);
        setFormData({
          MaNha: "",
          MaPT: "",
          TenKH: "",
          SoDienThoai: "",
          SoTien: "",
          NgayDatCoc: "",
          GhiChu: "",
          TrangThai: "Đang cọc",
        });
        setSelectedHouse("");
        setSelectedRoom("");
        refetch();
      } else {
        toast.error(response.EM || "Thêm đặt cọc thất bại!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi thêm đặt cọc!");
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 rounded cursor-pointer flex items-center">
          <Plus className="size-5" />
          Thêm mới
        </Button>
      </DialogTrigger>
      <DialogContent className="w-3/5 rounded" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Thêm đặt cọc</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2 py-4">
            <div className="grid items-center gap-4">
              <Label htmlFor="MaNha" className="text-right">
                Chọn nhà
              </Label>
              <Select
                id="MaNha"
                name="MaNha"
                value={selectedHouse}
                onValueChange={handleHouseChange}
                className="col-span-3"
                required
                disabled={houseLoading}
              >
                <SelectTrigger className="w-full rounded cursor-pointer shadow-none">
                  <SelectValue
                    placeholder={houseLoading ? "Đang tải..." : "Chọn nhà"}
                  />
                </SelectTrigger>
                <SelectContent className="rounded">
                  {!houseLoading && houseData?.DT?.length > 0 ? (
                    houseData.DT.map((house) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={house.MaNha}
                        value={house.MaNha.toString()}
                      >
                        {house.TenNha}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-data">
                      Không có dữ liệu
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="MaPT" className="text-right">
                Chọn phòng
              </Label>
              <Select
                id="MaPT"
                name="MaPT"
                value={selectedRoom}
                onValueChange={handleRoomChange}
                className="col-span-3"
                required
                disabled={!selectedHouse || roomLoading}
              >
                <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                  <SelectValue
                    placeholder={
                      roomLoading
                        ? "Đang tải..."
                        : roomData?.DT?.length === 0
                        ? "Không có phòng trống"
                        : "Chọn phòng"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded">
                  {!roomLoading && roomData?.DT?.length > 0 ? (
                    roomData.DT.map((room) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={room.MaPT}
                        value={room.MaPT.toString()}
                      >
                        {room.TenPhong}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-data">
                      Không có phòng trống
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="TenKH" className="text-right">
                Tên khách
              </Label>
              <Input
                id="TenKH"
                name="TenKH"
                value={formData.TenKH}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                required
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="SoDienThoai" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="SoDienThoai"
                name="SoDienThoai"
                value={formData.SoDienThoai}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                required
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="SoTien" className="text-right">
                Số tiền
              </Label>
              <Input
                id="SoTien"
                name="SoTien"
                type="text"
                value={formatCurrency(formData.SoTien)}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                required
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="NgayDatCoc" className="text-right">
                Ngày đặt cọc
              </Label>
              <Input
                id="NgayDatCoc"
                name="NgayDatCoc"
                type="date"
                value={formData.NgayDatCoc}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="grid items-center gap-4">
              <Label htmlFor="GhiChu" className="text-right">
                Ghi chú
              </Label>
              <Textarea
                id="GhiChu"
                name="GhiChu"
                value={formData.GhiChu}
                onChange={handleChange}
                className="col-span-3 rounded shadow-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
            >
              Lưu
            </Button>
            <Button
              type="button"
              className="rounded cursor-pointer"
              variant="destructive"
              onClick={() => setOpen(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddDeposit;
