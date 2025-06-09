import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";

const ContractView = ({ template = {}, rentData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "[Ngày]";
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const personalInfo = useSelector((state) => state.inforConfig.personalInfo);

  const calculateMonths = (startDate, endDate) => {
    if (!startDate || !endDate) return "[Số tháng]";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    return months;
  };

  const getCurrentDate = () => {
    return format(new Date(), "dd 'tháng' MM 'năm' yyyy", { locale: vi });
  };

  // Thay thế placeholder bằng dữ liệu thực tế
  const replacePlaceholders = (text) => {
    if (!rentData) return text;
    return text
      .replace("[HoTen]", rentData.KhachTro?.HoTen || "[Tên khách hàng]")
      .replace(
        "[NgaySinh]",
        rentData.KhachTro?.NgaySinh
          ? format(new Date(rentData.KhachTro.NgaySinh), "yyyy")
          : "[Năm sinh]"
      )
      .replace("[CCCD]", rentData.KhachTro?.CCCD || "[Số CCCD]")
      .replace(
        "[NgayCap]",
        rentData.KhachTro?.NgayCap
          ? formatDate(rentData.KhachTro.NgayCap)
          : "[Ngày cấp]"
      )
      .replace("[NoiCap]", rentData.KhachTro?.NoiCap || "[Nơi cấp]")
      .replace("[DiaChi]", rentData.KhachTro?.DiaChi || "[Địa chỉ khách hàng]")
      .replace(
        "[DienThoai]",
        rentData.KhachTro?.DienThoai || "[Số điện thoại]"
      )
      .replace("[TenPhong]", rentData.PhongTro?.TenPhong || "[Tên phòng]")
      .replace("[TenNha]", rentData.PhongTro?.Nha?.TenNha || "[Tên nhà]")
      .replace("[DiaChi]", rentData.PhongTro?.Nha?.DiaChi || "[Địa chỉ nhà]")
      .replace(
        "[DonGia]",
        rentData.DonGia
          ? rentData.DonGia.toLocaleString("vi-VN") + " đồng"
          : "[Giá thuê]"
      )
      .replace(
        "[NgayBatDau]",
        rentData.NgayBatDau ? formatDate(rentData.NgayBatDau) : "[Ngày bắt đầu]"
      )
      .replace(
        "[ThoiHanThue]",
        calculateMonths(rentData.NgayBatDau, rentData.NgayKetThuc)
      )
      .replace("[CurrentDate]", getCurrentDate())
      .replace("[HoTenCT]", personalInfo?.HoTen || "[Họ tên chủ trọ]");
  };

  const safeTemplate = { ...template };

  return (
    <div className="p-6 border-2 rounded bg-white">
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

      {/* Header */}
      <div className="text-center mb-6">
        {(safeTemplate.header?.preamble || []).map((line, index) => (
          <p
            key={index}
            className={
              index === 0 ? "uppercase font-bold text-lg" : "font-medium"
            }
          >
            {replacePlaceholders(line)}
          </p>
        ))}
        <h1 className="uppercase font-bold text-xl mt-4">
          {replacePlaceholders(safeTemplate.header?.title || "")}
        </h1>
        <p className="text-lg mt-1 font-semibold">
          {replacePlaceholders(safeTemplate.header?.contractInfo)}
        </p>
        <div className="mt-5">
          {(safeTemplate.header?.legalBasis || []).map((line, index) => {
            return (
              <p key={index} className="text-left">
                {replacePlaceholders(line)}
              </p>
            );
          })}
        </div>
      </div>

      {/* Bên A */}
      <div className="mb-4">
        <p className="font-bold">
          {replacePlaceholders(safeTemplate.benA?.title || "")}
        </p>
        <div className="ml-4 mt-2 space-y-2">
          {(safeTemplate.benA?.details || []).map((detail, index) => (
            <p key={index}>{replacePlaceholders(detail)}</p>
          ))}
        </div>
      </div>

      {/* Bên B */}
      <div className="mb-4">
        <p className="font-bold">
          {replacePlaceholders(safeTemplate.benB?.title || "")}
        </p>
        <div className="ml-4 mt-2 space-y-2">
          {(safeTemplate.benB?.details || []).map((detail, index) => (
            <p key={index}>{replacePlaceholders(detail)}</p>
          ))}
        </div>
      </div>

      <p className="mb-4">
        {replacePlaceholders(safeTemplate.thoaThuan || "")}
      </p>

      {/* Điều khoản */}
      {(safeTemplate.dieuKhoan || []).map((dieu, index) => (
        <div key={index} className="mb-4">
          <p className="font-bold">{replacePlaceholders(dieu.title)}</p>
          <ul className="list-disc ml-8 mt-2 space-y-2">
            {(dieu.items || []).map((item, idx) => (
              <li key={idx}>{replacePlaceholders(item)}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Footer */}
      <div className="mt-8 text-right">
        <p>
          {replacePlaceholders(safeTemplate.footer?.location || "")}, Ngày{" "}
          {replacePlaceholders(safeTemplate.footer?.date || "")}
        </p>
        <div className="flex justify-between mt-4">
          {(safeTemplate.footer?.signatures || []).map((sig, index) => (
            <div key={index} className="text-center">
              <p className="font-bold">{replacePlaceholders(sig.party)}</p>
              <p className="mt-16">{replacePlaceholders(sig.note)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractView;
