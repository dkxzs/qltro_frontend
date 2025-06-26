import zalo from "@/assets/images/zalo_icon.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllAvailableRoomsService,
  getRoomByRoomIdService,
} from "@/services/roomServices";
import { useQuery } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import RelatedRooms from "./RelatedRooms";
import RoomMap from "./RoomMap";

const RoomDetailPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    data: roomData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoomByRoomIdService(id),
    enabled: !!id,
  });

  const { data: relatedRoomsData, isLoading: relatedLoading } = useQuery({
    queryKey: ["available-rooms"],
    queryFn: getAllAvailableRoomsService,
  });

  const room = roomData?.DT || null;

  const roomDetails = useMemo(
    () => ({
      images: room?.HinhAnh?.map((img) => img.Url) || ["/placeholder.svg"],
      title: room?.TieuDe || "Không có tiêu đề",
      price: room?.LoaiPhong?.DonGia
        ? `${(room.LoaiPhong.DonGia / 1000000).toFixed(1)} triệu/tháng`
        : "Không có giá",
      area: room?.DienTich || 0,
      description: (room?.MoTa || "Không có mô tả").split("-"),
      maxOccupancy: room?.SoLuongNguoiToiDa || 0,
      roomType: room?.LoaiPhong?.TenLoaiPhong || "Không có mô tả",
      roomTypeDesc: room?.LoaiPhong?.MoTa || "Không có mô tả",
      address: room?.Nha?.DiaChi || "Không có địa chỉ",
    }),
    [room]
  );

  const relatedRooms = useMemo(
    () =>
      (relatedRoomsData?.DT || []).map((room) => ({
        roomId: room.MaPT,
        title:
          room.TieuDe ||
          `${room.Nha?.TenNha || "Phòng trọ"} - ${room.Nha?.DiaChi || ""}`,
        image: room.HinhAnh?.[0]?.Url,
        price: room.LoaiPhong?.DonGia
          ? `${(room.LoaiPhong.DonGia / 1000000).toFixed(1)} triệu/tháng`
          : "Không có giá",
        area: `${room.DienTich || 0} m²`,
        roomTypeDesc: room.LoaiPhong?.MoTa || "Không có mô tả",
        maxOccupancy: room.SoLuongNguoiToiDa || 0,
        location: room.Nha?.DiaChi || "Không có địa chỉ",
      })),
    [relatedRoomsData]
  );

  if (isLoading)
    return <div className="max-w-6xl mx-auto py-5">Đang tải...</div>;
  if (error || !room)
    return (
      <div className="max-w-6xl mx-auto py-5">
        Không tìm thấy thông tin phòng.
      </div>
    );

  return (
    <div className="bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto flex justify-between">
        <div></div>
        <nav className="text-sm text-gray-600 mb-4 mt-5">
          <span>Phòng trọ</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{roomDetails.title}</span>
        </nav>
      </div>
      <div className="max-w-6xl mx-auto py-5 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ImageCarousel
              images={roomDetails.images}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {roomDetails.title}
            </h1>
            <p className="text-gray-600 mb-4">{roomDetails.address}</p>
            <div className="flex items-center gap-8 mb-4">
              <div>
                <p className="text-sm text-gray-600">Mức giá</p>
                <p className="text-2xl font-bold text-red-600">
                  {roomDetails.price}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Diện tích</p>
                <p className="text-2xl font-bold">{roomDetails.area} m²</p>
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Thông tin mô tả</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {roomDetails.description.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
              <p className="text-gray-700">
                Số người tối đa: {roomDetails.maxOccupancy} người
              </p>
              <p className="text-gray-700">
                Loại phòng: {roomDetails.roomType} - {roomDetails.roomTypeDesc}
              </p>
            </div>
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Vị trí trên bản đồ</h2>
              <RoomMap
                roomAddress={roomDetails.address}
                title={roomDetails.title}
              />
            </div>
            <RelatedRooms
              relatedRooms={relatedRooms}
              relatedLoading={relatedLoading}
              currentRoomId={id}
            />
          </div>
          <div className="lg:col-span-1">
            <Card className="rounded-sm top-4">
              <CardContent className="p-6">
                <div className="space-y-3 mb-6 flex flex-col">
                  <Link
                    to="tel:0858146687"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-sm flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    0858146687
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 py-5 rounded-sm cursor-pointer"
                    onClick={() =>
                      window.open("https://zalo.me/0858146687", "_blank")
                    }
                  >
                    <img src={zalo} alt="Zalo" className="w-6 h-6 mr-2" />
                    Chat qua Zalo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
