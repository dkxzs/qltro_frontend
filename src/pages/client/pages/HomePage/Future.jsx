import { Droplet, Headset, House, ShieldCheck, Zap } from "lucide-react";
import { RiCommunityLine } from "react-icons/ri";

const Future = () => {
  return (
    <>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              CÓ GÌ Ở TRO247 ?
            </h2>
            <div className="mt-4 flex justify-center">
              <div className="w-24 h-1 bg-blue-500 relative">
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rotate-45"></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <House className="w-20 h-20 " />
              </div>
              <h3 className="text-xl font-bold mb-3">CĂN HỘ</h3>
              <p className="text-gray-600">
                Phòng sạch sẽ, thoáng mát, có đủ đồ dùng mới.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Zap className="w-20 h-20 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">GIÁ ĐIỆN</h3>
              <p className="text-gray-600">
                Tiền điện tính đúng giá, không lo đắt.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Droplet className="w-20 h-20 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">NƯỚC SINH HOẠT</h3>
              <p className="text-gray-600">
                Nước sạch dùng thoải mái, giá hợp lý.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="w-20 h-20 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">AN NINH</h3>
              <p className="text-gray-600">
                An toàn với camera và khóa vân tay.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <RiCommunityLine className="w-20 h-20 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">VĂN HÓA</h3>
              <p className="text-gray-600">
                Sống vui vẻ, thân thiện cùng hàng xóm.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Headset className="w-20 h-20 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">HỖ TRỢ 24H</h3>
              <p className="text-gray-600">
                Hỗ trợ mọi lúc, giải quyết nhanh chóng.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Future;
