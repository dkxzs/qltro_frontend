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
import { getRoomByIdService } from "@/services/roomServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalAddExpense = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    MaPT: "",
    ThangNam: "",
    NguoiChiTra: "",
    TongTien: "",
    MoTa: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: houseData } = useQuery({
    queryKey: ["houses"],
    queryFn: () => getAllHouseService(),
    enabled: open,
  });

  const { data: roomData, refetch: refetchRooms } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRoomByIdService(selectedHouse),
    enabled: !!selectedHouse,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (selectedHouse) {
      setSelectedRoom("");
      refetchRooms();
    }
  }, [selectedHouse, refetchRooms]);

  const handleHouseChange = (value) => {
    setSelectedHouse(value);
    setSelectedRoom("");
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ThangNam || !formData.NguoiChiTra || !formData.TongTien) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = {
        ...formData,
        MaPT: formData.MaPT ? parseInt(formData.MaPT) : null,
        TongTien: parseInt(formData.TongTien),
      };

      const response = await createExpenseService(data);

      if (response.EC === 0) {
        toast.success("Thêm chi phí phát sinh thành công");
        setOpen(false);
        refetch();
        setFormData({
          MaPT: "",
          ThangNam: "",
          NguoiChiTra: "",
          TongTien: "",
          MoTa: "",
        });
      } else {
        toast.error(response.EM);
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
              {/* Người chi trả */}
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
                  Nhà
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.MaNha}
                    onValueChange={handleHouseChange}
                  >
                    <SelectTrigger className="w-full cursor-pointer rounded shadow-none">
                      <SelectValue placeholder="Chọn nhà" />
                    </SelectTrigger>
                    <SelectContent className="cursor-pointer rounded ">
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
                  Phòng
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.MaPT}
                    onValueChange={(value) => handleSelectChange("MaPT", value)}
                  >
                    <SelectTrigger className="w-full cursor-pointer rounded shadow-none">
                      <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent className="cursor-pointer rounded">
                      {roomData?.DT?.map((room, index) => (
                        <SelectItem
                          key={index}
                          value={room.MaPT.toString()}
                          className="cursor-pointer"
                        >
                          {room.TenPhong}
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

              {/* Tổng tiền */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="TongTien" className="text-right">
                  Tổng tiền <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="TongTien"
                    name="TongTien"
                    type="text"
                    value={formatCurrency(formData.TongTien)}
                    onChange={handleChange}
                    required
                    className="rounded shadow-none"
                  />
                </div>
              </div>

              {/* Mô tả */}
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
