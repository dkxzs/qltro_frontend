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
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ModalUpdateRoom = ({ dataUpdate, refetch }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hasRent, setHasRent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [initialFormData, setInitialFormData] = useState(null);
  const [initialServices, setInitialServices] = useState([]);
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
      const newSelectedServices = [...new Set([...serviceIds, ...defaultServiceIds])];
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

  useEffect(() => {
    const checkHasRent = async () => {
      if (open && dataUpdate.MaPT) {
        try {
          setLoading(true);
          const res = await checkRoomHasRentService(dataUpdate.MaPT);
          console.log("checkRoomHasRentService response:", res);
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

  const isServiceChangeAllowed = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    return currentDay <= 4; // Cho phép thay đổi dịch vụ trong 4 ngày đầu tháng
  };

  const mutationUpdateRoom = useMutation({
    mutationFn: async ({ id, data, services }) => {
      console.log("Updating room with ID:", id, "Data:", data, "Services:", services);
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
      return roomResponse || { EC: 0, EM: "Cập nhật dịch vụ thành công" };
    },
    onSuccess: (data) => {
      toast.success(data.EM);
      setOpen(false);
      setInitialServices([...selectedServices]);
      if (refetch) refetch();
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error(error.message || "Cập nhật thất bại");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormDataChanged() && !isServicesChanged()) {
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

    mutationUpdateRoom.mutate({
      id: dataUpdate.MaPT,
      data: formData,
      services: hasRent ? selectedServices : [],
    });
  };

  const isDefaultService = (serviceId) => {
    const defaultServiceIds = dataService?.DT?.filter((service) =>
      ["điện", "nước", "internet", "vệ sinh"].includes(
        service.TenDV.toLowerCase()
      )
    ).map((service) => service.MaDV.toString());
    return defaultServiceIds?.includes(serviceId);
  };

  const isLoadingData =
    isLoadingRoomType || isLoadingService || isLoadingRoomServices || loading;

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
            <DialogTitle>Cập nhật phòng</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin phòng hoặc dịch vụ. Nhấn Lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          {isLoadingData ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenPhong" className="text-right">
                        Tên phòng
                      </Label>
                      <Input
                        id="tenPhong"
                        name="tenPhong"
                        value={formData.tenPhong}
                        onChange={handleChange}
                        placeholder="Nhập tên phòng"
                        className="rounded shadow-none"
                        disabled={hasRent}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maLoaiPhong" className="text-right">
                        Loại phòng
                      </Label>
                      <Select
                        value={formData.maLoaiPhong}
                        onValueChange={(value) =>
                          handleSelectChange("maLoaiPhong", value)
                        }
                      >
                        <SelectTrigger
                          className="col-span-3 w-full rounded shadow-none cursor-pointer"
                          disabled={hasRent}
                        >
                          <SelectValue placeholder="Chọn loại phòng" />
                        </SelectTrigger>
                        <SelectContent className="rounded">
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dienTich" className="text-right">
                        Diện tích (m²)
                      </Label>
                      <Input
                        id="dienTich"
                        name="dienTich"
                        value={formData.dienTich}
                        onChange={handleChange}
                        placeholder="Nhập diện tích"
                        className="rounded shadow-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trangThai" className="text-right">
                        Trạng thái
                      </Label>
                      <Select
                        value={formData.trangThai}
                        onValueChange={(value) =>
                          handleSelectChange("trangThai", value)
                        }
                      >
                        <SelectTrigger
                          className="w-full rounded cursor-pointer"
                          disabled={hasRent}
                        >
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="rounded">
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
                      placeholder="Nhập mô tả phòng"
                      className="col-span-3 shadow-none"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anh" className="text-right">
                      Hình ảnh
                    </Label>
                    <Input
                      id="anh"
                      name="anh"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleChange}
                      className="col-span-3"
                      ref={inputRef}
                    />
                    {previewImage ? (
                      <div
                        className="border-2 w-30 h-30 border-dashed cursor-pointer"
                        onClick={() => inputRef.current.click()}
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
                        onClick={() => inputRef.current.click()}
                      >
                        <Plus className="h-8 w-8 mx-auto mt-2" />
                      </div>
                    )}
                  </div>
                </div>
              </form>
              {!isLoadingData &&
              hasRent &&
              Array.isArray(dataService?.DT) &&
              dataService.DT.length > 0 ? (
                <div className="mt-4 border-t pt-4">
                  <h2 className="font-semibold text-lg mb-2">Dịch vụ phòng</h2>
                  <Label className="font-normal mb-2 text-red-500">
                    Lưu ý: chỉ có thể thay đổi dịch vụ trong 4 ngày đầu của tháng
                  </Label>
                  <div className="space-y-2 overflow-y-auto pr-1">
                    {dataService.DT.map((service, index) => (
                      <div
                        key={service.MaDV || index}
                        className="flex items-center justify-between p-3 my-1 rounded bg-gray-50 hover:bg-gray-100"
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
                              !isServiceChangeAllowed()
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
              ) : hasRent && !isLoadingData ? (
                <div className="mt-4 border-t pt-4">
                  <h2 className="font-semibold text-lg mb-2">Dịch vụ phòng</h2>
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-gray-500">
                      Không có dịch vụ nào được thêm.
                    </p>
                  </div>
                </div>
              ) : null}
            </>
          )}
          <DialogFooter className="mt-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="mr-2 rounded cursor-pointer"
            >
              Đóng
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={mutationUpdateRoom.isPending || isLoadingData}
              className="rounded cursor-pointer"
            >
              {mutationUpdateRoom.isPending ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </DialogFooter>
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

export default ModalUpdateRoom;