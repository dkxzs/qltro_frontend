import { useSelector, useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ContractView from "./Contractview";
import { updateTemplate } from "@/redux/slices/contractSlice";

const ContractTemplateTab = () => {
  const dispatch = useDispatch();
  const template = useSelector((state) => state.contractConfig.template);
  // Tạo deep copy của template
  const [editedTemplate, setEditedTemplate] = useState(
    template
      ? JSON.parse(JSON.stringify(template))
      : {
          header: {
            title: "HỢP ĐỒNG CHO THUẺ PHÒNG TRỌ",
            contractInfo: "Số: HD[SoHD]  Ngày Ký: [NgayKy]",
            legalBasis: [
              "- Căn cứ Bộ luật dân sự của nước Cộng hoà xã hội chủ nghĩa Việt nam có hiệu lực từ ngày 01/01/2006;",
              "- Căn cứ nhu cầu và khả năng của hai bên,", 
              "- Hôm nay, ngày [ngay] tháng [thang] năm [nam] tại địa chỉ [DiaChi], chúng tôi gồm có",
            ],
            preamble: [
              "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM",
              "Độc Lập-Tự Do-Hạnh Phúc",
              "---oOo---",
            ],
          },
          benA: {
            title: "BÊN A : BÊN CHO THUẺ PHÒNG TRỌ",
            details: [
              "Họ và Tên: [HoTenCT]",
              "Năm sinh: [NgaySinhCT]",
              "CCCD số: [CCCDCT]",
              "Ngày cấp: [NgayCapCT]",
              "Nơi cấp: [NoiCapCT]",
              "Địa chỉ: [DiaChiCT]",
              "Số điện thoại: [DienThoaiCT]",
            ],
          },
          benB: {
            title: "BÊN B : BÊN THUẺ PHÒNG TRỌ",
            details: [
              "Họ và Tên: [HoTen]",
              "Năm sinh: [NgaySinh]",
              "CCCD số: [CCCD]",
              "Ngày cấp: [NgayCap]",
              "Nơi cấp: [NoiCap]",
              "Thường Trú: [DiaChi]",
              "Số điện thoại: [DienThoai]",
            ],
          },
          thoaThuan: "Hai bên cùng thỏa thuận và đồng ý với nội dung sau :",
          dieuKhoan: [],
          footer: {
            location: "Tp. Hồ Chí Minh",
            date: "[CurrentDate]",
            signatures: [
              { party: "BÊN A", note: "(Ký và ghi rõ họ tên)" },
              { party: "BÊN B", note: "(Ký và ghi rõ họ tên)" },
            ],
          },
        }
  );
  const [editMode, setEditMode] = useState(false);

  // Reset editedTemplate khi hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditedTemplate(
      template ? JSON.parse(JSON.stringify(template)) : editedTemplate
    );
    setEditMode(false);
  };

  const handleAddDieuKhoan = () => {
    setEditedTemplate((prev) => ({
      ...prev,
      dieuKhoan: [
        ...prev.dieuKhoan,
        {
          title: `Điều ${prev.dieuKhoan.length + 1}:`,
          items: ["[Nội dung điều khoản mới]"],
        },
      ],
    }));
  };

  const handleAddItem = (dieuIndex) => {
    setEditedTemplate((prev) => {
      const newDieuKhoan = prev.dieuKhoan.map((dieu, idx) =>
        idx === dieuIndex
          ? { ...dieu, items: [...dieu.items, "[Nội dung mới]"] }
          : dieu
      );
      return { ...prev, dieuKhoan: newDieuKhoan };
    });
  };

  const handleRemoveDieuKhoan = (dieuIndex) => {
    setEditedTemplate((prev) => {
      const newDieuKhoan = prev.dieuKhoan.filter((_, idx) => idx !== dieuIndex);
      return { ...prev, dieuKhoan: newDieuKhoan };
    });
  };

  const handleRemoveItem = (dieuIndex, itemIndex) => {
    setEditedTemplate((prev) => {
      const newDieuKhoan = prev.dieuKhoan.map((dieu, idx) =>
        idx === dieuIndex
          ? { ...dieu, items: dieu.items.filter((_, i) => i !== itemIndex) }
          : dieu
      );
      return { ...prev, dieuKhoan: newDieuKhoan };
    });
  };

  const handleChangeDieuKhoanTitle = (dieuIndex, value) => {
    setEditedTemplate((prev) => {
      const newDieuKhoan = prev.dieuKhoan.map((dieu, idx) =>
        idx === dieuIndex ? { ...dieu, title: value } : dieu
      );
      return { ...prev, dieuKhoan: newDieuKhoan };
    });
  };

  const handleChangeItem = (dieuIndex, itemIndex, value) => {
    setEditedTemplate((prev) => {
      const newDieuKhoan = prev.dieuKhoan.map((dieu, idx) =>
        idx === dieuIndex
          ? {
              ...dieu,
              items: dieu.items.map((item, i) =>
                i === itemIndex ? value : item
              ),
            }
          : dieu
      );
      return { ...prev, dieuKhoan: newDieuKhoan };
    });
  };

  const handleSave = () => {
    dispatch(updateTemplate(editedTemplate));
    setEditMode(false);
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Mẫu hợp đồng</h2>
        <Button
          onClick={editMode ? handleCancelEdit : () => setEditMode(true)}
          className="cursor-pointer rounded"
        >
          {editMode ? "Hủy chỉnh sửa" : "Chỉnh sửa mẫu"}
        </Button>
      </div>

      {editMode ? (
        <div className="space-y-4">
          {editedTemplate.dieuKhoan.map((dieu, dieuIndex) => (
            <div key={dieuIndex} className="border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <Input
                  value={dieu.title}
                  onChange={(e) =>
                    handleChangeDieuKhoanTitle(dieuIndex, e.target.value)
                  }
                  placeholder="Tiêu đề điều khoản"
                  className="w-1/2 rounded shadow-none"
                />
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveDieuKhoan(dieuIndex)}
                  className="rounded cursor-pointer"
                >
                  Xóa điều khoản
                </Button>
              </div>
              {dieu.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleChangeItem(dieuIndex, itemIndex, e.target.value)
                    }
                    placeholder="Nội dung mục"
                    className="w-full rounded shadow-none"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveItem(dieuIndex, itemIndex)}
                    className="rounded cursor-pointer"
                  >
                    Xóa
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => handleAddItem(dieuIndex)}
                className="rounded cursor-pointer"
              >
                Thêm mục mới
              </Button>
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleAddDieuKhoan}
              className="cursor-pointer rounded"
            >
              Thêm điều khoản mới
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 text-white cursor-pointer rounded"
            >
              Lưu mẫu
            </Button>
          </div>
        </div>
      ) : (
        <ContractView template={template} />
      )}
    </div>
  );
};

export default ContractTemplateTab;
