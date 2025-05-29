import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { createIssueService } from "@/services/issueService";
import { getRoomByIdService } from "@/services/roomServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModalAddIssueClient = ({ open, onOpenChange }) => {
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [formData, setFormData] = useState({
    MaNha: "",
    MaPT: "",
    MoTa: "",
  });

  // Lấy danh sách nhà
  const { data: houseData, isLoading: houseLoading } = useQuery({
    queryKey: ["houses"],
    queryFn: () => getAllHouseService(),
    enabled: open,
    onError: (error) => {
      console.error("Error fetching houses:", error);
      toast.error("Không thể tải danh sách nhà!");
    },
  });

  // Lấy danh sách phòng dựa trên mã nhà
  const {
    data: roomData,
    isLoading: roomLoading,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms", selectedHouse],
    queryFn: () => getRoomByIdService(selectedHouse),
    enabled: !!selectedHouse && open,
    onError: (error) => {
      console.error("Error fetching rooms:", error);
      toast.error("Không thể tải danh sách phòng!");
    },
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      MaNha: "",
      MaPT: "",
      MoTa: "",
    });
    setSelectedHouse("");
    setSelectedRoom("");
  };

  const mutationCreateReport = useMutation({
    mutationFn: async ({ data }) => {
      const res = await createIssueService(data);
      if (res.EC !== 0) {
        throw new Error(res.EM || "Có lỗi xảy ra khi thêm báo cáo sự cố");
      }
      return res;
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      resetForm();
      setTimeout(() => onOpenChange(false), 300);
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Add report error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Thêm báo cáo thất bại: Phòng không hợp lệ. Vui lòng kiểm tra lại."
        : error.message || "Đã có lỗi xảy ra khi thêm báo cáo sự cố";
      toast.error(errorMessage);
    },
  });

  const validateForm = () => {
    if (!formData.MaNha) {
      toast.error("Vui lòng chọn nhà");
      return false;
    }
    if (!formData.MaPT) {
      toast.error("Vui lòng chọn phòng");
      return false;
    }
    if (!formData.MoTa.trim()) {
      toast.error("Mô tả không được để trống");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = {
        MaPT: formData.MaPT,
        MoTa: formData.MoTa,
      };
      mutationCreateReport.mutate({ data: dataToSubmit });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const isFormDisabled = mutationCreateReport.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-3/5 max-w-2xl rounded transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle>Thêm báo cáo sự cố</DialogTitle>
          <DialogDescription>
            Vui lòng nhập đầy đủ thông tin để thêm báo cáo sự cố mới.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 w-full">
              <Label htmlFor="nha">Chọn nhà</Label>
              <Select
                id="nha"
                name="MaNha"
                value={selectedHouse}
                onValueChange={handleHouseChange}
                disabled={isFormDisabled || houseLoading}
              >
                <SelectTrigger className="w-full rounded mt-2 shadow-none box-border cursor-pointer">
                  <SelectValue
                    placeholder={houseLoading ? "Đang tải..." : "Chọn nhà"}
                  />
                </SelectTrigger>
                <SelectContent className="rounded">
                  {!houseLoading && houseData?.DT?.length > 0 ? (
                    houseData.DT.map((house) => (
                      <SelectItem
                        key={house.MaNha}
                        value={house.MaNha.toString()}
                        className="cursor-pointer"
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
            <div className="col-span-1 w-full">
              <Label htmlFor="phong">Phòng</Label>
              <Select
                id="phong"
                name="MaPT"
                value={selectedRoom}
                onValueChange={handleRoomChange}
                disabled={isFormDisabled || !selectedHouse || roomLoading}
              >
                <SelectTrigger className="w-full rounded mt-2 shadow-none box-border cursor-pointer">
                  <SelectValue
                    placeholder={
                      roomLoading
                        ? "Đang tải..."
                        : !selectedHouse
                        ? "Vui lòng chọn nhà trước"
                        : roomData?.DT?.length === 0
                        ? "Không có phòng"
                        : "Chọn phòng"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded">
                  {!roomLoading && roomData?.DT?.length > 0 ? (
                    roomData.DT.map((room) => (
                      <SelectItem
                        key={room.MaPT}
                        value={room.MaPT.toString()}
                        className="cursor-pointer"
                      >
                        {room.TenPhong}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="no-data">
                      Không có phòng
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 w-full">
              <Label htmlFor="mota">Mô tả</Label>
              <Textarea
                id="mota"
                name="MoTa"
                placeholder="Mô tả chi tiết về sự cố"
                className="w-full rounded mt-2 min-h-[100px] shadow-none"
                value={formData.MoTa}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              disabled={isFormDisabled}
              aria-label="Thêm báo cáo sự cố mới"
            >
              {mutationCreateReport.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
            <Button
              type="button"
              className="rounded cursor-pointer"
              onClick={handleClose}
              disabled={isFormDisabled}
              variant="destructive"
              aria-label="Hủy thêm báo cáo sự cố"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddIssueClient;
