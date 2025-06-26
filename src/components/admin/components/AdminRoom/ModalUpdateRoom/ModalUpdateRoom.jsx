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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  getAllMembersService,
  updateMembersService,
} from "@/services/memberServices";
import {
  checkRoomHasRentService,
  getRoomServicesService,
  updateRoomService,
  updateRoomServicesService,
} from "@/services/roomServices";
import { getAllRoomTypeService } from "@/services/roomTypeServices";
import { getAllServiceService } from "@/services/serviceServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Plus, SquarePen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ImageKitProvider, upload } from "@imagekit/react";
import axios from "@/utils/axiosCustomize";
import imagekitConfig from "@/utils/imagekit";
import ModalDeleteMember from "../ModalDeleteMember/ModalDeleteMember";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const ModalUpdateRoom = ({ dataUpdate, refetch }) => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hasRent, setHasRent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceQuantities, setServiceQuantities] = useState({});
  const [initialFormData, setInitialFormData] = useState(null);
  const [initialServices, setInitialServices] = useState([]);
  const [initialQuantities, setInitialQuantities] = useState({});
  const [members, setMembers] = useState([]);
  const [initialMembers, setInitialMembers] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const status = [
    { value: "0", label: "Còn trống" },
    { value: "1", label: "Đã cho thuê" },
    { value: "2", label: "Đặt cọc" },
    { value: "3", label: "Đang sửa chữa" },
  ];

  const [formData, setFormData] = useState({
    tenPhong: "",
    maNha: "",
    maLoaiPhong: "",
    dienTich: "",
    moTa: "",
    trangThai: "",
    soLuongNguoiToiDa: "",
    tieuDe: "",
  });

  const {
    data: membersData,
    isLoading: isLoadingMembers,
    refetch: refetchMember,
  } = useQuery({
    queryKey: ["members", dataUpdate?.MaPT],
    queryFn: async () => {
      const response = await getAllMembersService();
      return response.DT.filter((member) => member.MaTP === dataUpdate.MaTP);
    },
    enabled: open && !!dataUpdate?.MaPT,
  });

  const { data: dataRoomType, isLoading: isLoadingRoomType } = useQuery({
    queryKey: ["roomType"],
    queryFn: () => getAllRoomTypeService(),
    enabled: open,
  });

  const { data: dataService, isLoading: isLoadingService } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllServiceService(),
    enabled: open && hasRent,
    staleTime: 5 * 60 * 1000,
  });

  const { data: roomServices, isLoading: isLoadingRoomServices } = useQuery({
    queryKey: ["roomServices", dataUpdate?.MaPT],
    queryFn: () => getRoomServicesService(dataUpdate.MaPT),
    enabled: open && hasRent && !!dataUpdate?.MaPT,
    staleTime: 5 * 60 * 1000,
  });

  // Khởi tạo dữ liệu
  useEffect(() => {
    if (dataRoomType?.DT) {
      setRoomTypes(dataRoomType.DT);
    }
  }, [dataRoomType]);

  useEffect(() => {
    if (dataUpdate && open) {
      const newFormData = {
        tenPhong: dataUpdate.TenPhong || "",
        maNha: dataUpdate.MaNha?.toString() || "",
        maLoaiPhong: dataUpdate.MaLP?.toString() || "",
        dienTich: dataUpdate.DienTich?.toString() || "",
        moTa: dataUpdate.MoTa || "",
        trangThai: dataUpdate.TrangThai?.toString() || "0",
        soLuongNguoiToiDa: dataUpdate.SoLuongNguoiToiDa?.toString() || "",
        tieuDe: dataUpdate.TieuDe || "",
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
      setExistingImages(
        dataUpdate.HinhAnh?.map((img) => ({
          Url: img.Url,
          FileId: img.FileId,
        })) || []
      );
    }
  }, [dataUpdate, open]);

  useEffect(() => {
    if (roomServices?.DT && Array.isArray(roomServices.DT)) {
      const serviceIds = roomServices.DT.map((service) =>
        service.MaDV.toString()
      );
      const quantities = roomServices.DT.reduce((acc, service) => {
        acc[service.MaDV.toString()] = service.SoLuong || 1;
        return acc;
      }, {});
      setSelectedServices(serviceIds);
      setServiceQuantities(quantities);
      if (!initialServices.length) {
        setInitialServices(serviceIds);
        setInitialQuantities(quantities);
      }
    } else if (dataService?.DT) {
      const defaultServiceIds = dataService.DT.filter(
        (service) => service.BatBuoc === true
      ).map((service) => service.MaDV.toString());
      const initialQuantities = dataService.DT.reduce((acc, service) => {
        acc[service.MaDV.toString()] =
          service.CachTinhPhi === "SO_LUONG" ? 1 : 1; // Số lượng mặc định
        return acc;
      }, {});
      setSelectedServices(defaultServiceIds);
      setServiceQuantities(initialQuantities);
      if (!initialServices.length) {
        setInitialServices(defaultServiceIds);
        setInitialQuantities(initialQuantities);
      }
    }
  }, [roomServices, dataService]);

  useEffect(() => {
    const checkHasRent = async () => {
      if (open && dataUpdate?.MaPT) {
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
  }, [open, dataUpdate?.MaPT]);

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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.every((file) => file.type.startsWith("image/"))) {
      toast.error("Vui lòng chỉ chọn file ảnh!");
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      toast.error("Mỗi file ảnh không được vượt quá 5MB!");
      return;
    }
    if (tempFiles.length + existingImages.length + files.length > 5) {
      toast.error("Chỉ được chọn tối đa 5 ảnh!");
      return;
    }

    const newPreviews = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });
    });

    Promise.all(newPreviews).then((newPreviewUrls) => {
      setTempFiles((prev) => [...prev, ...files]);
      setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    });
  };

  const handleRemoveExistingImage = (fileId) => {
    setExistingImages((prev) => prev.filter((img) => img.FileId !== fileId));
    setImagesToDelete((prev) => [...prev, fileId]);
  };

  const handleRemoveNewImage = (index) => {
    setTempFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dienTich") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (maDV, isChecked) => {
    maDV = maDV.toString();
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

  const handleMemberChange = (index, e) => {
    const { name, value } = e.target;
    setMembers((prev) => {
      const updatedMembers = [...prev];
      updatedMembers[index] = { ...updatedMembers[index], [name]: value };
      return updatedMembers;
    });
  };

  const handleMemberStatusChange = (index, checked) => {
    setMembers((prev) => {
      const updatedMembers = [...prev];
      updatedMembers[index] = { ...updatedMembers[index], TrangThai: checked };
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
      formData.soLuongNguoiToiDa !== initialFormData.soLuongNguoiToiDa ||
      formData.tieuDe !== initialFormData.tieuDe ||
      tempFiles.length > 0 ||
      imagesToDelete.length > 0
    );
  };

  const isServicesChanged = () => {
    if (!initialServices) return true;
    return (
      selectedServices.length !== initialServices.length ||
      selectedServices.some((id) => !initialServices.includes(id)) ||
      initialServices.some((id) => !selectedServices.includes(id)) ||
      Object.keys(serviceQuantities).some(
        (maDV) =>
          serviceQuantities[maDV] !== (initialQuantities[maDV] || 1) &&
          selectedServices.includes(maDV)
      )
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
    return currentDay <= 5;
  };

  const isDefaultService = (service) => service.BatBuoc === true;

  const isElectricityOrWater = (service) =>
    service.TenDV.toLowerCase() === "điện" ||
    service.TenDV.toLowerCase() === "nước";

  const mutationUpdateRoom = useMutation({
    mutationFn: async ({ id, data, services, membersData }) => {
      const images = [];
      if (tempFiles.length > 0) {
        for (const file of tempFiles) {
          const authResponse = await axios.get(
            "http://localhost:8000/api/image/auth"
          );
          const authParams = authResponse.data.DT;

          if (
            !authParams.signature ||
            !authParams.token ||
            !authParams.expire
          ) {
            throw new Error("Thông tin xác thực không hợp lệ từ backend");
          }

          const response = await upload({
            file,
            fileName: `room-image-${Date.now()}-${file.name}`,
            publicKey: imagekitConfig.publicKey,
            ...authParams,
          });

          if (!response.url || !response.fileId) {
            throw new Error(
              "Upload không thành công, không nhận được URL hoặc fileId"
            );
          }

          images.push({
            Url: response.url,
            FileId: response.fileId,
          });
        }
      }

      let roomResponse = null;
      if (isFormDataChanged()) {
        roomResponse = await updateRoomService({
          maPT: id,
          ...data,
          images,
          imagesToDelete,
        });
        if (roomResponse.EC !== 0) {
          throw new Error(roomResponse.EM);
        }
      }

      if (hasRent && services?.length > 0 && isServicesChanged()) {
        const servicePayload = services.map((maDV) => ({
          madv: maDV,
          soluong:
            serviceQuantities[maDV] === "" || isNaN(serviceQuantities[maDV])
              ? 1
              : serviceQuantities[maDV],
        }));
        const serviceResponse = await updateRoomServicesService(
          id,
          servicePayload
        );
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
      setInitialQuantities({ ...serviceQuantities });
      setInitialMembers([...members]);
      setTempFiles([]);
      setPreviewImages([]);
      setExistingImages((prev) =>
        prev.filter((img) => !imagesToDelete.includes(img.FileId))
      );
      setImagesToDelete([]);
      setTimeout(() => setOpen(false), 300);
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
      toast.info("Không có thay đổi để cập nhật");
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
    setTempFiles([]);
    setPreviewImages([]);
    setImagesToDelete([]);
  };

  const isFormLoading =
    isLoadingRoomType ||
    isLoadingService ||
    isLoadingRoomServices ||
    isLoadingMembers ||
    loading;

  return (
    <ImageKitProvider config={imagekitConfig}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex items-center cursor-pointer bg-transparent border-none rounded-none shadow-none outline-none text-white"
            aria-label="Cập nhật phòng"
          >
            <SquarePen className="size-4 text-blue-600" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="w-4/5 max-w-4xl rounded max-h-[95vh] min-h-[95vh] flex flex-col transition-all duration-300 ease-in-out overflow-auto"
          onInteractOutside={(event) => event.preventDefault()}
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
                  {isFormLoading ? (
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
                          disabled={hasRent}
                        />
                      </div>
                      <div className="w-full">
                        <Label htmlFor="maLoaiPhong">Loại phòng</Label>
                        <Select
                          value={formData.maLoaiPhong}
                          onValueChange={(value) =>
                            handleSelectChange("maLoaiPhong", value)
                          }
                          disabled={hasRent}
                        >
                          <SelectTrigger
                            id="maLoaiPhong"
                            className="w-full rounded mt-2 cursor-pointer shadow-none"
                          >
                            <SelectValue placeholder="Chọn loại phòng" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto rounded">
                            {roomTypes.map((type) => (
                              <SelectItem
                                key={type.MaLP}
                                value={type.MaLP.toString()}
                                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
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
                        />
                      </div>
                      <div className="w-full">
                        <Label htmlFor="soLuongNguoiToiDa">
                          Số lượng người tối đa
                        </Label>
                        <Input
                          id="soLuongNguoiToiDa"
                          name="soLuongNguoiToiDa"
                          value={formData.soLuongNguoiToiDa}
                          onChange={handleChange}
                          placeholder="Nhập số lượng"
                          type="number"
                          className="w-full rounded mt-2 shadow-none"
                        />
                      </div>
                      <div className="w-full">
                        <Label htmlFor="tieuDe">Tiêu đề</Label>
                        <Input
                          id="tieuDe"
                          name="tieuDe"
                          value={formData.tieuDe}
                          onChange={handleChange}
                          placeholder="Nhập tiêu đề phòng"
                          className="w-full rounded mt-2 shadow-none"
                        />
                      </div>
                      <div className="w-full">
                        <Label htmlFor="trangThai">Trạng thái</Label>
                        <Select
                          value={formData.trangThai}
                          onValueChange={(value) =>
                            handleSelectChange("trangThai", value)
                          }
                          disabled={hasRent}
                        >
                          <SelectTrigger
                            id="trangThai"
                            className="w-full rounded mt-2 cursor-pointer"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {status.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                                className="relative cursor-pointer"
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
                        />
                      </div>
                      <div className="w-full col-span-2">
                        <Label>Hình ảnh</Label>
                        <div className="flex flex-wrap gap-4 mt-2">
                          {existingImages.map((img, index) => (
                            <div key={img.FileId} className="relative">
                              <img
                                src={img.Url}
                                alt={`Existing ${index + 1}`}
                                className="max-w-[150px] h-36 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 rounded-full p-1"
                                onClick={() =>
                                  handleRemoveExistingImage(img.FileId)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {previewImages.map((src, index) => (
                            <div key={index} className="relative">
                              <img
                                src={src}
                                alt={`New ${index + 1}`}
                                className="max-w-[150px] h-36 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 rounded-full p-1"
                                onClick={() => handleRemoveNewImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <div
                            className="flex items-center w-36 h-36 justify-center border-2 border-dashed border-gray-300 rounded p-4 cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                          >
                            <Plus />
                            Chọn ảnh
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                            ref={fileInputRef}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="tab2" className="pt-4">
                  {isFormLoading ? (
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
                        Lưu ý: Chỉ có thể thay đổi dịch vụ trong 5 ngày đầu của
                        tháng
                      </Label>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        {dataService.DT.map((service, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <Checkbox
                                id={`service-${service.MaDV}`}
                                checked={selectedServices.includes(
                                  service.MaDV.toString()
                                )}
                                onCheckedChange={(checked) =>
                                  handleServiceChange(
                                    service.MaDV.toString(),
                                    checked
                                  )
                                }
                                disabled={
                                  isDefaultService(service) ||
                                  !isServiceChangeAllowed()
                                }
                                className="h-5 w-5"
                              />
                              <Label
                                htmlFor={`service-${service.MaDV}`}
                                className="cursor-pointer flex-1"
                              >
                                {service.TenDV}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600 w-32 text-right">
                                {formatCurrency(service.DonGia || 0)} VNĐ
                              </span>
                              {service.CachTinhPhi === "SO_LUONG" &&
                              !isElectricityOrWater(service) ? (
                                <Input
                                  type="number"
                                  value={
                                    serviceQuantities[
                                      service.MaDV.toString()
                                    ] ?? ""
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      service.MaDV.toString(),
                                      e.target.value
                                    )
                                  }
                                  disabled={!isServiceChangeAllowed()}
                                  className="w-20 h-8 text-center rounded"
                                  min="0"
                                />
                              ) : null}
                            </div>
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
                  {isFormLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <span className="ml-2">Đang tải dữ liệu...</span>
                    </div>
                  ) : hasRent && members.length > 0 ? (
                    <div className="w-full">
                      <Label className="text-lg font-semibold">
                        Danh sách thành viên
                      </Label>
                      <div className="mt-2 max-h-[50vh] overflow-y-auto">
                        {members.map((member, index) => (
                          <div key={index} className="mb-6">
                            <Label className="text-md font-semibold w-full">
                              <div className="flex justify-between items-center w-full">
                                <div>Thành viên {index + 1}</div>
                                <div>
                                  <ModalDeleteMember
                                    dataDelete={member}
                                    refetch={refetchMember}
                                  />
                                </div>
                              </div>
                            </Label>
                            <div className="grid grid-cols-2 gap-6 w-full mt-2">
                              <div className="w-full">
                                <Label htmlFor={`ten-${index}`}>
                                  Tên thành viên
                                </Label>
                                <Input
                                  id={`ten-${index}`}
                                  name="TenTV"
                                  value={member.TenTV}
                                  onChange={(e) => handleMemberChange(index, e)}
                                  className="w-full rounded mt-2 shadow-none"
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
                                />
                              </div>
                              <div className="w-full col-span-2">
                                <Label htmlFor={`diaChi-${index}`}>
                                  Địa chỉ
                                </Label>
                                <Textarea
                                  id={`diaChi-${index}`}
                                  name="DiaChi"
                                  value={member.DiaChi}
                                  onChange={(e) => handleMemberChange(index, e)}
                                  className="w-full rounded mt-2 shadow-none"
                                  rows={3}
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
                      <div className="h-[200px] rounded">
                        <p className="text-gray-600">
                          Phòng này chưa có thành viên nào.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <Label className="text-lg font-semibold">
                        Danh sách thành viên
                      </Label>
                      <div className="h-[200px] rounded">
                        <p className="text-gray-600">
                          Phòng chưa có hợp đồng thuê, không thể hiển thị thành
                          viên xem.
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
                disabled={isFormLoading || mutationUpdateRoom.isPending}
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
                disabled={isFormLoading || mutationUpdateRoom.isPending}
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
    </ImageKitProvider>
  );
};

export default ModalUpdateRoom;
