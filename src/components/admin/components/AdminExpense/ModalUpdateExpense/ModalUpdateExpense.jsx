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
import { getRoomByIdService } from "@/services/roomServices";
import { updateExpenseService } from "@/services/expenseServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateExpense = ({ dataUpdate, refetch }) => {
  const [open, setOpen] = useState(false);
  const [houses, setHouses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState({
    maNha: "",
    maPT: "",
    tongTien: "",
    thangNam: "",
    nguoiChiTra: "",
    moTa: "",
  });

  // Lấy danh sách nhà
  const { data: dataHouses, isLoading: isLoadingHouses } = useQuery({
    queryKey: ["houses"],
    queryFn: () => getAllHouseService(),
    enabled: open,
  });

  useEffect(() => {
    if (dataHouses?.DT) {
      setHouses(dataHouses.DT);
    }
  }, [dataHouses]);

  // Lấy danh sách phòng theo nhà
  const {
    data: dataRooms,
    isLoading: isLoadingRooms,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms", formData.maNha],
    queryFn: () => getRoomByIdService(formData.maNha),
    enabled: open && !!formData.maNha,
  });

  useEffect(() => {
    if (dataRooms?.DT) {
      setRooms(dataRooms.DT);
    }
  }, [dataRooms]);

  // Xử lý khi chọn nhà
  useEffect(() => {
    if (formData.maNha) {
      refetchRooms();
    }
  }, [formData.maNha, refetchRooms]);

  // Xử lý khi mở modal và có dữ liệu cập nhật
  useEffect(() => {
    if (dataUpdate && open) {
      const thangNam = dataUpdate.ThangNam
        ? new Date(dataUpdate.ThangNam).toISOString().substring(0, 7)
        : "";

      const newFormData = {
        maNha: dataUpdate.MaNha?.toString() || "",
        maPT: dataUpdate.MaPT?.toString() || "",
        tongTien: dataUpdate.TongTien?.toString() || "",
        thangNam: thangNam,
        nguoiChiTra: dataUpdate.NguoiChiTra || "",
        moTa: dataUpdate.MoTa || "",
      };

      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
  }, [dataUpdate, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tongTien") {
      // Chỉ cho phép nhập số
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name, value) => {
    if (name === "maNha" && value !== formData.maNha) {
      setFormData({ ...formData, [name]: value, maPT: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isFormDataChanged = () => {
    if (!initialFormData) return true;
    return (
      formData.maNha !== initialFormData.maNha ||
      formData.maPT !== initialFormData.maPT ||
      formData.tongTien !== initialFormData.tongTien ||
      formData.thangNam !== initialFormData.thangNam ||
      formData.nguoiChiTra !== initialFormData.nguoiChiTra ||
      formData.moTa !== initialFormData.moTa
    );
  };

  const mutationUpdateExpense = useMutation({
    mutationFn: async ({ id, data }) => {
      return await updateExpenseService(id, data);
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
      console.error("Error:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật chi phí phát sinh");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormDataChanged()) {
      toast.info("Không có thay đổi để cập nhật");
      return;
    }

    // Kiểm tra dữ liệu
    if (!formData.maNha) {
      toast.error("Vui lòng chọn nhà");
      return;
    }

    if (!formData.tongTien) {
      toast.error("Vui lòng nhập tổng tiền");
      return;
    }

    if (!formData.thangNam) {
      toast.error("Vui lòng chọn tháng năm");
      return;
    }

    if (!formData.nguoiChiTra) {
      toast.error("Vui lòng nhập người chi trả");
      return;
    }

    // Gửi dữ liệu
    mutationUpdateExpense.mutate({
      id: dataUpdate.MaCPPS,
      data: formData,
    });
  };

  const isLoadingData = isLoadingHouses || isLoadingRooms || loading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mr-2 flex items-center cursor-pointer bg-blue-500 hover:bg-blue-600 rounded text-white">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-1/2 max-h-[95vh] overflow-hidden rounded"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        style={{ animation: "none" }}
      >
        <div
          className="scrollbar-hide overflow-y-auto pr-1"
          style={{
            maxHeight: "90vh",
          }}
        >
          <DialogHeader>
            <DialogTitle>Cập nhật chi phí phát sinh</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin chi phí phát sinh. Nhấn Lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          {isLoadingData ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maNha" className="text-right">
                      Nhà
                    </Label>
                    <Select
                      value={formData.maNha}
                      onValueChange={(value) =>
                        handleSelectChange("maNha", value)
                      }
                    >
                      <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                        <SelectValue placeholder="Chọn nhà" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        {houses.map((house) => (
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
                  <div className="space-y-2">
                    <Label htmlFor="maPT" className="text-right">
                      Phòng (tùy chọn)
                    </Label>
                    <Select
                      value={formData.maPT}
                      onValueChange={(value) =>
                        handleSelectChange("maPT", value)
                      }
                      disabled={!formData.maNha || rooms.length === 0}
                    >
                      <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                        <SelectValue placeholder="Chọn phòng" />
                      </SelectTrigger>
                      <SelectContent className="rounded">
                        <SelectItem value="" className="cursor-pointer">
                          Không chọn phòng
                        </SelectItem>
                        {rooms.map((room) => (
                          <SelectItem
                            key={room.MaPT}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tongTien" className="text-right">
                      Tổng tiền (VNĐ)
                    </Label>
                    <Input
                      id="tongTien"
                      name="tongTien"
                      value={formData.tongTien}
                      onChange={handleChange}
                      placeholder="Nhập tổng tiền"
                      className="rounded shadow-none"
                    />
                    {formData.tongTien && (
                      <p className="text-sm text-gray-500">
                        {formatCurrency(formData.tongTien)} VNĐ
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thangNam" className="text-right">
                      Tháng năm
                    </Label>
                    <Input
                      id="thangNam"
                      name="thangNam"
                      type="month"
                      value={formData.thangNam}
                      onChange={handleChange}
                      className="rounded shadow-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nguoiChiTra" className="text-right">
                    Người chi trả
                  </Label>
                  <Input
                    id="nguoiChiTra"
                    name="nguoiChiTra"
                    value={formData.nguoiChiTra}
                    onChange={handleChange}
                    placeholder="Nhập tên người chi trả"
                    className="rounded shadow-none"
                  />
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
                    placeholder="Nhập mô tả chi phí"
                    className="rounded shadow-none"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter className="mt-2">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mr-2 rounded cursor-pointer"
                  variant="outline"
                >
                  Đóng
                </Button>
                <Button
                  type="submit"
                  disabled={
                    mutationUpdateExpense.isPending ||
                    isLoadingData ||
                    !isFormDataChanged()
                  }
                  className="rounded cursor-pointer"
                >
                  {mutationUpdateExpense.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
        <style>
          {`
            .scrollbar-hide {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none; /* Chrome, Safari, Opera */
            }
          `}
        </style>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateExpense;
