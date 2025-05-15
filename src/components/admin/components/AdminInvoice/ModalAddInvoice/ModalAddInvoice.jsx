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
import { Calculator, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllHouseService } from "@/services/houseServices";
import { getAllRoomService, getRoomByIdService } from "@/services/roomServices";
import { createInvoiceService } from "@/services/invoiceServices";
import { toast } from "react-toastify";

const ModalAddInvoice = () => {
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [formData, setFormData] = useState({
    date: "",
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

  const createInvoiceMutation = useMutation({
    mutationFn: (data) => createInvoiceService(data),
    onSuccess: async (response) => {
      if (response.EC === 0) {
        toast.success(response.EM);
        await queryClient.invalidateQueries(["invoices"]);
        setOpen(false);
      } else {
        toast.error(response.EM);
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error("Có lỗi xảy ra khi tính hóa đơn!");
    },
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
        room: "",
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

  const handleCalculateInvoice = () => {
    if (!formData.date) {
      toast.error("Vui lòng chọn ngày tính hóa đơn!");
      return;
    }
    if (!formData.house) {
      toast.error("Vui lòng chọn nhà!");
      return;
    }
    if (formData.house !== "all" && !formData.room) {
      toast.error("Vui lòng chọn phòng!");
      return;
    }

    const invoiceData = {
      date: formData.date,
      house: formData.house,
      room: formData.room || "all",
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 rounded cursor-pointer">
          <Calculator className="h-4 w-4" /> Tính tiền hoá đơn
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-white shadow-md rounded w-2/5"
        aria-describedby="add-invoice-description"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Tính tiền hóa đơn
          </DialogTitle>
          <div id="add-invoice-description" className="text-sm text-gray-500">
            Vui lòng chọn ngày, nhà và phòng để tính hóa đơn.
          </div>
        </DialogHeader>
        <div className="space-y-6 bg-gray-50 p-4 rounded-md">
          <div className="flex items-center gap-6">
            <Label htmlFor="date" className="text-md">
              Từ ngày 1 đến ngày: <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              id="date"
              name="date"
              className="flex-1 rounded mt-2 shadow-none"
              value={formData.date}
              onChange={handleChange}
              placeholder="Chọn ngày tính hóa đơn"
              aria-label="Ngày tính hóa đơn"
            />
          </div>
          <div className="flex items-center gap-6">
            <Label htmlFor="house" className="text-md w-32">
              Nhà: <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.house}
              onValueChange={(value) => handleSelectChange("house", value)}
              className="flex-1"
            >
              <SelectTrigger
                id="house"
                className="mt-2 rounded shadow-none w-full cursor-pointer"
                aria-label="Chọn nhà"
              >
                <SelectValue placeholder="Chọn nhà" />
              </SelectTrigger>
              <SelectContent className="rounded">
                <SelectItem className="cursor-pointer" value="all">
                  Tất cả
                </SelectItem>
                {dataHouse?.DT.map((house) => (
                  <SelectItem
                    key={house.MaNha}
                    className="cursor-pointer"
                    value={house.MaNha}
                  >
                    {house.TenNha}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-6">
            <Label htmlFor="room" className="text-md w-32">
              Phòng: <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.room}
              onValueChange={(value) => handleSelectChange("room", value)}
              className="flex-1"
              disabled={formData.house === "all"}
            >
              <SelectTrigger
                id="room"
                className="mt-2 rounded shadow-none cursor-pointer w-full"
                aria-label="Chọn phòng"
              >
                <SelectValue placeholder="Chọn phòng" />
              </SelectTrigger>
              <SelectContent className="rounded">
                {roomData?.DT?.length >= 1 && (
                  <SelectItem className="cursor-pointer" value="all">
                    Tất cả
                  </SelectItem>
                )}
                {roomData?.DT.filter((room) => room.TrangThai === 1).map(
                  (room) => (
                    <SelectItem
                      key={room.MaPT}
                      className="cursor-pointer"
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
        <DialogFooter className="mt-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCalculateInvoice}
            disabled={createInvoiceMutation.isPending}
            aria-label="Tính tiền hóa đơn"
          >
            {createInvoiceMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Tính tiền"
            )}
          </Button>
          <Button
            className="text-white rounded cursor-pointer"
            variant="destructive"
            onClick={() => setOpen(false)}
            aria-label="Đóng modal tính hóa đơn"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddInvoice;
