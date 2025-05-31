import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Home, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Slider = () => {
  const [emblaApi, setEmblaApi] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <>
      <Carousel className="w-full" setApi={setEmblaApi}>
        <CarouselContent>
          <CarouselItem>
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="hidden lg:block w-full lg:w-1/2 relative h-80">
                <div className="absolute top-0 left-0 w-24 h-16 bg-blue-200/20 rounded-lg backdrop-blur-sm flex items-center justify-center transform rotate-12 animate-float">
                  <span className="text-white text-xs font-bold">Tro247</span>
                </div>
                <div className="absolute top-20 right-0 w-20 h-24 bg-yellow-200/20 rounded-lg backdrop-blur-sm flex flex-col items-center justify-center transform -rotate-6 animate-float-delayed">
                  <Home className="w-6 h-6 text-white mb-1" />
                  <div className="w-8 h-1 bg-blue-200/50 rounded mb-1"></div>
                  <div className="w-6 h-1 bg-blue-200/50 rounded"></div>
                </div>
                <div className="absolute bottom-0 left-1/4 w-32 h-20 bg-blue-200/20 rounded-lg backdrop-blur-sm flex items-center justify-center transform rotate-3 animate-float">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-yellow-200/30 rounded mx-auto mb-2"></div>
                    <div className="text-white text-xs">TRACKING SYSTEM</div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 lg:pl-8">
                <div className="bg-white rounded-lg p-6 shadow-xl">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    ĐƠN VỊ
                  </h1>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
                    VẬN HÀNH NHÀ TRỌ 4.0
                  </h2>
                  <p className="text-gray-600 text-base mb-8 leading-relaxed">
                    Quản lý nhà trọ dễ dàng với công nghệ 4.0
                  </p>
                  <Button
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-base font-semibold border-2 border-yellow-400 hover:border-yellow-500 hover:scale-105 hover:shadow-md transition-all duration-200"
                  >
                    TRO247
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="hidden lg:block w-full lg:w-1/2 relative h-80">
                <div className="absolute top-0 right-0 w-24 h-16 bg-blue-200/20 rounded-lg backdrop-blur-sm flex items-center justify-center transform -rotate-12 animate-float">
                  <span className="text-white text-xs font-bold">Tro247</span>
                </div>
                <div className="absolute top-20 left-0 w-20 h-24 bg-yellow-200/20 rounded-lg backdrop-blur-sm flex flex-col items-center justify-center transform rotate-6 animate-float-delayed">
                  <Search className="w-6 h-6 text-white mb-1" />
                  <div className="w-8 h-1 bg-blue-200/50 rounded mb-1"></div>
                  <div className="w-6 h-1 bg-blue-200/50 rounded"></div>
                </div>
                <div className="absolute bottom-0 right-1/4 w-32 h-20 bg-blue-200/20 rounded-lg backdrop-blur-sm flex items-center justify-center transform -rotate-3 animate-float">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-yellow-200/30 rounded mx-auto mb-2"></div>
                    <div className="text-white text-xs">FIND YOUR ROOM</div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 lg:pl-8">
                <div className="bg-white rounded-lg p-6 shadow-xl">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    TÌM PHÒNG NHANH
                  </h1>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
                    Phù hợp túi tiền
                  </h2>
                  <p className="text-gray-600 text-base mb-8 leading-relaxed">
                    Tìm phòng ưng ý chỉ trong vài giây
                  </p>
                  <Button
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-base font-semibold border-2 border-yellow-400 hover:border-yellow-500 hover:scale-105 hover:shadow-md transition-all duration-200"
                    onClick={() => navigate("/rooms")}
                  >
                    Tìm ngay
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default Slider;
