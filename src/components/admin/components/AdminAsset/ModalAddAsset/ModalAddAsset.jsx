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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllHouseService } from "@/services/houseServices";
import { getAvailableRoomsByHouseService } from "@/services/roomServices";
import { createAssetService } from "@/services/assetServices";

const ModalAddAsset = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [formData, setFormData] = useState({
    MaPT: "",
    TenTS: "",
    SoLuong: "",
    TinhTrang: "Tốt",
    MoTa: "",
  });

  // Lấy danh sách nhà
  const { data: houseData, isLoading: houseLoading } = useQuery({
    queryKey: ["houseData"],
    queryFn: () => getAllHouseService(),
    enabled: open,
  });

  const {
    data: roomData,
    isLoading: roomLoading,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["availableRooms", selectedHouse],
    queryFn: () => getAvailableRoomsByHouseService(selectedHouse),
    enabled: !!selectedHouse && open,
  });

  // Mutation để tạo tài sản
  const mutationCreateAsset = useMutation({
    mutationFn: async (data) => {
      const res = await createAssetService(data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi thêm tài sản");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setTimeout(() => setOpen(false), 300);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Thêm tài sản thất bại");
    },
  });

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
      setFormData((prev) => ({ ...prev, MaPT: "" }));
      refetchRooms();
    }
  }, [selectedHouse, refetchRooms]);

  const handleHouseChange = (value) => {
    setSelectedHouse(value);
    setFormData((prev) => ({ ...prev, MaNha: value }));
  };

  const handleRoomChange = (value) => {
    setSelectedRoom(value);
    setFormData((prev) => ({ ...prev, MaPT: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "SoLuong") {
      const cleanValue = value.replace(/\D/g, "");
      const numericValue = cleanValue === "" ? "" : parseInt(cleanValue, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      MaPT: "",
      TenTS: "",
      SoLuong: "",
      TinhTrang: "Tốt",
      MoTa: "",
    });
    setSelectedHouse("");
    setSelectedRoom("");
  };

  const validateForm = () => {
    if (!formData.MaPT) {
      toast.error("Vui lòng chọn phòng trọ");
      return false;
    }
    if (!formData.TenTS.trim()) {
      toast.error("Tên tài sản không được để trống");
      return false;
    }
    if (!formData.SoLuong || formData.SoLuong <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return false;
    }
    if (!formData.TinhTrang) {
      toast.error("Vui lòng chọn tình trạng");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutationCreateAsset.mutate(formData);
    }
  };

  const handleClose = () => {
    const hasUnsavedChanges =
      formData.MaPT || formData.TenTS || formData.SoLuong || formData.MoTa;
    if (
      hasUnsavedChanges &&
      !window.confirm("Bạn có chắc muốn đóng? Dữ liệu chưa lưu sẽ mất.")
    ) {
      return;
    }
    setOpen(false);
    resetForm();
  };

  const isFormDisabled = mutationCreateAsset.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="mr-2 flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded text-white"
          aria-label="Thêm tài sản mới"
        >
          <Plus className="h-5 w-5" />
          Thêm tài sản
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-3/5 max-w-2xl rounded transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thêm tài sản</DialogTitle>
          <DialogDescription>
            Vui lòng nhập đầy đủ thông tin để thêm tài sản mới.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="MaNha">Chọn nhà</Label>
              <Select
                id="MaNha"
                name="MaNha"
                value={selectedHouse}
                onValueChange={handleHouseChange}
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
            <div className="space-y-2">
              <Label htmlFor="MaPT">Chọn phòng</Label>
              <Select
                id="MaPT"
                name="MaPT"
                value={selectedRoom}
                onValueChange={handleRoomChange}
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
            <div className="space-y-2">
              <Label htmlFor="tents">Tên tài sản</Label>
              <Input
                type="text"
                id="tents"
                name="TenTS"
                placeholder="Giường gỗ"
                className="rounded shadow-none"
                value={formData.TenTS}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soluong">Số lượng</Label>
              <Input
                type="text"
                id="soluong"
                name="SoLuong"
                placeholder="1"
                className="rounded shadow-none"
                value={formData.SoLuong}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tinhtrang">Tình trạng</Label>
              <Select
                id="tinhtrang"
                name="TinhTrang"
                value={formData.TinhTrang}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, TinhTrang: value }))
                }
                disabled={isFormDisabled}
              >
                <SelectTrigger className="w-full rounded shadow-none cursor-pointer">
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
                <SelectContent className="rounded">
                  <SelectItem value="Tốt" className="cursor-pointer">
                    Tốt
                  </SelectItem>
                  <SelectItem value="Hỏng" className="cursor-pointer">
                    Hỏng
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mota">Mô tả</Label>
            <Textarea
              id="mota"
              name="MoTa"
              placeholder="Mô tả chi tiết về tài sản"
              className="rounded min-h-[100px] shadow-none"
              value={formData.MoTa}
              onChange={handleChange}
              disabled={isFormDisabled}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              disabled={isFormDisabled}
              aria-label="Thêm tài sản mới"
            >
              Lưu
            </Button>
            <Button
              type="button"
              className="rounded cursor-pointer"
              onClick={handleClose}
              variant="destructive"
              disabled={isFormDisabled}
              aria-label="Hủy thêm tài sản"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddAsset;
