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
import { getAllCustomerService } from "@/services/customerServices";
import { getAllHouseService } from "@/services/houseServices";
import { getRoomByIdService } from "@/services/roomServices";
import { createRentService } from "@/services/rentServices";
import { getAllServiceService } from "@/services/serviceServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ModalAddRent = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    ngayBatDau: "",
    ngayKetThuc: "",
    ghiChu: "",
    donGia: "",
    datCoc: "",
  });
  // eslint-disable-next-line no-unused-vars
  const [roomPrice, setRoomPrice] = useState(0);

  const { data: dataServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllServiceService(),
    enabled: open,
  });

  const { data: housesData } = useQuery({
    queryKey: ["houses-for-rent"],
    queryFn: getAllHouseService,
    enabled: open,
  });

  const { data: customersData } = useQuery({
    queryKey: ["customers-for-rent"],
    queryFn: () => getAllCustomerService(true),
    enabled: open,
  });

  const { data: roomsData, refetch: refetchRooms } = useQuery({
    queryKey: ["rooms-by-house", selectedHouse],
    queryFn: () => getRoomByIdService(selectedHouse),
    enabled: !!selectedHouse && open,
  });

  useEffect(() => {
    if (open && dataServices?.DT) {
      const defaultServices = dataServices.DT.filter(
        (service) =>
          service.TenDV.toLowerCase() === "điện" ||
          service.TenDV.toLowerCase() === "nước" ||
          service.TenDV.toLowerCase() === "vệ sinh" ||
          service.TenDV.toLowerCase() === "internet"
      ).map((service) => service.MaDV);
      setSelectedServices(defaultServices);
    }
  }, [open, dataServices]);

  useEffect(() => {
    if (open && housesData?.DT && housesData.DT.length > 0) {
      setSelectedHouse(housesData.DT[0].MaNha.toString());
    }
  }, [open, housesData]);

  useEffect(() => {
    if (selectedHouse) {
      setSelectedRoom("");
      refetchRooms();
    }
  }, [selectedHouse, refetchRooms]);

  useEffect(() => {
    if (selectedRoom && roomsData?.DT) {
      const selectedRoomData = roomsData.DT.find(
        (room) => room.MaPT.toString() === selectedRoom
      );
      if (selectedRoomData && selectedRoomData.LoaiPhong) {
        setRoomPrice(selectedRoomData.LoaiPhong.DonGia);
        setFormData((prev) => ({
          ...prev,
          donGia: selectedRoomData.LoaiPhong.DonGia,
        }));
      }
    }
  }, [selectedRoom, roomsData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "donGia" || name === "datCoc" ? formatCurrency(value) : value,
    }));
  };

  const handleServiceChange = (maDV, isChecked) => {
    if (isChecked) {
      setSelectedServices((prev) => [...prev, maDV]);
    } else {
      setSelectedServices((prev) => prev.filter((id) => id !== maDV));
    }
  };

  const resetForm = () => {
    setSelectedHouse("");
    setSelectedRoom("");
    setSelectedCustomer("");
    setSelectedServices([]);
    setFormData({
      ngayBatDau: "",
      ngayKetThuc: "",
      ghiChu: "",
      donGia: "",
      datCoc: "",
    });
    setRoomPrice(0);
  };

  const createRentMutation = useMutation({
    mutationFn: (data) => createRentService(data),
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM);
        setOpen(false);
        resetForm();
        queryClient.invalidateQueries(["rent-list"]);
      } else {
        toast.error(data.EM);
      }
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi tạo hợp đồng");
      console.error(error);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) {
      toast.error("Vui lòng chọn khách hàng");
      return;
    }

    if (!selectedRoom) {
      toast.error("Vui lòng chọn phòng");
      return;
    }

    if (!formData.ngayBatDau) {
      toast.error("Vui lòng chọn ngày bắt đầu");
      return;
    }

    if (!formData.ngayKetThuc) {
      toast.error("Vui lòng chọn ngày kết thúc");
      return;
    }

    if (!formData.datCoc) {
      toast.error("Vui lòng nhập tiền đặt cọc");
      return;
    }

    const rentData = {
      maKH: selectedCustomer,
      maPT: selectedRoom,
      ngayBatDau: formData.ngayBatDau,
      ngayKetThuc: formData.ngayKetThuc || null,
      ghiChu: formData.ghiChu || "",
      donGia:
        typeof formData.donGia === "string"
          ? parseInt(formData.donGia.replace(/\D/g, ""))
          : formData.donGia || 0,
      datCoc:
        typeof formData.datCoc === "string"
          ? parseInt(formData.datCoc.replace(/\D/g, ""))
          : formData.datCoc || 0,
      dichVu: selectedServices,
    };

    createRentMutation.mutate(rentData);
  };

  const availableRooms =
    roomsData?.DT?.filter((room) => room.TrangThai === 0) || [];

  const isDefaultService = (service) =>
    service.TenDV.toLowerCase() === "điện" ||
    service.TenDV.toLowerCase() === "nước" ||
    service.TenDV.toLowerCase() === "vệ sinh" ||
    service.TenDV.toLowerCase() === "internet";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mr-2 flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded">
          <Plus className="size-5" />
          Tạo hợp đồng
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-4/5 max-w-4xl rounded max-h-[90vh] min-h-[90vh] flex flex-col"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thêm hợp đồng</DialogTitle>
          <DialogDescription className="-mt-1">
            Vui lòng nhập đầy đủ thông tin vào hợp đồng mới.
          </DialogDescription>
        </DialogHeader>
        <form
          className="w-full mt-3 flex-1 flex flex-col"
          onSubmit={handleSubmit}
        >
          <Tabs defaultValue="tab1" className="w-full flex-1 flex flex-col">
            <TabsList className="w-full p-0 bg-background justify-start border-b rounded-none">
              <TabsTrigger
                value="tab1"
                className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-l-0 border-r-0 border-t-0 border-transparent data-[state=active]:border-primary cursor-pointer"
              >
                Thông tin hợp đồng
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-l-0 border-r-0 border-t-0 border-transparent data-[state=active]:border-primary cursor-pointer "
              >
                Dịch vụ
              </TabsTrigger>
            </TabsList>

            {/* Nội dung tab với chiều cao cố định và cuộn */}
            <div
              className="scrollbar-hide flex-1"
              style={{
                height: "50vh", // Giảm chiều cao để dành không gian cho footer
                overflowY: "auto",
                borderRadius: "inherit",
              }}
            >
              {/* Tab 1: Thông tin hợp đồng */}
              <TabsContent value="tab1" className="pt-4">
                <div className="grid grid-cols-2 gap-6 w-full">
                  <div className="w-full">
                    <Label htmlFor="khachTro">Khách trọ</Label>
                    <Select
                      value={selectedCustomer}
                      onValueChange={setSelectedCustomer}
                      className=""
                    >
                      <SelectTrigger
                        id="khachTro"
                        className="w-full rounded mt-2 shadow-none cursor-pointer"
                      >
                        <SelectValue placeholder="Chọn khách trọ" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto rounded">
                        {customersData?.DT?.map((customer) => (
                          <SelectItem
                            key={customer.MaKH}
                            value={customer.MaKH.toString()}
                            className="cursor-pointer"
                          >
                            {customer.HoTen} - {customer.CCCD}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <Label htmlFor="nha">Nhà</Label>
                    <Select
                      value={selectedHouse}
                      onValueChange={setSelectedHouse}
                      className=""
                    >
                      <SelectTrigger
                        id="nha"
                        className="w-full rounded mt-2 shadow-none cursor-pointer"
                      >
                        <SelectValue placeholder="Chọn nhà" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto rounded">
                        {housesData?.DT?.map((house) => (
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

                  <div className="w-full">
                    <Label htmlFor="phong">Phòng</Label>
                    <Select
                      value={selectedRoom}
                      onValueChange={setSelectedRoom}
                      className=""
                    >
                      <SelectTrigger
                        id="phong"
                        className="w-full rounded mt-2 shadow-none cursor-pointer"
                      >
                        <SelectValue placeholder="Chọn phòng" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto rounded">
                        {availableRooms.map((room) => (
                          <SelectItem
                            key={room.MaPT}
                            value={room.MaPT.toString()}
                            className="cursor-pointer"
                          >
                            {room.TenPhong} -{" "}
                            {room.LoaiPhong?.TenLoaiPhong || ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full">
                    <Label htmlFor="ngayBatDau">Ngày bắt đầu (ngày 1-5)</Label>
                    <Input
                      id="ngayBatDau"
                      name="ngayBatDau"
                      type="date"
                      value={formData.ngayBatDau}
                      onChange={handleChange}
                      className="w-full rounded mt-2 shadow-none"
                    />
                  </div>

                  <div className="w-full">
                    <Label htmlFor="ngayKetThuc">Ngày kết thúc</Label>
                    <Input
                      id="ngayKetThuc"
                      name="ngayKetThuc"
                      type="date"
                      value={formData.ngayKetThuc}
                      onChange={handleChange}
                      className="w-full rounded mt-2 shadow-none"
                    />
                  </div>

                  <div className="w-full">
                    <Label htmlFor="datCoc">Tiền đặt cọc (VNĐ)</Label>
                    <Input
                      id="datCoc"
                      name="datCoc"
                      value={formatCurrency(formData.datCoc)}
                      onChange={handleChange}
                      className="w-full rounded mt-2 shadow-none"
                    />
                  </div>

                  <div className="w-full">
                    <Label htmlFor="donGia">Đơn giá (VNĐ/tháng)</Label>
                    <Input
                      id="donGia"
                      name="donGia"
                      value={formatCurrency(formData.donGia)}
                      onChange={handleChange}
                      className="w-full rounded mt-2 shadow-none"
                      disabled
                    />
                  </div>

                  <div className="w-full col-span-2">
                    <Label htmlFor="ghiChu">Ghi chú</Label>
                    <Textarea
                      id="ghiChu"
                      name="ghiChu"
                      value={formData.ghiChu}
                      onChange={handleChange}
                      className="w-full rounded mt-2 shadow-none"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Dịch vụ */}
              <TabsContent value="tab2" className="pt-4">
                <div className="w-full">
                  <Label className="text-lg font-semibold">Dịch vụ</Label>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {dataServices?.DT?.map((service) => (
                      <div
                        key={service.MaDV}
                        className="flex items-center justify-between p-3 border rounded bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <Checkbox
                            id={service.MaDV}
                            checked={selectedServices.includes(service.MaDV)}
                            onCheckedChange={(checked) =>
                              handleServiceChange(service.MaDV, checked)
                            }
                            disabled={isDefaultService(service)}
                            className="h-5 w-5"
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
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded cursor-pointer"
            >
              Hủy
            </Button>
            <Button type="submit" className="rounded cursor-pointer">
              {createRentMutation.isPending ? "Đang xử lý..." : "Tạo hợp đồng"}
            </Button>
          </DialogFooter>
        </form>
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

export default ModalAddRent;
