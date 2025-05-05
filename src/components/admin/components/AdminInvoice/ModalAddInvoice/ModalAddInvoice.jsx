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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllHouseService } from "@/services/houseServices";
import { getAllRoomService, getRoomByIdService } from "@/services/roomServices";
import { createInvoiceService } from "@/services/invoiceServices";
import { toast } from "react-toastify";

const ModalAddInvoice = () => {
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [formData, setFormData] = useState({
    date: "", // Khởi tạo rỗng, không dùng định dạng cứng
    house: "",
    room: "",
  });

  const queryClient = useQueryClient();

  const { data: dataHouse } = useQuery({
    queryKey: ["dataHouse"],
    queryFn: getAllHouseService,
    enabled: true,
  });

  const { data: roomData } = useQuery({
    queryKey: ["rooms", selectedHouse],
    queryFn: () =>
      selectedHouse === "all"
        ? getAllRoomService()
        : getRoomByIdService(selectedHouse),
    enabled: !!selectedHouse,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === "house") {
      setSelectedHouse(value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        room: "", // Reset room khi đổi nhà
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      house: "",
      room: "",
    });
    setSelectedHouse("");
  };

  const handleCalculateInvoice = async () => {
    try {
      if (!formData.date || !formData.house) {
        toast.error("Vui lòng chọn ngày và nhà!");
        return;
      }

      const response = await createInvoiceService({
        date: formData.date, // Định dạng YYYY-MM-DD
        house: formData.house,
        room: formData.room || "all",
      });

      if (response.EC === 0) {
        toast.success(response.EM);
        // Invalidate query để làm mới danh sách hóa đơn
        await queryClient.invalidateQueries(["invoices"]);
        setOpen(false);
      } else {
        toast.error(response.EM);
      }
    } catch (err) {
      console.log(err);
      toast.error("Có lỗi xảy ra khi tính hóa đơn!");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 rounded cursor-pointer">
          <Calculator /> Tính tiền hoá đơn
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 rounded" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">TÍNH TIỀN</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="date" className="text-md w-[12rem]">
              Từ ngày 1 đến ngày: <span className="text-red-500">*</span>
            </Label>
            <div className="flex-1">
              <Input
                type="date"
                id="date"
                name="date"
                className="rounded mt-2 w-full shadow-none"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="house" className="text-md w-[17.2rem]">
              Nhà: <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.house}
              onValueChange={(value) => handleSelectChange("house", value)}
              className="flex-1"
            >
              <SelectTrigger className="mt-2 rounded shadow-none w-full cursor-pointer">
                <SelectValue placeholder="Chọn nhà" />
              </SelectTrigger>
              <SelectContent className="rounded cursor-pointer">
                <SelectItem
                  className="hover:bg-transparent cursor-pointer"
                  value="all"
                >
                  Tất cả
                </SelectItem>
                {dataHouse?.DT.map((house, index) => (
                  <SelectItem
                    key={index}
                    className="hover:bg-transparent cursor-pointer"
                    value={house.MaNha}
                  >
                    {house.TenNha}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="room" className="text-md w-[17.2rem]">
              Phòng: <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.room}
              onValueChange={(value) => handleSelectChange("room", value)}
              className="flex-1"
              disabled={formData.house === "all"}
            >
              <SelectTrigger className="mt-2 rounded shadow-none cursor-pointer w-full">
                <SelectValue placeholder="Chọn phòng" />
              </SelectTrigger>
              <SelectContent className="rounded cursor-pointer">
                {roomData?.DT?.length >= 1 && (
                  <SelectItem className="cursor-pointer" value="all">
                    Tất cả
                  </SelectItem>
                )}
                {roomData?.DT.filter((room) => room.TrangThai === 1).map(
                  (room, index) => (
                    <SelectItem
                      key={index}
                      className="hover:bg-transparent cursor-pointer"
                      value={room.MaPT}
                    >
                      {room.TenPhong}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="mt-2">
          <Button
            className="rounded cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Đóng
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
            onClick={handleCalculateInvoice}
          >
            Tính tiền
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddInvoice;
