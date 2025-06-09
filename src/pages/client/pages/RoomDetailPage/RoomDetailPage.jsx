import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, MessageCircle, Phone } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRoomByRoomIdService,
  getAllAvailableRoomsService,
} from "@/services/roomServices";
import zalo from "@/assets/images/zalo_icon.png";
import { useQuery } from "@tanstack/react-query";

// Component RoomCard
const RoomCard = ({
  roomId,
  image,
  title,
  area,
  roomTypeDesc,
  maxOccupancy,
  price,
  location,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div
      className="bg-white rounded shadow-md overflow-hidden hover:shadow-lg transition-shadow h-[420px] cursor-pointer flex-shrink-0 w-72"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 py-1 text-truncate">
          {title}
        </h3>
        <div className="mb-2 text-gray-600 text-sm">{roomTypeDesc}</div>
        <div className="text-sm text-gray-600 mb-2">
          {area && maxOccupancy
            ? `${area} | ${maxOccupancy} người tối đa`
            : "Thông tin không có sẵn"}
        </div>
        <div className="text-lg font-bold text-blue-500 mb-2">{price}</div>
        <div className="text-sm text-gray-500">{location}</div>
      </div>
    </div>
  );
};

const RoomDetailPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [roomLocation, setRoomLocation] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);

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
    enabled: true,
  });

  const room = roomData?.DT || null;

  // Dữ liệu động từ API
  const images = room?.HinhAnh?.map((img) => img.Url) || ["/placeholder.svg"];
  const thumbnails = images;
  const roomAddress = room?.Nha?.DiaChi || "Không có địa chỉ";
  const title = room?.TieuDe || "Không có tiêu đề";
  const price = room?.LoaiPhong?.DonGia
    ? `${(room.LoaiPhong.DonGia / 1000000).toFixed(1)} triệu/tháng`
    : "Không có giá";
  const area = room?.DienTich || 0;
  const description = room?.MoTa || "Không có mô tả";
  const maxOccupancy = room?.SoLuongNguoiToiDa || 0;
  const roomType = room?.LoaiPhong?.TenLoaiPhong || "Không có mô tả";
  const roomTypeDesc = room?.LoaiPhong?.MoTa || "Không có mô tả";

  const desc = description.split("-");

  // Ánh xạ dữ liệu phòng trọ còn trống thành cấu trúc cần thiết
  const relatedRooms = (relatedRoomsData?.DT || []).map((room) => ({
    roomId: room.MaPT,
    title:
      room.TieuDe ||
      `${room.Nha?.TenNha || "Phòng trọ"} - ${room.Nha?.DiaChi || ""}`,
    image: room.HinhAnh?.[0]?.Url || "https://via.placeholder.com/300x200",
    price: room.LoaiPhong?.DonGia
      ? `${(room.LoaiPhong.DonGia / 1000000).toFixed(1)} triệu/tháng`
      : "Không có giá",
    area: `${room.DienTich || 0} m²`,
    roomTypeDesc: room.LoaiPhong?.MoTa || "Không có mô tả",
    maxOccupancy: room.SoLuongNguoiToiDa || 0,
    location: room.Nha?.DiaChi || "Không có địa chỉ",
  }));

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [105.8048, 21.0285],
      zoom: 15,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        roomAddress
      )}.json?access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setRoomLocation([lng, lat]);
          map.current.setCenter([lng, lat]);
          new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(
              new mapboxgl.Popup({ maxWidth: "200px" }).setHTML(
                `<h3 style='font-size: 14px; margin: 0;'>${title}</h3>`
              )
            )
            .addTo(map.current);
        } else {
          console.error(`Geocode failed for ${roomAddress}`);
        }
      })
      .catch((error) => {
        console.error("Error with Mapbox Geocoding API:", error);
      });

    return () => map.current.remove();
  }, [roomAddress, title]);

  if (isLoading) {
    return <div className="max-w-6xl mx-auto py-5">Đang tải...</div>;
  }

  if (error || !room) {
    return (
      <div className="max-w-6xl mx-auto py-5">
        Không tìm thấy thông tin phòng.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto flex justify-between">
        <div></div>
        <nav className="text-sm text-gray-600 mb-4 mt-5">
          <span>Phòng trọ</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{title}</span>
        </nav>
      </div>
      <div className="max-w-6xl mx-auto py-5 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Carousel */}
            <div className="relative mb-4">
              <Badge className="absolute top-4 left-4 z-10 bg-yellow-600 hover:bg-yellow-700">
                Phòng trọ
              </Badge>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt="Property image"
                  className="object-cover w-full h-full"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-6 gap-2 mb-6">
              {thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  className="aspect-video rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={thumb || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
            {/* Property Address */}
            <p className="text-gray-600 mb-4">{roomAddress}</p>

            {/* Price and Area Info */}
            <div className="flex items-center gap-8 mb-4">
              <div>
                <p className="text-sm text-gray-600">Mức giá</p>
                <p className="text-2xl font-bold text-red-600">{price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Diện tích</p>
                <p className="text-2xl font-bold">{area} m²</p>
              </div>
            </div>

            {/* Property Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Thông tin mô tả</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {desc.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
              <p className="text-gray-700">
                Số người tối đa: {maxOccupancy} người
              </p>
              <p className="text-gray-700">
                Loại phòng: {roomType} - {roomTypeDesc}
              </p>
            </div>

            {/* Mapbox Map */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Vị trí trên bản đồ</h2>
              <div
                ref={mapContainer}
                className="relative overflow-hidden"
                style={{
                  width: "100%",
                  height: "300px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              {roomLocation ? (
                <p className="text-gray-600 mt-2">
                  Tọa độ: {roomLocation[1].toFixed(6)},{" "}
                  {roomLocation[0].toFixed(6)}
                </p>
              ) : (
                <p className="text-gray-600 mt-2">Đang tải bản đồ...</p>
              )}
            </div>

            {/* Danh sách phòng trọ liên quan */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Các phòng trọ khác</h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 min-w-max">
                {relatedLoading ? (
                  <div className="flex justify-center items-center w-full">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : relatedRooms.length > 0 ? (
                  relatedRooms
                    .filter((room) => room.roomId !== id) // Loại bỏ phòng hiện tại khỏi danh sách liên quan
                    .map((relatedRoom) => (
                      <RoomCard
                        key={relatedRoom.roomId}
                        roomId={relatedRoom.roomId}
                        image={relatedRoom.image}
                        title={relatedRoom.title}
                        area={relatedRoom.area}
                        roomTypeDesc={relatedRoom.roomTypeDesc}
                        maxOccupancy={relatedRoom.maxOccupancy}
                        price={relatedRoom.price}
                        location={relatedRoom.location}
                      />
                    ))
                ) : (
                  <p className="text-gray-600 italic">
                    Không có phòng trọ nào khác.
                  </p>
                )}
              </div>
            </div>

            <style>
              {`
                /* Ẩn scrollbar trên các trình duyệt Webkit (Chrome, Edge, Safari) */
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                /* Ẩn scrollbar trên Firefox */
                .hide-scrollbar {
                  scrollbar-width: none;
                }
                /* Đảm bảo vẫn có thể cuộn */
                .hide-scrollbar {
                  -ms-overflow-style: none; /* IE và Edge */
                }
              `}
            </style>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="rounded-lg">
              {" "}
              {/* Bỏ sticky top-4 */}
              <CardContent className="p-6">
                <div className="space-y-3 mb-6 flex flex-col">
                  <a
                    href="tel:0858146687"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    0858146687
                  </a>
                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 py-5 rounded cursor-pointer"
                    onClick={() => {
                      window.open("https://zalo.me/0858146687", "_blank");
                    }}
                  >
                    <img src={zalo} alt="" className="w-6 h-6 mr-2" />
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
