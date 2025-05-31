import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Future from "./Future";
import RoomCard from "./RoomCard";
import Slider from "./Slider";
import { useQuery } from "@tanstack/react-query";
import { getAllAvailableRoomsService } from "@/services/roomServices";
import { useMemo } from "react";

const HomePage = () => {
  const navigate = useNavigate();

  const { data: roomData } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getAllAvailableRoomsService(),
  });

  const roomMap = useMemo(() => {
    const map = new Map();
    roomData?.DT?.forEach((room) => {
      map.set(room.MaPT, room);
    });
    return map;
  }, [roomData]);

  const handleRoomClick = (roomId) => {
    const room = roomMap.get(roomId);
    if (!room) {
      console.error(`Room with MaPT ${roomId} not found in roomMap`);
      return;
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div>
      <section className="relative h-[calc(100vh-16px)] bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 text-white/20 text-xs font-mono transform -rotate-12">
            01001101010101110001010101
          </div>
          <div className="absolute top-20 right-20 text-white/20 text-xs font-mono transform rotate-12">
            11001010101011100010101
          </div>
          <div className="absolute bottom-20 left-20 text-white/20 text-xs font-mono transform rotate-45">
            01010011010101110001010101
          </div>
          <div className="absolute bottom-10 right-10 text-white/20 text-xs font-mono transform -rotate-45">
            11001010101011100010101
          </div>
          <div className="absolute top-32 left-1/4 w-16 h-16 bg-blue-200/20 rounded-lg flex items-center justify-center transform rotate-12 animate-float">
            <Home className="w-8 h-8 text-white" />
          </div>
          <div className="absolute top-48 right-1/4 w-20 h-12 bg-yellow-200/20 rounded flex items-center justify-center transform -rotate-12 animate-float-delayed">
            <div className="w-12 h-8 bg-blue-200/30 rounded"></div>
          </div>
          <div className="absolute bottom-32 left-1/3 w-24 h-16 bg-blue-200/20 rounded-lg flex items-center justify-center transform rotate-6 animate-float">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-3 h-3 bg-yellow-200/50 rounded"></div>
              <div className="w-3 h-3 bg-yellow-200/50 rounded"></div>
              <div className="w-3 h-3 bg-yellow-200/50 rounded"></div>
              <div className="w-3 h-3 bg-yellow-200/50 rounded"></div>
            </div>
          </div>
          <div className="absolute top-40 right-1/3 w-32 h-20 bg-blue-200/30 rounded-full flex items-center justify-center animate-float-delayed">
            <Home className="w-8 h-8 text-white" />
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/2 h-64 bg-blue-200/10 rounded-r-full blur-sm"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-full flex items-center">
          <Slider />
        </div>

        <div className="absolute bottom-8 left-8">
          <div className="flex items-center space-x-2">
            <span className="text-white text-xl font-bold">NHÀ TRỌ 4.0</span>
          </div>
        </div>
      </section>

      <div>
        <Future />
      </div>

      <div>
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                PHÒNG TRỌ TẠI HÀ NỘI
              </h2>
              <div className="mt-4 flex justify-center">
                <div className="w-24 h-1 bg-blue-500 relative">
                  <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rotate-45"></div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roomData?.DT?.slice(0, 4).map((room) => (
                <div onClick={() => handleRoomClick(room.MaPT)} key={room.MaPT}>
                  <RoomCard
                    image={room.HinhAnh?.[0]?.Url || "default-image.jpg"}
                    title={room.TieuDe}
                    roomType={room.LoaiPhong.TenLoaiPhong}
                    area={room.DienTich}
                    roomTypeDesc={room.LoaiPhong.MoTa || "Không có mô tả"}
                    maxOccupancy={room.SoLuongNguoiToiDa}
                    price={`${room.LoaiPhong.DonGia.toLocaleString()}đ/tháng`}
                    location={room.Nha.DiaChi}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xs outline-none cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-200"
                onClick={() => navigate("/rooms")}
              >
                Xem thêm phòng trọ
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
