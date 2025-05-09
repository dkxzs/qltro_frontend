import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  checkRoomHasRentService,
  getRoomServicesService,
  updateRoomService,
  updateRoomServicesService,
} from "@/services/roomServices";
import { getAllRoomTypeService } from "@/services/roomTypeServices";
import { getAllServiceService } from "@/services/serviceServices";
import {
  getAllMembersService,
  updateMembersService,
} from "@/services/memberServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Loader2, SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Hàm định dạng ngày tháng sang YYYY-MM-DD
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const ModalUpdateRoom = ({ dataUpdate, refetch }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hasRent, setHasRent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [initialFormData, setInitialFormData] = useState(null);
  const [initialServices, setInitialServices] = useState([]);
  const [members, setMembers] = useState([]);
  const [initialMembers, setInitialMembers] = useState([]);
  const [status] = useState([
    { value: "0", label: "Còn trống" },
    { value: "1", label: "Đã cho thuê" },
    { value: "2", label: "Đang sửa chữa" },
    { value: "3", label: "Đặt cọc" },
  ]);
  const [formData, setFormData] = useState({
    tenPhong: "",
    maNha: "",
    maLoaiPhong: "",
    dienTich: "",
    diaChi: "",
    moTa: "",
    trangThai: "",
    anh: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  const { data: dataRoomType, isLoading: isLoadingRoomType } = useQuery({
    queryKey: ["roomType"],
    queryFn: () => getAllRoomTypeService(),
    enabled: open,
  });

  useEffect(() => {
    if (dataRoomType?.DT) {
      setRoomTypes(dataRoomType.DT);
    }
  }, [dataRoomType]);

  useEffect(() => {
    if (dataUpdate && open) {
      const newFormData = {
        tenPhong: dataUpdate.TenPhong || "",
        maNha: parseInt(dataUpdate.MaNha?.toString()),
        maLoaiPhong: dataUpdate.MaLP?.toString() || "1",
        dienTich: dataUpdate.DienTich?.toString() || "",
        moTa: dataUpdate.MoTa || "",
        trangThai: dataUpdate.TrangThai?.toString(),
        anh: null,
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);

      if (dataUpdate.Anh) {
        setPreviewImage(dataUpdate.Anh);
      } else {
        setPreviewImage(null);
      }
    }
  }, [dataUpdate, open]);

  const { data: dataService, isLoading: isLoadingService } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllServiceService(),
    enabled: open && hasRent,
    staleTime: 5 * 60 * 1000,
  });

  const { data: roomServices, isLoading: isLoadingRoomServices } = useQuery({
    queryKey: ["roomServices", dataUpdate.MaPT],
    queryFn: () => getRoomServicesService(dataUpdate.MaPT),
    enabled: open && hasRent && dataUpdate.MaPT !== undefined,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (
      roomServices?.DT &&
      Array.isArray(roomServices.DT) &&
      roomServices.DT.length > 0
    ) {
      const serviceIds = roomServices.DT.map((service) =>
        service.MaDV.toString()
      );
      const defaultServiceIds =
        dataService?.DT?.filter((service) =>
          ["điện", "nước", "internet", "vệ sinh"].includes(
            service.TenDV.toLowerCase()
          )
        ).map((service) => service.MaDV.toString()) || [];
      const newSelectedServices = [
        ...new Set([...serviceIds, ...defaultServiceIds]),
      ];
      setSelectedServices(newSelectedServices);
      if (!initialServices.length) {
        setInitialServices(newSelectedServices);
      }
    } else {
      const defaultServiceIds =
        dataService?.DT?.filter((service) =>
          ["điện", "nước", "internet", "vệ sinh"].includes(
            service.TenDV.toLowerCase()
          )
        ).map((service) => service.MaDV.toString()) || [];
      setSelectedServices(defaultServiceIds);
      if (!initialServices.length) {
        setInitialServices(defaultServiceIds);
      }
    }
  }, [roomServices, dataService]);

  const { data: membersData, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["members", dataUpdate.MaPT],
    queryFn: async () => {
      const response = await getAllMembersService();
      const roomMembers = response.DT.filter(
        (member) => member.MaTP === dataUpdate.MaTP
      );
      return roomMembers;
    },
    enabled: open && !!dataUpdate.MaTP,
  });

  useEffect(() => {
    if (membersData && membersData.length > 0) {
      const formattedMembers = membersData.map((member) => ({
        MaTV: member.MaTV,
        MaTP: member.MaTP,
        TenTV: member.TenTV,
        CCCD: member.CCCD,
        NgaySinh: formatDateForInput(member.NgaySinh),
        DienThoai: member.DienThoai || "",
        DiaChi: member.DiaChi || "",
        TrangThai: member.TrangThai,
      }));
      setMembers(formattedMembers);
      if (!initialMembers.length) {
        setInitialMembers(formattedMembers);
      }
    } else {
      setMembers([]);
      setInitialMembers([]);
    }
  }, [membersData]);

  useEffect(() => {
    const checkHasRent = async () => {
      if (open && dataUpdate.MaPT) {
        try {
          setLoading(true);
          const res = await checkRoomHasRentService(dataUpdate.MaPT);
          if (res?.EC === 0) {
            setHasRent(res.DT);
          }
        } catch (error) {
          console.error("Error checking rent status:", error);
          toast.error("Không thể kiểm tra trạng thái thuê phòng");
        } finally {
          setLoading(false);
        }
      }
    };

    checkHasRent();
  }, [open, dataUpdate.MaPT]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "anh" && files && files.length > 0) {
      setFormData({ ...formData, anh: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (name === "dienTich") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (serviceId) => {
    serviceId = serviceId.toString();
    if (!isDefaultService(serviceId) && isServiceChangeAllowed()) {
      setSelectedServices((prev) => {
        if (prev.includes(serviceId)) {
          return prev.filter((id) => id !== serviceId);
        } else {
          return [...prev, serviceId];
        }
      });
    }
  };

  const handleMemberChange = (index, e) => {
    const { name, value } = e.target;
    setMembers((prev) => {
      const updatedMembers = [...prev];
      updatedMembers[index] = {
        ...updatedMembers[index],
        [name]: value,
      };
      return updatedMembers;
    });
  };

  const handleMemberStatusChange = (index, checked) => {
    setMembers((prev) => {
      const updatedMembers = [...prev];
      updatedMembers[index] = {
        ...updatedMembers[index],
        TrangThai: checked,
      };
      return updatedMembers;
    });
  };

  const isFormDataChanged = () => {
    if (!initialFormData) return true;
    return (
      formData.tenPhong !== initialFormData.tenPhong ||
      formData.maNha !== initialFormData.maNha ||
      formData.maLoaiPhong !== initialFormData.maLoaiPhong ||
      formData.dienTich !== initialFormData.dienTich ||
      formData.moTa !== initialFormData.moTa ||
      formData.trangThai !== initialFormData.trangThai ||
      formData.anh !== initialFormData.anh
    );
  };

  const isServicesChanged = () => {
    if (!initialServices) return true;
    return (
      selectedServices.length !== initialServices.length ||
      selectedServices.some((id) => !initialServices.includes(id)) ||
      initialServices.some((id) => !selectedServices.includes(id))
    );
  };

  const isMembersChanged = () => {
    if (!initialMembers) return true;
    return (
      members.length !== initialMembers.length ||
      members.some((member, index) => {
        const initialMember = initialMembers[index];
        if (!initialMember) return true;
        return (
          member.TenTV !== initialMember.TenTV ||
          member.CCCD !== initialMember.CCCD ||
          member.NgaySinh !== initialMember.NgaySinh ||
          member.DienThoai !== initialMember.DienThoai ||
          member.DiaChi !== initialMember.DiaChi ||
          member.TrangThai !== initialMember.TrangThai
        );
      })
    );
  };

  const isServiceChangeAllowed = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    return currentDay <= 4;
  };

  const mutationUpdateRoom = useMutation({
    mutationFn: async ({ id, data, services, membersData }) => {
      let roomResponse = null;
      if (isFormDataChanged()) {
        roomResponse = await updateRoomService(id, data);
        if (roomResponse.EC !== 0) {
          throw new Error(roomResponse.EM);
        }
      }
      if (hasRent && services?.length > 0 && isServicesChanged()) {
        const serviceResponse = await updateRoomServicesService(id, services);
        if (serviceResponse.EC !== 0) {
          throw new Error("Cập nhật dịch vụ thất bại: " + serviceResponse.EM);
        }
      }
      if (hasRent && membersData?.length > 0 && isMembersChanged()) {
        const memberResponse = await updateMembersService(membersData);
        if (memberResponse.EC !== 0) {
          throw new Error("Cập nhật thành viên thất bại: " + memberResponse.EM);
        }
      }
      return roomResponse || { EC: 0, EM: "Cập nhật thành công" };
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      setInitialServices([...selectedServices]);
      setInitialMembers([...members]);
      setTimeout(() => setOpen(false), 300); // Độ trễ để toast hiển thị
      if (refetch) refetch();
    },
    onError: (error) => {
      console.error("Update error:", error);
      const errorMessage = error.message.includes("foreign key constraint")
        ? "Cập nhật thất bại: Phòng đang có dữ liệu liên quan (điện nước, hợp đồng, v.v.). Vui lòng kiểm tra lại."
        : error.message || "Cập nhật thất bại";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormDataChanged() && !isServicesChanged() && !isMembersChanged()) {
      toast.info("Không có thay đổi ở cả 3 tab để cập nhật");
      return;
    }

    if (isFormDataChanged()) {
      if (!formData.tenPhong.trim()) {
        toast.error("Vui lòng nhập tên phòng");
        return;
      }

      if (!formData.maLoaiPhong) {
        toast.error("Vui lòng chọn loại phòng");
        return;
      }

      if (!formData.dienTich) {
        toast.error("Vui lòng nhập diện tích phòng");
        return;
      }
    }

    if (isMembersChanged()) {
      for (const member of members) {
        if (!member.TenTV || !member.CCCD) {
          toast.error(
            "Vui lòng nhập đầy đủ Tên và CCCD cho tất cả thành viên!"
          );
          return;
        }
      }
    }

    mutationUpdateRoom.mutate({
      id: dataUpdate.MaPT,
      data: formData,
      services: hasRent ? selectedServices : [],
      membersData: hasRent ? members : [],
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isDefaultService = (serviceId) => {
    const defaultServiceIds = dataService?.DT?.filter((service) =>
      ["điện", "nước", "internet", "vệ sinh"].includes(
        service.TenDV.toLowerCase()
      )
    ).map((service) => service.MaDV.toString());
    return defaultServiceIds?.includes(serviceId);
  };

  const isFormDisabled =
    mutationUpdateRoom.isPending ||
    isLoadingRoomType ||
    isLoadingService ||
    isLoadingRoomServices ||
    isLoadingMembers ||
    loading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
          aria-label="Cập nhật phòng"
        >
          <SquarePen className="size-5 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-4/5 max-w-4xl rounded max-h-[90vh] min-h-[90vh] flex flex-col transition-all duration-300 ease-in-out"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật phòng</DialogTitle>
          <DialogDescription className="-mt-1">
            Chỉnh sửa thông tin phòng, dịch vụ hoặc thành viên. Nhấn Cập nhật
            khi hoàn tất.
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
                Thông tin phòng
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-l-0 border-r-0 border-t-0 border-transparent data-[state=active]:border-primary cursor-pointer"
              >
                Dịch vụ phòng
              </TabsTrigger>
              <TabsTrigger
                value="tab3"
                className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-l-0 border-r-0 border-t-0 border-transparent data-[state=active]:border-primary cursor-pointer"
              >
                Thành viên
              </TabsTrigger>
            </TabsList>

            <div
              className="scrollbar-hide flex-1"
              style={{
                height: "50vh",
                overflowY: "auto",
                borderRadius: "inherit",
              }}
            >
              <TabsContent value="tab1" className="pt-4">
                {isFormDisabled ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6 w-full">
                    <div className="w-full">
                      <Label htmlFor="tenPhong">Tên phòng</Label>
                      <Input
                        id="tenPhong"
                        name="tenPhong"
                        value={formData.tenPhong}
                        onChange={handleChange}
                        placeholder="Nhập tên phòng"
                        className="w-full rounded mt-2 shadow-none"
                        disabled={hasRent || isFormDisabled}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="maLoaiPhong">Loại phòng</Label>
                      <Select
                        value={formData.maLoaiPhong}
                        onValueChange={(value) =>
                          handleSelectChange("maLoaiPhong", value)
                        }
                        disabled={hasRent || isFormDisabled}
                      >
                        <SelectTrigger
                          id="maLoaiPhong"
                          className="w-full rounded mt-2 shadow-none cursor-pointer"
                        >
                          <SelectValue placeholder="Chọn loại phòng" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto rounded">
                          {roomTypes.map((type) => (
                            <SelectItem
                              key={type.MaLP}
                              value={type.MaLP.toString()}
                              className="cursor-pointer"
                            >
                              {type.TenLoaiPhong}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full">
                      <Label htmlFor="dienTich">Diện tích (m²)</Label>
                      <Input
                        id="dienTich"
                        name="dienTich"
                        value={formData.dienTich}
                        onChange={handleChange}
                        placeholder="Nhập diện tích"
                        className="w-full rounded mt-2 shadow-none"
                        disabled={isFormDisabled}
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="trangThai">Trạng thái</Label>
                      <Select
                        value={formData.trangThai}
                        onValueChange={(value) =>
                          handleSelectChange("trangThai", value)
                        }
                        disabled={hasRent || isFormDisabled}
                      >
                        <SelectTrigger
                          id="trangThai"
                          className="w-full rounded mt-2 shadow-none cursor-pointer"
                        >
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto rounded">
                          {status.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              className="cursor-pointer"
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full col-span-2">
                      <Label htmlFor="moTa">Mô tả</Label>
                      <Textarea
                        id="moTa"
                        name="moTa"
                        value={formData.moTa}
                        onChange={handleChange}
                        placeholder="Nhập mô tả phòng"
                        className="w-full rounded mt-2 shadow-none"
                        rows={3}
                        disabled={isFormDisabled}
                      />
                    </div>
                    <div className="w-full col-span-2">
                      <Label htmlFor="anh">Hình ảnh</Label>
                      <Input
                        id="anh"
                        name="anh"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleChange}
                        className="w-full"
                        ref={inputRef}
                        disabled={isFormDisabled}
                      />
                      {previewImage ? (
                        <div
                          className="border-2 w-30 h-30 border-dashed cursor-pointer"
                          onClick={() =>
                            !isFormDisabled && inputRef.current.click()
                          }
                        >
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="p-1 object-contain rounded"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-30 h-30 border-2 border-dashed flex items-center justify-center cursor-pointer"
                          onClick={() =>
                            !isFormDisabled && inputRef.current.click()
                          }
                        >
                          <Plus className="h-8 w-8 mx-auto mt-2" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tab2" className="pt-4">
                {isFormDisabled ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </div>
                ) : hasRent &&
                  Array.isArray(dataService?.DT) &&
                  dataService.DT.length > 0 ? (
                  <div className="w-full">
                    <Label className="text-lg font-semibold">
                      Dịch vụ phòng
                    </Label>
                    <Label className="font-normal mb-2 text-red-500 block">
                      Lưu ý: chỉ có thể thay đổi dịch vụ trong 4 ngày đầu của
                      tháng
                    </Label>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {dataService.DT.map((service, index) => (
                        <div
                          key={service.MaDV || index}
                          className="flex items-center justify-between p-3 border rounded bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <Checkbox
                              id={`service-${service.MaDV}`}
                              className="h-5 w-5 rounded cursor-pointer"
                              checked={selectedServices.includes(
                                service.MaDV.toString()
                              )}
                              onCheckedChange={() =>
                                handleServiceChange(service.MaDV.toString())
                              }
                              disabled={
                                isDefaultService(service.MaDV.toString()) ||
                                !isServiceChangeAllowed() ||
                                isFormDisabled
                              }
                            />
                            <Label
                              htmlFor={`service-${service.MaDV}`}
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
                ) : hasRent ? (
                  <div className="w-full">
                    <Label className="text-lg font-semibold">
                      Dịch vụ phòng
                    </Label>
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-gray-500">
                        Không có dịch vụ nào được thêm.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <Label className="text-lg font-semibold">
                      Dịch vụ phòng
                    </Label>
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-gray-500">
                        Phòng chưa có hợp đồng thuê, không thể thêm dịch vụ.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tab3" className="pt-4">
                {isFormDisabled ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </div>
                ) : hasRent && members.length > 0 ? (
                  <div className="w-full">
                    <Label className="text-lg font-semibold">
                      Danh sách thành viên
                    </Label>
                    <div className="mt-2 max-h-[50vh] overflow-y-auto scrollbar-hide">
                      {members.map((member, index) => (
                        <div key={index} className="mb-6">
                          <Label className="text-md font-semibold">
                            Thành viên {index + 1}
                          </Label>
                          <div className="grid grid-cols-2 gap-6 w-full mt-2">
                            <div className="w-full">
                              <Label htmlFor={`tenTV-${index}`}>
                                Tên thành viên
                              </Label>
                              <Input
                                id={`tenTV-${index}`}
                                name="TenTV"
                                value={member.TenTV}
                                onChange={(e) => handleMemberChange(index, e)}
                                className="w-full rounded mt-2 shadow-none"
                                disabled={isFormDisabled}
                              />
                            </div>
                            <div className="w-full">
                              <Label htmlFor={`cccd-${index}`}>Số CCCD</Label>
                              <Input
                                id={`cccd-${index}`}
                                name="CCCD"
                                value={member.CCCD}
                                onChange={(e) => handleMemberChange(index, e)}
                                className="w-full rounded mt-2 shadow-none"
                                disabled={isFormDisabled}
                              />
                            </div>
                            <div className="w-full">
                              <Label htmlFor={`ngaySinh-${index}`}>
                                Ngày sinh
                              </Label>
                              <Input
                                id={`ngaySinh-${index}`}
                                name="NgaySinh"
                                type="date"
                                value={member.NgaySinh}
                                onChange={(e) => handleMemberChange(index, e)}
                                className="w-full rounded mt-2 shadow-none"
                                disabled={isFormDisabled}
                              />
                            </div>
                            <div className="w-full">
                              <Label htmlFor={`dienThoai-${index}`}>
                                Số điện thoại
                              </Label>
                              <Input
                                id={`dienThoai-${index}`}
                                name="DienThoai"
                                value={member.DienThoai}
                                onChange={(e) => handleMemberChange(index, e)}
                                className="w-full rounded mt-2 shadow-none"
                                disabled={isFormDisabled}
                              />
                            </div>
                            <div className="w-full col-span-2">
                              <Label htmlFor={`diaChi-${index}`}>Địa chỉ</Label>
                              <Textarea
                                id={`diaChi-${index}`}
                                name="DiaChi"
                                value={member.DiaChi}
                                onChange={(e) => handleMemberChange(index, e)}
                                className="w-full rounded mt-2 shadow-none"
                                rows={3}
                                disabled={isFormDisabled}
                              />
                            </div>
                            <div className="w-full">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`trangThai-${index}`}
                                  checked={member.TrangThai}
                                  onCheckedChange={(checked) =>
                                    handleMemberStatusChange(index, checked)
                                  }
                                  className="h-5 w-5 rounded cursor-pointer"
                                  disabled={isFormDisabled}
                                />
                                <Label htmlFor={`trangThai-${index}`}>
                                  Trạng thái (đang ở)
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : hasRent ? (
                  <div className="w-full">
                    <Label className="text-lg font-semibold">
                      Danh sách thành viên
                    </Label>
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-gray-500">
                        Phòng này chưa có thành viên nào.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <Label className="text-lg font-semibold">
                      Danh sách thành viên
                    </Label>
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-gray-500">
                        Phòng chưa có hợp đồng thuê, không thể hiển thị thành
                        viên.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={isFormDisabled}
              className="rounded cursor-pointer flex items-center gap-2 bg-blue-600"
              aria-label="Cập nhật thông tin phòng"
            >
              {mutationUpdateRoom.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              className="rounded cursor-pointer"
              disabled={isFormDisabled}
              variant="destructive"
              aria-label="Đóng dialog cập nhật phòng"
            >
              Đóng
            </Button>
          </DialogFooter>
        </form>
        <style>
          {`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUpdateRoom;
