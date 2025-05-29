import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Giới thiệu Tro247</h1>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto">
            Tro247 là nền tảng quản lý và tìm kiếm phòng trọ hiện đại, giúp kết
            nối người thuê và chủ trọ một cách dễ dàng, nhanh chóng tại Hà Nội.
          </p>
        </div>
      </section>

      {/* Sứ mệnh và Mục tiêu */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sứ mệnh */}
            <Card className="shadow-none rounded-lg border">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  Sứ mệnh của chúng tôi
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Tro247 ra đời với sứ mệnh giúp người thuê trọ tìm được nơi ở
                  lý tưởng, đồng thời hỗ trợ chủ trọ quản lý hiệu quả với công
                  nghệ 4.0. Chúng tôi hướng tới việc xây dựng một cộng đồng thuê
                  trọ minh bạch, an toàn và tiện lợi.
                </p>
              </CardContent>
            </Card>

            {/* Mục tiêu */}
            <Card className="shadow-none rounded-lg border">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  Mục tiêu của chúng tôi
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi đặt mục tiêu trở thành nền tảng hàng đầu tại Hà Nội
                  trong việc tìm kiếm và quản lý phòng trọ. Tro247 cam kết mang
                  lại trải nghiệm tốt nhất cho cả người thuê và chủ trọ thông
                  qua công nghệ hiện đại và dịch vụ tận tâm.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Đội ngũ */}
      {/* <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Đội ngũ của chúng tôi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-none rounded-lg border text-center">
              <CardContent className="p-6">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarFallback className="bg-blue-500 text-white">
                    NV
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">
                  Nguyễn Văn A
                </h3>
                <p className="text-gray-600">Nhà sáng lập</p>
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-lg border text-center">
              <CardContent className="p-6">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarFallback className="bg-yellow-500 text-white">
                    HT
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">
                  Hoàng Thị B
                </h3>
                <p className="text-gray-600">Trưởng nhóm kỹ thuật</p>
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-lg border text-center">
              <CardContent className="p-6">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarFallback className="bg-blue-500 text-white">
                    LC
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">
                  Lê Văn C
                </h3>
                <p className="text-gray-600">Chuyên viên hỗ trợ</p>
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-lg border text-center">
              <CardContent className="p-6">
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarFallback className="bg-yellow-500 text-white">
                    PD
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">
                  Phạm Thị D
                </h3>
                <p className="text-gray-600">Chuyên viên marketing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Liên hệ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Liên hệ với chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Địa chỉ
              </h3>
              <p className="text-gray-700">
                58A Trung Kính, Trung Hòa, <br />
                Cầu Giấy, Hà Nội
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email
              </h3>
              <p className="text-gray-700">
                <a
                  href="mailto:hanguyen2505003@gmail.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  hanguyen2505003@gmail.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Số điện thoại
              </h3>
              <p className="text-gray-700">
                <a
                  href="tel:+84858146687"
                  className="text-blue-600 hover:text-blue-800"
                >
                  (+84) 0858146687
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
