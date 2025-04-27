import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  template: {
    header: {
      title: "HỢP ĐỒNG CHO THUÊ PHÒNG TRỌ",
      contractInfo: "Số: HD[SoHD]  Ngày ký: [NgayKy]",
      legalBasis: [
        "- Căn cứ Bộ luật dân sự của nước Cộng hoà xã hội chủ nghĩa Việt nam có hiệu lực từ ngày 01/01/2006;",
        "- Căn cứ nhu cầu và khả năng của hai bên,",
        "- Hôm nay, ngày [ngay] tháng [thang] năm [nam] tại địa chỉ [DiaChiPT], chúng tôi gồm có",
      ],
      preamble: [
        "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM",
        "Độc Lập-Tự Do-Hạnh Phúc",
        "---oOo---",
      ],
    },
    benA: {
      title: "BÊN A : BÊN CHO THUÊ PHÒNG TRỌ",
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
      title: "BÊN B : BÊN THUÊ PHÒNG TRỌ",
      details: [
        "Họ và Tên: [HoTen]",
        "Năm sinh: [NgaySinh]",
        "CCCD số: [CCCD]",
        "Ngày cấp: [NgayCap]",
        "Nơi cấp: [NoiCap]",
        "DiaChi: [DiaChi]",
        "Số điện thoại: [DienThoai]",
      ],
    },
    thoaThuan: "Hai bên cùng thỏa thuận và đồng ý với nội dung sau :",
    dieuKhoan: [
      {
        title: "Điều 1:",
        items: [
          "Bên A đồng ý cho bên B thuê một phòng trọ [TenPhong], [TenNha] thuộc địa chỉ: [DiaChi]",
          "Thời hạn thuê phòng trọ là [ThoiHanThue] tháng kể từ ngày [NgayBatDau]",
        ],
      },
      {
        title: "Điều 2:",
        items: [
          "Giá tiền thuê phòng trọ là [DonGia]/tháng (Bằng chữ: [DonGiaChu])",
          "Tiền thuê phòng trọ bên B thanh toán cho bên A từ ngày 05 hàng tháng.",
          "Bên B đặt tiền thế chân trước [DatCoc] đồng (Bằng chữ: [DatCocChu]) cho bên A. Tiền thế chân sẽ được trả lại đầy đủ cho bên thuê (Bên B) khi hết hợp đồng thuê phòng trọ và thanh toán đầy đủ tiền điện, nước, phí dịch vụ và các khoản khác liên quan.",
          "Bên B ngưng hợp đồng trước thời hạn thì phải chịu mất tiền thế chân.",
          "Bên A ngưng hợp đồng (lấy lại phòng trọ) trước thời hạn thì bồi thường gấp đôi số tiền bên B đã thế chân.",
        ],
      },
      {
        title: "Điều 3: Trách nhiệm bên A.",
        items: [
          "Giao phòng trọ, trang thiết bị trong phòng trọ cho bên B đúng ngày ký hợp đồng.",
          "Hướng dẫn bên B chấp hành đúng các quy định của địa phương, hoàn tất mọi thủ tục giấy tờ đăng ký tạm trú cho bên B.",
        ],
      },
      {
        title: "Điều 4: Trách nhiệm bên B.",
        items: [
          "Trả tiền thuê phòng trọ hàng tháng theo hợp đồng.",
          "Sử dụng đúng mục đích thuê nhà, khi cần sửa chữa, cải tạo theo yêu cầu sử dụng riêng phải được sự đồng ý của bên A.",
          "Đồ đạt trang thiết bị trong phòng trọ phải có trách nhiệm bảo quản cẩn thận không làm hư hỏng mất mát.",
        ],
      },
      {
        title: "Điều 5: Điều khoản chung.",
        items: [
          "Bên A và bên B thực hiện đúng các điều khoản ghi trong hợp đồng.",
          "Trường hợp có tranh chấp hoặc một bên vi phạm hợp đồng thì hai bên cùng nhau bàn bạc giải quyết, nếu không giải quyết được thì yêu cầu cơ quan có thẩm quyền giải quyết.",
          "Hợp đồng được lập thành 02 bản có giá trị ngang nhau, mỗi bên giữ 01 bản",
        ],
      },
    ],
    footer: {
      location: "Tp. Hà Nội",
      date: "[CurrentDate]",
      signatures: [
        {
          party: "BÊN A",
          note: "(Ký và ghi rõ họ tên)",
        },
        {
          party: "BÊN B",
          note: "(Ký và ghi rõ họ tên)",
        },
      ],
    },
  },
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    updateTemplate(state, action) {
      state.template = action.payload;
    },
  },
});

export const { updateTemplate } = contractSlice.actions;
export default contractSlice.reducer;
