import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { createExpenseService } from "@/services/expenseServices";
import { getAllHouseService } from "@/services/houseServices";
import { getAllRoomService, getRoomByIdService } from "@/services/roomServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalAddExpense = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedRoom, setSelectedRoom] = useState("");
  const [formData, setFormData] = useState({
    MaNha: "",
    MaPT: "",
    ThangNam: "",
    Thang: "",
    Nam: "",
    NguoiChiTra: "",
    TongTien: "",
    MoTa: "",
    ApplyAllHouses: false,
    ApplyAllRooms: false,
  });
  const [displayTongTien, setDisplayTongTien] = useState("");

  const { data: houseData } = useQuery({
    queryKey: ["houses"],
    queryFn: () => getAllHouseService(),
    enabled: open,
  });

  const { data: roomData, refetch: refetchRooms } = useQuery({
    queryKey: ["rooms", selectedHouse],
    queryFn: () =>
      selectedHouse === "all"
        ? getAllRoomService()
        : getRoomByIdService(selectedHouse),
    enabled: !!selectedHouse && formData.NguoiChiTra !== "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ThangNam" && value) {
      const [nam, thang] = value.split("-");
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        Thang: parseInt(thang, 10),
        Nam: parseInt(nam, 10),
      }));
    } else if (name === "TongTien") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const parsedValue = numericValue ? parseInt(numericValue, 10) : "";
      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
      setDisplayTongTien(parsedValue ? formatCurrency(parsedValue) : "");
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    setDisplayTongTien(
      formData.TongTien ? formatCurrency(formData.TongTien) : ""
    );
  }, [formData.TongTien]);

  useEffect(() => {
    if (selectedHouse) {
      setSelectedRoom("");
      setFormData((prev) => ({ ...prev, MaPT: "", ApplyAllRooms: false }));
      refetchRooms();
    }
  }, [selectedHouse, refetchRooms]);

  const handleHouseChange = (value) => {
    setSelectedHouse(value);
    setSelectedRoom("");
    setFormData((prev) => ({
      ...prev,
      MaNha: value,
      MaPT: "",
      ApplyAllHouses: value === "all",
      ApplyAllRooms: false,
    }));
  };

  const handleSelectChange = (name, value) => {
    if (name === "NguoiChiTra") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        MaNha: "",
        MaPT: "",
        ApplyAllHouses: false,
        ApplyAllRooms: false,
      }));
      setSelectedHouse("");
      setSelectedRoom("");
    } else if (name === "MaPT") {
      setSelectedRoom(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ApplyAllRooms: value === "all",
      }));
    }
  };

  const filteredRooms = roomData?.DT?.filter((room) => {
    if (formData.NguoiChiTra === "Chủ trọ") {
      return true;
    } else if (formData.NguoiChiTra === "Khách trọ") {
      return room.TrangThai === 1;
    }
    return true;
  });

  useEffect(() => {
    console.log("Room Data:", roomData?.DT);
    console.log("Filtered Rooms:", filteredRooms);
  }, [roomData, filteredRooms]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.Thang ||
      !formData.Nam ||
      !formData.NguoiChiTra ||
      !formData.TongTien ||
      !formData.MaNha
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (
      formData.NguoiChiTra === "Khách trọ" &&
      !formData.MaPT &&
      !formData.ApplyAllRooms
    ) {
      toast.error(
        "Vui lòng chọn phòng hoặc tất cả phòng khi người chi trả là khách trọ"
      );
      return;
    }

    const parsedTongTien = parseInt(formData.TongTien, 10);
    if (isNaN(parsedTongTien) || parsedTongTien <= 0) {
      toast.error("Tổng tiền phải là số lớn hơn 0");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = {
        MaNha: formData.ApplyAllHouses
          ? houseData?.DT?.map((house) => parseInt(house.MaNha, 10))
          : [parseInt(formData.MaNha, 10)],
        MaPT: formData.ApplyAllRooms
          ? filteredRooms?.map((room) => parseInt(room.MaPT, 10))
          : formData.MaPT
          ? [parseInt(formData.MaPT, 10)]
          : null,
        Thang: formData.Thang,
        Nam: formData.Nam,
        NguoiChiTra: formData.NguoiChiTra,
        TongTien: parsedTongTien,
        MoTa: formData.MoTa,
        ApplyAllHouses: formData.ApplyAllHouses,
        ApplyAllRooms: formData.ApplyAllRooms,
      };

      const response = await createExpenseService(data);

      if (response.EC === 0) {
        toast.success("Thêm chi phí phát sinh thành công");
        setOpen(false);
        refetch();
        setFormData({
          MaNha: "",
          MaPT: "",
          ThangNam: "",
          Thang: "",
          Nam: "",
          NguoiChiTra: "",
          TongTien: "",
          MoTa: "",
          ApplyAllHouses: false,
          ApplyAllRooms: false,
        });
        setDisplayTongTien("");
        setSelectedHouse("");
        setSelectedRoom("");
      } else {
        toast.error(response.EM);
        if (response.DT?.skippedRooms?.length > 0) {
          console.log("Phòng bị bỏ qua:", response.DT.skippedRooms);
          toast.warn(
            `Một số phòng không được thêm chi phí: ${response.DT.skippedRooms
              .map((r) => `${r.TenPhong} (${r.reason})`)
              .join(", ")}`
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thêm chi phí phát sinh");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        className="mr-2 flex items-center cursor-pointer bg-green-600 hover:bg-green-700 rounded"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Thêm chi phí
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-3/5 rounded"
          onInteractOutside={(event) => {
            event.preventDefault();
          }}
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Thêm chi phí phát sinh</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="NguoiChiTra" className="text-right">
                  Người chi trả <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.NguoiChiTra}
                    onValueChange={(value) =>
                      handleSelectChange("NguoiChiTra", value)
                    }
                    required
                  >
                    <SelectTrigger className="w-full rounded cursor-pointer shadow-none">
                      <SelectValue placeholder="Chọn người chi trả" />
                    </SelectTrigger>
                    <SelectContent className="rounded cursor-pointer">
                      <SelectItem className="cursor-pointer" value="Chủ trọ">
                        Chủ trọ
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Khách trọ">
                        Khách trọ
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="MaNha" className="text-right">
                  Nhà <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Select
                    value={selectedHouse}
                    onValueChange={handleHouseChange}
                    required
                    disabled={!formData.NguoiChiTra}
                  >
                    <SelectTrigger className="w-full cursor-pointer rounded shadow-none">
                      <SelectValue placeholder="Chọn nhà" />
                    </SelectTrigger>
                    <SelectContent className="cursor-pointer rounded">
                      {formData.NguoiChiTra === "Chủ trọ" && (
                        <SelectItem value="all" className="cursor-pointer">
                          Tất cả
                        </SelectItem>
                      )}
                      {houseData?.DT?.map((house) => (
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
                <Label htmlFor="MaPT" className="text-right">
                  Phòng{" "}
                  {formData.NguoiChiTra === "Khách trọ" &&
                    !formData.ApplyAllRooms && (
                      <span className="text-red-500">*</span>
                    )}
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.MaPT}
                    onValueChange={(value) => handleSelectChange("MaPT", value)}
                    disabled={!selectedHouse || !formData.NguoiChiTra}
                  >
                    <SelectTrigger className="w-full cursor-pointer rounded shadow-none">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent className="cursor-pointer rounded">
                      {formData.NguoiChiTra === "Chủ trọ" && (
                        <SelectItem value="all" className="cursor-pointer">
                          Tất cả
                        </SelectItem>
                      )}
                      {filteredRooms?.map((room) => (
                        <SelectItem
                          key={room.MaPT}
                          value={room.MaPT.toString()}
                          className="cursor-pointer"
                        >
                          {room.TenPhong}{" "}
                          {room.TrangThai === 1 ? "(Đã thuê)" : "(Trống)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ThangNam" className="text-right">
                  Tháng/Năm <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="ThangNam"
                    name="ThangNam"
                    type="month"
                    value={formData.ThangNam}
                    onChange={handleChange}
                    required
                    className="rounded shadow-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="TongTien" className="text-right">
                  Tổng tiền <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="TongTien"
                    name="TongTien"
                    type="text"
                    value={displayTongTien}
                    onChange={handleChange}
                    required
                    className="rounded shadow-none"
                    placeholder="Nhập số tiền (VD: 1000000)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="MoTa" className="text-right">
                  Mô tả
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="MoTa"
                    name="MoTa"
                    value={formData.MoTa}
                    onChange={handleChange}
                    rows={3}
                    className="rounded shadow-none"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer rounded"
              >
                {isSubmitting ? "Đang xử lý..." : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalAddExpense;
