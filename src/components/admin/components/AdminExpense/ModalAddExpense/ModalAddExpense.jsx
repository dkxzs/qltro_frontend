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
import { getRoomByIdService, getAllRoomService } from "@/services/roomServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalAddExpense = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");
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

  const { data: houseData, isLoading: houseLoading } = useQuery({
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

  const createExpenseMutation = useMutation({
    mutationFn: (data) => createExpenseService(data),
    onSuccess: (response) => {
      if (response.EC === 0) {
        toast.success("Thêm chi phí phát sinh thành công");
        setOpen(false);
        refetch();
        resetForm();
      } else {
        toast.error(response.EM);
        if (response.DT?.skippedRooms?.length > 0) {
          toast.warn(
            `Một số phòng không được thêm chi phí: ${response.DT.skippedRooms
              .map((r) => `${r.TenPhong} (${r.reason})`)
              .join(", ")}`
          );
        }
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Có lỗi xảy ra khi thêm chi phí phát sinh");
    },
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
    if (!houseLoading && houseData?.DT?.length > 0 && !selectedHouse) {
      const firstHouse = houseData.DT[0].MaNha.toString();
      setSelectedHouse(firstHouse);
      setFormData((prev) => ({ ...prev, MaNha: firstHouse }));
    }
  }, [houseData, houseLoading, selectedHouse, open]);

  useEffect(() => {
    if (selectedHouse) {
      setSelectedRoom("");
      setFormData((prev) => ({ ...prev, MaPT: "", ApplyAllRooms: false }));
      refetchRooms();
    }
  }, [selectedHouse, refetchRooms]);

  useEffect(() => {
    if (formData.NguoiChiTra === "Khách trọ") {
      const currentYear = new Date().getFullYear();
      const currentMonth = (new Date().getMonth() + 1)
        .toString()
        .padStart(2, "0");
      setFormData((prev) => ({
        ...prev,
        ThangNam: `${currentYear}-${currentMonth}`,
        Thang: parseInt(currentMonth, 10),
        Nam: currentYear,
      }));
    }
  }, [formData.NguoiChiTra]);

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
        ThangNam:
          value === "Khách trọ"
            ? `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
                .toString()
                .padStart(2, "0")}`
            : "",
        Thang: value === "Khách trọ" ? new Date().getMonth() + 1 : "",
        Nam: value === "Khách trọ" ? new Date().getFullYear() : "",
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

  const resetForm = () => {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.NguoiChiTra) {
      toast.error("Vui lòng chọn người chi trả!");
      return;
    }
    if (!formData.MaNha) {
      toast.error("Vui lòng chọn nhà!");
      return;
    }
    if (
      formData.NguoiChiTra === "Khách trọ" &&
      !formData.MaPT &&
      !formData.ApplyAllRooms
    ) {
      toast.error(
        "Vui lòng chọn phòng hoặc tất cả phòng khi người chi trả là khách trọ!"
      );
      return;
    }
    if (!formData.Thang || !formData.Nam) {
      toast.error("Vui lòng chọn tháng/năm!");
      return;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (formData.NguoiChiTra === "Khách trọ") {
      if (formData.Thang !== currentMonth || formData.Nam !== currentYear) {
        toast.error(
          "Chỉ được thêm chi phí cho tháng hiện tại khi người chi trả là khách trọ!"
        );
        return;
      }
    } else if (formData.NguoiChiTra === "Chủ trọ") {
      const minYear = currentYear - 1;
      const minMonth = currentMonth;
      const selectedDate = new Date(formData.Nam, formData.Thang - 1);
      const minDate = new Date(minYear, minMonth - 1);
      if (selectedDate < minDate) {
        toast.error(
          "Chỉ được chọn tháng/năm trong 12 tháng gần nhất khi người chi trả là chủ trọ!"
        );
        return;
      }
    }

    const parsedTongTien = parseInt(formData.TongTien, 10);
    if (isNaN(parsedTongTien) || parsedTongTien <= 0) {
      toast.error("Tổng tiền phải là số lớn hơn 0!");
      return;
    }

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

    createExpenseMutation.mutate(data);
  };

  // Tính min và max cho input ThangNam
  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const minMonth =
    formData.NguoiChiTra === "Khách trọ"
      ? `${currentYear}-${currentMonth}`
      : `${currentYear - 1}-${currentMonth}`;
  const maxMonth = `${currentYear}-${currentMonth}`;

  return (
    <>
      <Button
        className="mr-2 flex items-center cursor-pointer bg-green-600 hover:bg-green-700 rounded"
        onClick={() => setOpen(true)}
        aria-label="Mở modal thêm chi phí phát sinh"
      >
        <Plus className="h-4 w-4" />
        Thêm chi phí
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}
      >
        <DialogContent
          className="bg-white shadow-md rounded w-2/5"
          aria-describedby="add-expense-description"
        >
          <DialogHeader>
            <DialogTitle>Thêm chi phí phát sinh</DialogTitle>
            <div id="add-expense-description" className="text-sm text-gray-500">
              Vui lòng điền thông tin chi phí phát sinh.{" "}
              {formData.NguoiChiTra === "Khách trọ"
                ? "Chỉ cho phép thêm chi phí cho tháng hiện tại."
                : "Có thể thêm chi phí cho 12 tháng gần nhất."}
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4 p-4 rounded-md">
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
                    <SelectTrigger
                      id="NguoiChiTra"
                      className="w-full rounded cursor-pointer shadow-none"
                      aria-label="Chọn người chi trả"
                    >
                      <SelectValue placeholder="Chọn người chi trả" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
                      <SelectItem value="Chủ trọ" className="cursor-pointer">
                        Chủ trọ
                      </SelectItem>
                      <SelectItem value="Khách trọ" className="cursor-pointer">
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
                    <SelectTrigger
                      id="MaNha"
                      className="w-full cursor-pointer rounded shadow-none"
                      aria-label="Chọn nhà"
                    >
                      <SelectValue placeholder="Chọn nhà" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
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
                    <SelectTrigger
                      id="MaPT"
                      className="w-full cursor-pointer rounded shadow-none"
                      aria-label="Chọn phòng"
                    >
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent className="rounded">
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
                    placeholder="Chọn tháng/năm"
                    aria-label="Chọn tháng/năm"
                    min={minMonth}
                    max={maxMonth}
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
                    className="rounded shadow-none text-right"
                    placeholder="Nhập số tiền (VD: 1,000,000)"
                    aria-label="Nhập tổng tiền"
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
                    placeholder="Nhập mô tả chi phí (nếu có)"
                    aria-label="Nhập mô tả chi phí"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createExpenseMutation.isPending}
                aria-label="Thêm chi phí phát sinh"
              >
                {createExpenseMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Lưu"
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white rounded cursor-pointer"
                variant="destructive"
                aria-label="Hủy thêm chi phí"
              >
                Đóng
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalAddExpense;
