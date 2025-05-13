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
import { Loader2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ModalAddRent = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedCustomerOption, setSelectedCustomerOption] =
    useState("existing");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceQuantities, setServiceQuantities] = useState({});
  const [formData, setFormData] = useState({
    ngayBatDau: "",
    ngayKetThuc: "",
    ghiChu: "",
    donGia: "",
    datCoc: "",
    name: "",
    cardId: "",
    gender: "Nam",
    birthday: "",
    phoneNumberMain: "",
    phoneNumberSub: "",
    email: "",
    address: "",
    avatar: "",
    dateOfIssue: "",
    placeOfIssue: "",
    vehicleNumber: "",
    occupation: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const inputRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [roomPrice, setRoomPrice] = useState(0);
  const date = new Date().toISOString().split("T")[0];

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
        (service) => service.BatBuoc === true
      ).map((service) => service.MaDV);
      setSelectedServices(defaultServices);
      // Initialize quantities for all services with default value 1
      const initialQuantities = dataServices.DT.reduce((acc, service) => {
        acc[service.MaDV] = 1;
        return acc;
      }, {});
      setServiceQuantities(initialQuantities);
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

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "donGia" || name === "datCoc"
          ? formatCurrency(value)
          : name === "phoneNumberMain" || name === "phoneNumberSub"
          ? value.replace(/[^0-9]/g, "").slice(0, 10)
          : name === "cardId"
          ? value.replace(/[^0-9]/g, "").slice(0, 12)
          : value,
    }));
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn tệp ảnh (JPG, PNG, v.v.)");
        return;
      }
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      const objectURL = URL.createObjectURL(file);
      setPreviewImage(objectURL);
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  const handleClickImage = () => {
    inputRef.current.click();
  };

  const handleServiceChange = (maDV, isChecked) => {
    if (isChecked) {
      setSelectedServices((prev) => [...prev, maDV]);
      setServiceQuantities((prev) => ({
        ...prev,
        [maDV]: prev[maDV] || 1,
      }));
    } else {
      setSelectedServices((prev) => prev.filter((id) => id !== maDV));
    }
  };

  const handleQuantityChange = (maDV, value) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [maDV]: value === "" ? "" : Math.max(0, parseInt(value)),
    }));
  };

  const resetForm = () => {
    setSelectedHouse("");
    setSelectedRoom("");
    setSelectedCustomerOption("existing");
    setSelectedCustomer("");
    setSelectedServices([]);
    setServiceQuantities({});
    setFormData({
      ngayBatDau: "",
      ngayKetThuc: "",
      ghiChu: "",
      donGia: "",
      datCoc: "",
      name: "",
      cardId: "",
      gender: "Nam",
      birthday: "",
      phoneNumberMain: "",
      phoneNumberSub: "",
      email: "",
      address: "",
      avatar: "",
      dateOfIssue: "",
      placeOfIssue: "",
      vehicleNumber: "",
      occupation: "",
    });
    setPreviewImage(null);
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

    if (!selectedCustomer && selectedCustomerOption === "existing") {
      toast.error("Vui lòng chọn khách hàng");
      return;
    }

    if (selectedCustomerOption === "new") {
      if (!formData.name.trim()) {
        toast.error("Tên không được để trống");
        return;
      }
      if (!formData.phoneNumberMain.trim()) {
        toast.error("Số điện thoại chính không được để trống");
        return;
      }
      if (!formData.avatar) {
        toast.error("Ảnh không được để trống");
        return;
      }
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
      maKH: selectedCustomerOption === "existing" ? selectedCustomer : null,
      newCustomer:
        selectedCustomerOption === "new"
          ? {
              HoTen: formData.name,
              CCCD: formData.cardId || null,
              GioiTinh: formData.gender,
              NgaySinh: formData.birthday || null,
              DienThoaiChinh: formData.phoneNumberMain,
              DienThoaiPhu: formData.phoneNumberSub.trim() || null,
              Email: formData.email.trim() || null,
              DiaChi: formData.address.trim() || null,
              NgayCap: formData.dateOfIssue || null,
              NoiCap: formData.placeOfIssue.trim() || null,
              SoXe: formData.vehicleNumber.trim() || null,
              NgheNghiep: formData.occupation.trim() || null,
              Anh: formData.avatar,
            }
          : null,
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
      dichVu: selectedServices.map((maDV) => ({
        madv: maDV,
        soluong:
          serviceQuantities[maDV] === "" || isNaN(serviceQuantities[maDV])
            ? 1
            : serviceQuantities[maDV],
      })),
    };

    createRentMutation.mutate(rentData);
  };

  const availableRooms =
    roomsData?.DT?.filter((room) => room.TrangThai === 0) || [];

  const isDefaultService = (service) => service.BatBuoc === true;

  const isElectricityOrWater = (service) =>
    service.TenDV.toLowerCase() === "điện" ||
    service.TenDV.toLowerCase() === "nước";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mr-2 flex items-center cursor-pointer bg-green-700 hover:bg-green-800 rounded">
          <Plus className="size-4" />
          Tạo hợp đồng
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-white shadow-md rounded max-w-4xl max-h-[90vh] min-h-[90vh] flex flex-col"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Thêm hợp đồng</DialogTitle>
          <DialogDescription id="add-rent-description">
            Vui lòng nhập đầy đủ thông tin vào hợp đồng mới.
          </DialogDescription>
        </DialogHeader>
        <form
          className="w-full mt-3 flex-1 flex flex-col overflow-hidden"
          onSubmit={handleSubmit}
        >
          <Tabs
            defaultValue="tab1"
            className="w-full flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="w-full p-0 bg-background justify-start border-b rounded-none">
              <TabsTrigger
                value="tab1"
                className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-l-0 border-r-0 border-t-0 border-transparent data-[state=active]:border-primary cursor-pointer"
              >
                Thông tin hợp đồng
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-l-0 border-r-0 border-t-0 border-transparent data-[state=active]:border-primary cursor-pointer"
              >
                Dịch vụ
              </TabsTrigger>
            </TabsList>

            <div
              className="flex-1 overflow-y-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                height: "100%",
              }}
            >
              <style>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <TabsContent value="tab1" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <div className="w-full">
                    <Label htmlFor="nha">Nhà</Label>
                    <Select
                      value={selectedHouse}
                      onValueChange={setSelectedHouse}
                    >
                      <SelectTrigger
                        id="nha"
                        className="w-full rounded mt-2 shadow-none cursor-pointer"
                        aria-label="Chọn nhà"
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
                    >
                      <SelectTrigger
                        id="phong"
                        className="w-full rounded mt-2 shadow-none cursor-pointer"
                        aria-label="Chọn phòng"
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
                    <Label htmlFor="ngayBatDau">Ngày bắt đầu</Label>
                    <Input
                      id="ngayBatDau"
                      name="ngayBatDau"
                      type="date"
                      value={formData.ngayBatDau}
                      onChange={handleChange}
                      className="w-full rounded mt-2 shadow-none"
                      aria-label="Ngày bắt đầu hợp đồng"
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
                      aria-label="Ngày kết thúc hợp đồng"
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
                      placeholder="Nhập tiền đặt cọc"
                      aria-label="Tiền đặt cọc"
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
                      aria-label="Đơn giá thuê phòng"
                    />
                  </div>

                  <div className="w-full col-span-2">
                    <Label className="text-lg">Thông tin khách</Label>
                    <RadioGroup
                      value={selectedCustomerOption}
                      onValueChange={setSelectedCustomerOption}
                      className="mt-3 flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="existing"
                          id="existing"
                          className="cursor-pointer border-black"
                        />
                        <Label htmlFor="existing" className="cursor-pointer">
                          Khách thuê có sẵn
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="new"
                          id="new"
                          className="cursor-pointer border-slate-500"
                        />
                        <Label htmlFor="new" className="cursor-pointer">
                          Thêm khách thuê mới
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {selectedCustomerOption === "existing" ? (
                    <div className="w-full col-span-2">
                      <Label htmlFor="khachTro">Khách trọ</Label>
                      <Select
                        value={selectedCustomer}
                        onValueChange={setSelectedCustomer}
                      >
                        <SelectTrigger
                          id="khachTro"
                          className="w-full rounded mt-2 shadow-none cursor-pointer"
                          aria-label="Chọn khách trọ"
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
                  ) : (
                    <div className="grid grid-cols-2 gap-4 w-full col-span-2">
                      <div>
                        <Label htmlFor="name">Họ Tên</Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Nguyễn Văn A"
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardId">Số căn cước công dân</Label>
                        <Input
                          type="text"
                          id="cardId"
                          name="cardId"
                          placeholder="123456789012"
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.cardId}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfIssue">Ngày cấp</Label>
                        <Input
                          type="date"
                          id="dateOfIssue"
                          name="dateOfIssue"
                          max={date}
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.dateOfIssue}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="placeOfIssue">Nơi cấp</Label>
                        <Input
                          type="text"
                          id="placeOfIssue"
                          name="placeOfIssue"
                          placeholder="Công an TP. Hà Nội"
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.placeOfIssue}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Giới tính</Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) =>
                            setFormData({ ...formData, gender: value })
                          }
                          className="mt-3 flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="Nam"
                              id="r1"
                              className="cursor-pointer border-black"
                            />
                            <Label htmlFor="r1" className="cursor-pointer">
                              Nam
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="Nu"
                              id="r2"
                              className="cursor-pointer border-slate-500"
                            />
                            <Label htmlFor="r2" className="cursor-pointer">
                              Nữ
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label htmlFor="birthday">Ngày sinh</Label>
                        <Input
                          type="date"
                          id="birthday"
                          name="birthday"
                          max={date}
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.birthday}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumberMain">
                          Số điện thoại chính
                        </Label>
                        <Input
                          type="tel"
                          id="phoneNumberMain"
                          name="phoneNumberMain"
                          placeholder="0123456789"
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.phoneNumberMain}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumberSub">
                          Số điện thoại phụ
                        </Label>
                        <Input
                          type="tel"
                          id="phoneNumberSub"
                          name="phoneNumberSub"
                          placeholder="0123456789"
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.phoneNumberSub}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="abc@gmail.com"
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="vehicleNumber">Số xe</Label>
                        <Input
                          type="text"
                          id="vehicleNumber"
                          name="vehicleNumber"
                          placeholder="29A-12345"
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.vehicleNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="occupation">Nghề nghiệp</Label>
                        <Input
                          type="text"
                          id="occupation"
                          name="occupation"
                          placeholder="Kỹ sư, nhân viên văn phòng, ..."
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.occupation}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="avatar">Ảnh</Label>
                        <Input
                          type="file"
                          id="avatar"
                          name="avatar"
                          className="hidden"
                          accept="image/*"
                          onChange={handleChangeImage}
                          ref={inputRef}
                        />
                        <div
                          className="mt-2 w-40 h-40 border-2 border-dashed rounded p-4 flex items-center justify-center cursor-pointer"
                          onClick={handleClickImage}
                        >
                          {formData.avatar ? (
                            <>
                              {previewImage && (
                                <img
                                  src={previewImage}
                                  alt="Avatar preview"
                                  className="w-32 h-32 object-contain rounded-full border"
                                />
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center gap-1 text-lg font-mono">
                              <Plus className="size-7 text-black" />
                              Chọn ảnh
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                          type="text"
                          id="address"
                          name="address"
                          placeholder="123 Đường ABC, Quận XYZ"
                          className="rounded mt-2 shadow-none w-full"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  <div className="w-full col-span-2">
                    <Label htmlFor="ghiChu">Ghi chú</Label>
                    <Textarea
                      id="ghiChu"
                      name="ghiChu"
                      value={formData.ghiChu}
                      onChange={handleChange}
                      className="w-full rounded mt-2 shadow-none"
                      rows={3}
                      placeholder="Nhập ghi chú (nếu có)"
                      aria-label="Ghi chú hợp đồng"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tab2" className="pt-4">
                <div className="w-full">
                  <Label className="text-lg font-semibold">Dịch vụ</Label>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {dataServices?.DT?.map((service) => (
                      <div
                        key={service.MaDV}
                        className="flex items-center justify-between p-3 border rounded bg-gray-50 hover:bg-gray-100 shadow-sm transition"
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
                            aria-label={`Chọn dịch vụ ${service.TenDV}`}
                          />
                          <Label
                            htmlFor={service.MaDV}
                            className="cursor-pointer flex-1"
                          >
                            {service.TenDV}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600 w-32 text-right">
                            {formatCurrency(service.DonGia || 0)} VNĐ
                          </span>
                          <Input
                            type="number"
                            value={serviceQuantities[service.MaDV] ?? ""}
                            onChange={(e) =>
                              handleQuantityChange(service.MaDV, e.target.value)
                            }
                            disabled={isElectricityOrWater(service)}
                            className="w-20 h-8 text-center rounded"
                            aria-label={`Số lượng dịch vụ ${service.TenDV}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="bg-blue-600 text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createRentMutation.isPending}
                aria-label="Tạo hợp đồng"
              >
                {createRentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Tạo hợp đồng"
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white rounded cursor-pointer"
                variant="destructive"
                aria-label="Hủy tạo hợp đồng"
              >
                Đóng
              </Button>
            </DialogFooter>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddRent;
