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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getDepositByRoomIdService } from "@/services/depositServices";
import { createRentFromDepositService } from "@/services/rentServices";
import { getAllServiceService } from "@/services/serviceServices";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { MdOutlinePostAdd } from "react-icons/md";
import { toast } from "react-toastify";
import { ImageKitProvider, upload } from "@imagekit/react";
import axios from "@/utils/axiosCustomize";
import imagekitConfig from "@/utils/imagekit";
import { useEffect, useRef, useState } from "react";

const ModalAddContractForDeposit = ({ deposit, roomId, refetch }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
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
    dateOfIssue: "",
    placeOfIssue: "",
    vehicleNumber: "",
    occupation: "",
  });
  const [tempFile, setTempFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);
  const date = new Date().toISOString().split("T")[0];

  const { data: dataServices } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAllServiceService(),
    enabled: open,
  });

  const { data: depositData } = useQuery({
    queryKey: ["deposit-by-room", roomId],
    queryFn: () => getDepositByRoomIdService(roomId),
    enabled: open && !!roomId && !deposit,
  });

  const finalDeposit = deposit || depositData?.DT || null;

  useEffect(() => {
    if (open && dataServices?.DT) {
      const defaultServices = dataServices.DT.filter(
        (service) => service.BatBuoc === true
      ).map((service) => service.MaDV);
      setSelectedServices(defaultServices);
      const initialQuantities = dataServices.DT.reduce((acc, service) => {
        acc[service.MaDV] = 1;
        return acc;
      }, {});
      setServiceQuantities(initialQuantities);
    }
    if (open && finalDeposit) {
      setFormData((prev) => ({
        ...prev,
        donGia: finalDeposit?.PhongTro?.LoaiPhong?.DonGia || "",
        datCoc: finalDeposit?.SoTien || "",
        name: finalDeposit?.TenKH || "",
        phoneNumberMain: finalDeposit?.SoDienThoai || "",
      }));
    }
  }, [open, dataServices, finalDeposit]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
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
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh (JPG, PNG, v.v.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB!");
      return;
    }

    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    const objectURL = URL.createObjectURL(file);
    setTempFile(file);
    setPreviewImage(objectURL);
  };

  const handleRemoveImage = () => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    setTempFile(null);
    setPreviewImage(null);
    inputRef.current.value = "";
  };

  const handleServiceChange = (maDV, isChecked) => {
    console.log("Service change:", { maDV, isChecked }); // Debug
    if (isChecked) {
      setSelectedServices((prev) => {
        const newServices = [...prev, maDV];
        console.log("New selectedServices:", newServices); // Debug
        return newServices;
      });
      setServiceQuantities((prev) => ({
        ...prev,
        [maDV]: prev[maDV] || 1,
      }));
    } else {
      setSelectedServices((prev) => {
        const newServices = prev.filter((id) => id !== maDV);
        console.log("New selectedServices:", newServices); // Debug
        return newServices;
      });
    }
  };

  const handleQuantityChange = (maDV, value) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [maDV]: value === "" ? "" : Math.max(1, parseInt(value) || 1),
    }));
  };

  const resetForm = () => {
    setSelectedServices([]);
    setServiceQuantities({});
    setFormData({
      ngayBatDau: "",
      ngayKetThuc: "",
      ghiChu: "",
      donGia: finalDeposit?.PhongTro?.LoaiPhong?.DonGia || "",
      datCoc: finalDeposit?.SoTien || "",
      name: finalDeposit?.TenKH || "",
      cardId: "",
      gender: "Nam",
      birthday: "",
      phoneNumberMain: finalDeposit?.SoDienThoai || "",
      phoneNumberSub: "",
      email: "",
      address: "",
      dateOfIssue: "",
      placeOfIssue: "",
      vehicleNumber: "",
      occupation: "",
    });
    setTempFile(null);
    setPreviewImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const createRentMutation = useMutation({
    mutationFn: async (data) => {
      let image = null;
      if (data.newCustomer && tempFile) {
        setIsUploading(true);
        try {
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
            file: tempFile,
            fileName: `customer-avatar-${Date.now()}-${tempFile.name}`,
            publicKey: imagekitConfig.publicKey,
            ...authParams,
          });

          if (!response.url || !response.fileId) {
            throw new Error("Upload thất bại: Không nhận được URL hoặc FileId");
          }

          image = { Url: response.url, FileId: response.fileId };
        } catch (error) {
          console.error("Image upload error:", error);
          throw new Error(error.message || "Không thể upload ảnh");
        } finally {
          setIsUploading(false);
        }
      }

      const rentData = {
        newCustomer: {
          HoTen: data.newCustomer.HoTen,
          CCCD: data.newCustomer.CCCD,
          GioiTinh: data.newCustomer.GioiTinh,
          NgaySinh: data.newCustomer.NgaySinh,
          DienThoaiChinh: data.newCustomer.DienThoaiChinh,
          DienThoaiPhu: data.newCustomer.DienThoaiPhu,
          Email: data.newCustomer.Email,
          DiaChi: data.newCustomer.DiaChi,
          NgayCap: data.newCustomer.NgayCap,
          NoiCap: data.newCustomer.NoiCap,
          SoXe: data.newCustomer.SoXe,
          NgheNghiep: data.newCustomer.NgheNghiep,
          Anh: image,
        },
        maPT: data.maPT,
        ngayBatDau: data.ngayBatDau,
        ngayKetThuc: data.ngayKetThuc || null,
        ghiChu: data.ghiChu || "",
        donGia: data.donGia,
        datCoc: data.datCoc,
        dichVu: data.dichVu,
        deposit: finalDeposit,
      };

      return createRentFromDepositService(rentData);
    },
    onSuccess: (data) => {
      if (data.EC === 0) {
        toast.success(data.EM);
        setOpen(false);
        resetForm();
        queryClient.invalidateQueries(["rent-list"]);
        refetch?.();
      } else {
        toast.error(data.EM);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.EM || "Có lỗi xảy ra");
      console.error(error);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!finalDeposit) {
      toast.error("Không tìm thấy thông tin đặt cọc");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Tên không được để trống");
      return;
    }
    if (!formData.phoneNumberMain.trim()) {
      toast.error("Số điện thoại chính không được để trống");
      return;
    }
    if (!formData.cardId.trim()) {
      toast.error("Số CCCD không được để trống");
      return;
    }
    if (formData.cardId.trim().length !== 12) {
      toast.error("Số CCCD phải có 12 chữ số");
      return;
    }
    if (!formData.dateOfIssue.trim()) {
      toast.error("Ngày cấp không được để trống");
      return;
    }
    if (!formData.placeOfIssue.trim()) {
      toast.error("Nơi cấp không được để trống");
      return;
    }
    if (formData.phoneNumberMain.trim().length !== 10) {
      toast.error("Số điện thoại chính phải có 10 chữ số");
      return;
    }
    if (!tempFile) {
      toast.error("Ảnh không được để trống");
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

    const datCocValue =
      typeof formData.datCoc === "string"
        ? parseInt(formData.datCoc.replace(/\D/g, ""))
        : formData.datCoc || 0;

    const rentData = {
      newCustomer: {
        HoTen: formData.name,
        CCCD: formData.cardId,
        GioiTinh: formData.gender,
        NgaySinh: formData.birthday || null,
        DienThoaiChinh: formData.phoneNumberMain,
        DienThoaiPhu: formData.phoneNumberSub.trim() || null,
        Email: formData.email.trim() || null,
        DiaChi: formData.address.trim() || null,
        NgayCap: formData.dateOfIssue,
        NoiCap: formData.placeOfIssue.trim(),
        SoXe: formData.vehicleNumber.trim() || null,
        NgheNghiep: formData.occupation.trim() || null,
      },
      maPT: finalDeposit?.MaPT,
      ngayBatDau: formData.ngayBatDau,
      ngayKetThuc: formData.ngayKetThuc || null,
      ghiChu: formData.ghiChu || "",
      donGia:
        typeof formData.donGia === "string"
          ? parseInt(formData.donGia.replace(/\D/g, ""))
          : formData.donGia || 0,
      datCoc: datCocValue,
      dichVu: selectedServices.map((maDV) => ({
        madv: maDV,
        soluong:
          serviceQuantities[maDV] === "" || isNaN(serviceQuantities[maDV])
            ? 1
            : serviceQuantities[maDV],
      })),
    };

    console.log("rentData:", JSON.stringify(rentData, null, 2)); // Debug
    createRentMutation.mutate(rentData);
  };

  const isDefaultService = (service) => service.BatBuoc === true;

  const isElectricityOrWater = (service) =>
    service.TenDV.toLowerCase() === "điện" ||
    service.TenDV.toLowerCase() === "nước";

  return (
    <ImageKitProvider config={imagekitConfig}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer rounded-none outline-none bg-transparent shadow-none">
            <MdOutlinePostAdd className="size-5 text-orange-600" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="bg-white shadow-md rounded max-w-4xl max-h-[90vh] min-h-[90vh] flex flex-col"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Thêm hợp đồng từ đặt cọc</DialogTitle>
            <DialogDescription id="add-contract-description">
              Vui lòng nhập đầy đủ thông tin để tạo hợp đồng từ đặt cọc.
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
                      <Input
                        id="nha"
                        value={finalDeposit?.PhongTro?.Nha?.TenNha || ""}
                        className="w-full rounded mt-2 shadow-none"
                        disabled
                        aria-label="Tên nhà"
                      />
                    </div>

                    <div className="w-full">
                      <Label htmlFor="phong">Phòng</Label>
                      <Input
                        id="phong"
                        value={finalDeposit?.PhongTro?.TenPhong || ""}
                        className="w-full rounded mt-2 shadow-none"
                        disabled
                        aria-label="Tên phòng"
                      />
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
                      <div className="grid grid-cols-2 gap-4 w-full col-span-2 mt-3">
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
                              setFormData((prev) => ({
                                ...prev,
                                gender: value,
                              }))
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
                            disabled={isUploading}
                          />
                          <div
                            className={`mt-2 w-40 h-40 border-2 border-dashed rounded p-4 flex items-center justify-center ${
                              isUploading
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                            onClick={
                              isUploading
                                ? undefined
                                : () => inputRef.current.click()
                            }
                          >
                            {previewImage ? (
                              <div className="relative">
                                <img
                                  src={previewImage}
                                  alt="Avatar preview"
                                  className="w-32 h-32 object-contain"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2 rounded-full p-1"
                                  onClick={handleRemoveImage}
                                  disabled={isUploading}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
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
                    </div>

                    <div className="w-full col-span-2">
                      <Label htmlFor="ghiChu">Ghi chú hợp đồng</Label>
                      <Textarea
                        id="ghiChu"
                        name="ghiChu"
                        value={formData.ghiChu}
                        onChange={handleChange}
                        className="w-full rounded mt-2 shadow-none"
                        rows={3}
                        placeholder="Nhập ghi chú cho hợp đồng (nếu có)"
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
                            {service.CachTinhPhi === "SO_LUONG" &&
                            !isElectricityOrWater(service) ? (
                              <Input
                                type="number"
                                value={serviceQuantities[service.MaDV] ?? ""}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    service.MaDV,
                                    e.target.value
                                  )
                                }
                                className="w-20 h-8 text-center rounded"
                                aria-label={`Số lượng dịch vụ ${service.TenDV}`}
                                min="1"
                              />
                            ) : null}
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
                  disabled={createRentMutation.isPending || isUploading}
                  aria-label="Tạo hợp đồng"
                >
                  {createRentMutation.isPending || isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Tạo hợp đồng"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-white rounded cursor-pointer"
                  variant="destructive"
                  disabled={createRentMutation.isPending || isUploading}
                  aria-label="Hủy tạo hợp đồng"
                >
                  Đóng
                </Button>
              </DialogFooter>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>
    </ImageKitProvider>
  );
};

export default ModalAddContractForDeposit;
