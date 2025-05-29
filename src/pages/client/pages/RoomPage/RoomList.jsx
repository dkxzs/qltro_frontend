import React from "react";
import RoomCard from "./RoomCard";

const RoomList = ({ rooms }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {rooms.map((room) => (
        <RoomCard
          key={room.MaPT}
          roomId={room.MaPT}
          image={room.HinhAnh?.[0]?.Url || "default-image.jpg"}
          title={room.TieuDe}
          roomType={room.LoaiPhong?.TenLoaiPhong}
          area={room.DienTich}
          roomTypeDesc={room.LoaiPhong?.MoTa || "Không có mô tả"}
          maxOccupancy={room.SoLuongNguoiToiDa}
          price={`${room.LoaiPhong?.DonGia?.toLocaleString() || 0}đ/tháng`}
          location={room.Nha?.DiaChi}
        />
      ))}
    </div>
  );
};

export default RoomList;
