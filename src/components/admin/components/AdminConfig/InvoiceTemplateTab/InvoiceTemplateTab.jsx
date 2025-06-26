import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminService, updateAdminService } from "@/services/adminServices";
import { deleteImageService } from "@/services/imageServices";
import axios from "@/utils/axiosCustomize";
import { formatCurrency } from "@/utils/formatCurrency";
import imagekitConfig from "@/utils/imagekit";
import { ImageKitProvider, upload } from "@imagekit/react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const InvoiceTemplateTab = () => {
  const [personalInfo, setPersonalInfoLocal] = useState({
    TenNganHang: "",
    SoTaiKhoan: "",
    DienThoai: "",
    qrCodeUrl: "",
    qrCodeFileId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewQrCode, setPreviewQrCode] = useState("");
  const [tempFile, setTempFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef(null);

  const { data: adminData, refetch } = useQuery({
    queryKey: ["invoiceConfig"],
    queryFn: () => getAdminService(),
  });

  useEffect(() => {
    if (adminData?.DT) {
      setPersonalInfoLocal({
        TenNganHang: adminData.DT.TenNganHang || "",
        SoTaiKhoan: adminData.DT.SoTaiKhoan || "",
        DienThoai: adminData.DT.DienThoai || "",
        qrCodeUrl: adminData.DT.HinhAnh?.Url || "",
        qrCodeFileId: adminData.DT.HinhAnh?.FileId || "",
      });
      setPreviewQrCode(adminData.DT.HinhAnh?.Url || "");
    }
  }, [adminData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfoLocal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleQrCodeSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }

    setTempFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewQrCode(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveQrCode = async () => {
    if (!tempFile) {
      toast.error("Vui lòng chọn ảnh trước khi lưu!");
      return;
    }

    setIsUploading(true);
    try {
      const authResponse = await axios.get(
        "http://localhost:8000/api/image/auth"
      );
      const authParams = authResponse.data.DT;

      if (!authParams.signature || !authParams.token || !authParams.expire) {
        throw new Error("Thông tin xác thực không hợp lệ từ backend");
      }

      const fileId = personalInfo.qrCodeFileId;
      if (fileId) {
        await deleteImageService(fileId);
      }

      const response = await upload({
        file: tempFile,
        fileName: `qr-code-${Date.now()}.${tempFile.name.split(".").pop()}`,
        publicKey: imagekitConfig.publicKey,
        ...authParams,
      });

      if (!response.url || !response.fileId) {
        throw new Error(
          "Upload không thành công, không nhận được URL hoặc fileId"
        );
      }

      const updateData = {
        QrCodeUrl: response.url,
        QrCodeFileId: response.fileId,
        DienThoai: personalInfo.DienThoai,
        SoTaiKhoan: personalInfo.SoTaiKhoan,
        TenNganHang: personalInfo.TenNganHang,
      };
      const updateResponse = await updateAdminService(updateData);
      if (updateResponse.EC === 0) {
        setPersonalInfoLocal((prev) => ({
          ...prev,
          qrCodeUrl: response.url,
          qrCodeFileId: response.fileId,
          DienThoai: updateResponse.DT.DienThoai,
          SoTaiKhoan: updateResponse.DT.SoTaiKhoan,
          TenNganHang: updateResponse.DT.TenNganHang,
        }));
        setPreviewQrCode(response.url);
        toast.success("Upload mã QR và thông tin thành công!");
        refetch();
      } else {
        throw new Error(updateResponse.EM);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý mã QR:", error);
      toast.error("Có lỗi xảy ra khi upload hoặc xóa mã QR: " + error.message);
    } finally {
      setIsUploading(false);
      setTempFile(null);
    }
  };

  const handleSaveBankInfo = async () => {
    const updateData = {
      DienThoai: personalInfo.DienThoai,
      SoTaiKhoan: personalInfo.SoTaiKhoan,
      TenNganHang: personalInfo.TenNganHang,
    };
    const updateResponse = await updateAdminService(updateData);
    if (updateResponse.EC === 0) {
      setPersonalInfoLocal((prev) => ({
        ...prev,
        DienThoai: updateResponse.DT.DienThoai,
        SoTaiKhoan: updateResponse.DT.SoTaiKhoan,
        TenNganHang: updateResponse.DT.TenNganHang,
      }));
      setIsEditing(false);
      toast.success("Lưu thông tin ngân hàng thành công!");
      refetch();
    } else {
      toast.error(updateResponse.EM);
    }
  };

  const receiptData = {
    property: {
      name: "Nhà Q7",
      address: "Huỳnh Tấn Phát, Phường Tân Phú, Quận 7, Tp Hồ Chí Minh",
      date: "28/02/2024",
    },
    period: {
      month: "Tháng 2/2024",
      from: "01/02/2024",
      to: "28/02/2024",
    },
    tenant: {
      name: "Vũi Văn Thiết",
      room: "100A",
      entryDate: "12/03/2024",
    },
    charges: [
      {
        id: 1,
        description: "Tiền nhà (từ ngày 01/02/2024 đến ngày 28/02/2024)",
        amount: 5310345,
      },
      { id: 2, description: "Xe máy (Số lượng: 1)", amount: 50000 },
      { id: 3, description: "Wifi (Số lượng: 1)", amount: 250000 },
      { id: 4, description: "Vệ sinh (Số lượng: 2)", amount: 40000 },
      {
        id: 5,
        description: "Nước (CS cũ: 821,00 - CS mới: 845,00 - SD: 24,00 )",
        amount: 480000,
      },
      {
        id: 6,
        description: "Điện (CS cũ: 980,00 - CS mới: 1239,00 - SD: 259,00 )",
        amount: 777000,
      },
    ],
    bankInfo: {
      bank: "Sacombank",
      accountNumber: "0786123512124 - [ Huỳnh Công Khanh ]",
      phone: "0777905219",
    },
  };

  const displayBank = personalInfo.TenNganHang || receiptData.bankInfo.bank;
  const displayAccountNumber =
    personalInfo.SoTaiKhoan || receiptData.bankInfo.accountNumber;

  const totalAmount = receiptData.charges.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const numberToVietnameseWords = () => {
    return "sáu triệu chín trăm bảy nghìn ba trăm bốn mươi năm";
  };

  return (
    <ImageKitProvider config={imagekitConfig}>
      <div className="max-w-3xl mx-auto p-4 bg-white">
        <div className="flex justify-between mb-4">
          <div className="text-sm">
            <p className="font-semibold">Nhà: {receiptData.property.name}</p>
            <p>{receiptData.property.address}</p>
          </div>
          <div className="text-sm text-right">{receiptData.property.date}</div>
        </div>

        <h1 className="text-2xl font-bold text-center text-[#003366] mb-2">
          HÓA ĐƠN TIỀN NHÀ
        </h1>

        <div className="text-center mb-4">
          <p className="font-medium">{receiptData.period.month}</p>
          <p className="text-sm">
            (từ ngày {receiptData.period.from} đến ngày {receiptData.period.to})
          </p>
        </div>

        <div className="mb-6">
          <p>
            <span className="font-medium">Họ và tên:</span>{" "}
            {receiptData.tenant.name}
          </p>
          <p>
            <span className="font-medium">Phòng:</span>{" "}
            {receiptData.tenant.room}
          </p>
          <p>
            <span className="font-medium">Ngày vào:</span>{" "}
            {receiptData.tenant.entryDate}
          </p>
        </div>

        <div className="mb-6">
          {receiptData.charges.map((item) => (
            <div
              key={item.id}
              className="flex justify-between py-1 border-b border-gray-100"
            >
              <div>
                {item.id}. {item.description}
              </div>
              <div className="text-right font-medium">
                {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-800">
            <div className="text-[#003366]">TỔNG CỘNG</div>
            <div className="text-right">{formatCurrency(totalAmount)}</div>
          </div>
          <div className="text-center italic text-sm">
            ( Bằng chữ: {numberToVietnameseWords(totalAmount)} )
          </div>
        </div>

        <div className="bg-gray-100 p-3 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Thông tin số tài khoản</h3>
            <Button
              onClick={toggleEdit}
              className="rounded cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
            >
              {isEditing ? "Huỷ" : "Chỉnh sửa"}
            </Button>
          </div>
          {isEditing ? (
            <>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="TenNganHang">Ngân hàng</Label>
                  <Input
                    id="TenNganHang"
                    name="TenNganHang"
                    value={personalInfo.TenNganHang}
                    onChange={handleChange}
                    className="rounded shadow-none"
                  />
                </div>
                <div>
                  <Label htmlFor="SoTaiKhoan">Số tài khoản</Label>
                  <Input
                    id="SoTaiKhoan"
                    name="SoTaiKhoan"
                    value={personalInfo.SoTaiKhoan}
                    onChange={handleChange}
                    className="rounded shadow-none"
                  />
                </div>
                <div>
                  <Label htmlFor="DienThoai">Số điện thoại</Label>
                  <Input
                    id="DienThoai"
                    name="DienThoai"
                    value={personalInfo.DienThoai}
                    onChange={handleChange}
                    className="rounded shadow-none"
                  />
                </div>
                <Button
                  onClick={handleSaveBankInfo}
                  className="mt-2 rounded cursor-pointer bg-blue-600 text-white hover:bg-blue-700 px-6"
                  disabled={isUploading}
                >
                  Lưu
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>
                <span className="font-medium">Ngân hàng:</span>{" "}
                {displayBank || "Chưa nhập"}
              </p>
              <p>
                <span className="font-medium">Số tài khoản:</span>{" "}
                {displayAccountNumber || "Chưa nhập"} - [{adminData?.DT.HoTen}]
              </p>
              <p>
                <span className="font-medium">Số điện thoại liên hệ:</span>{" "}
                {personalInfo.DienThoai}
              </p>
            </>
          )}
        </div>

        <div className="mt-4 p-3">
          <h3 className="font-bold mb-2">Mã QR Thanh Toán</h3>
          <Input
            type="file"
            accept="image/*"
            onChange={handleQrCodeSelect}
            className="mb-2"
            hidden
            ref={imgRef}
            disabled={isUploading}
          />
          <div className="flex items-center gap-4">
            {previewQrCode ? (
              <div
                className="flex items-center w-40 h-40 justify-center border-2 border-dashed border-gray-300 rounded p-4 cursor-pointer overflow-hidden"
                onClick={() => !isUploading && imgRef.current.click()}
              >
                <img
                  src={previewQrCode}
                  alt="Mã QR Preview"
                  className="max-w-[150px] h-36 mt-2"
                />
              </div>
            ) : (
              <div
                className="flex items-center w-40 h-40 justify-center border-2 border-dashed border-gray-300 rounded p-4 cursor-pointer"
                onClick={() => !isUploading && imgRef.current.click()}
              >
                <Plus />
                Chọn ảnh
              </div>
            )}
            {tempFile && (
              <Button
                onClick={handleSaveQrCode}
                className="bg-green-500 text-white hover:bg-green-600 rounded cursor-pointer"
                disabled={isUploading}
              >
                {isUploading ? "Đang lưu..." : "Lưu"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </ImageKitProvider>
  );
};

export default InvoiceTemplateTab;
