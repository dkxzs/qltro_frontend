import zalo from "@/assets/images/zalo_icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import emailjs from "@emailjs/browser";
import { Send } from "lucide-react";
import { toast } from "react-toastify";

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    emailjs
      .sendForm(
        "service_yyffzn8",
        "template_5iyrr9t",
        form,
        "9yvVTs48j2SpacNta"
      )
      .then(
        () => {
          toast.success("Tin nhắn của bạn đã được gửi thành công!");
          form.reset();
        },
        (error) => {
          toast.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!");
          console.error("EmailJS error:", error);
        }
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-16">
      {/* Thông tin liên hệ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Liên hệ với chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Email */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email
              </h3>
              <p className="text-gray-700 mt-5">
                <a
                  href="mailto:hanguyen2505003@gmail.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  hanguyen2505003@gmail.com
                </a>
              </p>
            </div>
            {/* Số điện thoại */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Số điện thoại
              </h3>
              <p className="text-gray-700 mt-5">
                <a
                  href="tel:+84858146687"
                  className="text-blue-600 hover:text-blue-800"
                >
                  (+84) 0858146687
                </a>
              </p>
            </div>
            {/* Zalo */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zalo</h3>
              <p className="text-gray-700 mt-3 flex items-center justify-center">
                <a
                  href="https://zalo.me/0858146687"
                  className="rounded border-2 border-blue-500 px-4 py-2 flex items-center gap-2 text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={zalo} alt="" className="w-6 h-6 mr-2" />
                  Liên hệ Zalo
                </a>
              </p>
            </div>
            {/* Địa chỉ */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Địa chỉ
              </h3>
              <p className="text-gray-700">
                58A Trung Kính, Trung Hòa, <br />
                Cầu Giấy, Hà Nội
              </p>
            </div>
            {/* Mạng xã hội */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mạng xã hội
              </h3>
              <div className="flex justify-center space-x-2">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 hover:text-blue-600 rounded flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-100 hover:text-red-600 rounded flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form liên hệ */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Gửi tin nhắn cho chúng tôi
          </h2>
          <div className="max-w-xl mx-auto">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="text-gray-900">
                  Tên của bạn
                </Label>
                <Input
                  id="name"
                  name="from_name" // Tên trường cho EmailJS
                  type="text"
                  placeholder="Nhập tên của bạn"
                  className="w-full rounded mt-2 shadow-none"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  name="from_email" // Tên trường cho EmailJS
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full rounded mt-2 shadow-none"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-gray-900">
                  Nội dung tin nhắn
                </Label>
                <Textarea
                  id="message"
                  name="message" // Tên trường cho EmailJS
                  placeholder="Nhập nội dung tin nhắn"
                  className="w-full rounded mt-2 min-h-[120px] shadow-none"
                  required
                />
              </div>
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer py-2 text-lg"
                >
                  <Send className="size-4 mr-2" />
                  Gửi
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
