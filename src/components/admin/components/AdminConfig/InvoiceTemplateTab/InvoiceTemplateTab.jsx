import { useSelector, useDispatch } from "react-redux";
import { setPersonalInfo } from "@/redux/slices/inforSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatCurrency";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const InvoiceTemplateTab = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state) => state.inforConfig.personalInfo);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setPersonalInfo({ [name]: value }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
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

  // Chỉ sử dụng giá trị mặc định nếu personalInfo.TenNganHang hoặc SoTaiKhoan chưa được định nghĩa (undefined)
  const displayBank =
    personalInfo.TenNganHang !== undefined
      ? personalInfo.TenNganHang
      : receiptData.bankInfo.bank;
  const displayAccountNumber =
    personalInfo.SoTaiKhoan !== undefined
      ? personalInfo.SoTaiKhoan
      : receiptData.bankInfo.accountNumber;

  const totalAmount = receiptData.charges.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Convert number to Vietnamese words
  const numberToVietnameseWords = () => {
    return "sáu triệu chín trăm bảy nghìn ba trăm bốn mươi năm";
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div className="text-sm">
          <p className="font-semibold">Nhà: {receiptData.property.name}</p>
          <p>{receiptData.property.address}</p>
        </div>
        <div className="text-sm text-right">{receiptData.property.date}</div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-[#003366] mb-2">
        HÓA ĐƠN TIỀN NHÀ
      </h1>

      {/* Period */}
      <div className="text-center mb-4">
        <p className="font-medium">{receiptData.period.month}</p>
        <p className="text-sm">
          (từ ngày {receiptData.period.from} đến ngày {receiptData.period.to})
        </p>
      </div>

      {/* Tenant Info */}
      <div className="mb-6">
        <p>
          <span className="font-medium">Họ và tên:</span>{" "}
          {receiptData.tenant.name}
        </p>
        <p>
          <span className="font-medium">Phòng:</span> {receiptData.tenant.room}
        </p>
        <p>
          <span className="font-medium">Ngày vào:</span>{" "}
          {receiptData.tenant.entryDate}
        </p>
      </div>

      {/* Charges */}
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

      {/* Total */}
      <div className="mb-6">
        <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-800">
          <div className="text-[#003366]">TỔNG CỘNG</div>
          <div className="text-right">{formatCurrency(totalAmount)}</div>
        </div>
        <div className="text-center italic text-sm">
          ( Bằng chữ: {numberToVietnameseWords(totalAmount)} )
        </div>
      </div>

      {/* Bank Info */}
      <div className="bg-gray-100 p-3 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Thông tin số tài khoản</h3>
          <Button
            onClick={toggleEdit}
            className="rounded cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
          >
            {isEditing ? "Lưu" : "Chỉnh sửa"}
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
                  value={
                    personalInfo.TenNganHang !== undefined
                      ? personalInfo.TenNganHang
                      : receiptData.bankInfo.bank
                  }
                  onChange={handleChange}
                  className="rounded shadow-none"
                />
              </div>
              <div>
                <Label htmlFor="SoTaiKhoan">Số tài khoản</Label>
                <Input
                  id="SoTaiKhoan"
                  name="SoTaiKhoan"
                  value={
                    personalInfo.SoTaiKhoan !== undefined
                      ? personalInfo.SoTaiKhoan
                      : receiptData.bankInfo.accountNumber
                  }
                  onChange={handleChange}
                  className="rounded shadow-none"
                />
              </div>
              <p>
                <span className="font-medium">Số điện thoại liên hệ:</span>{" "}
                {receiptData.bankInfo.phone}
              </p>
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
              {displayAccountNumber || "Chưa nhập"}
            </p>
            <p>
              <span className="font-medium">Số điện thoại liên hệ:</span>{" "}
              {receiptData.bankInfo.phone}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceTemplateTab;
