import ModalAddIssueClient from "@/pages/client/pages/HomePage/ModalAddIssueClient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KeyRound, LogOut, Menu, Settings, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { SiGooglecampaignmanager360 } from "react-icons/si";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ModalLogin from "../Login/ModalLogin";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/accountSlice";
import ModalChangePassword from "../Login/ModalChangePassword";

const DefaultLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isOpenIssue, setIsOpenIssue] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const originalStyle = {
      overflow: document.body.style.overflow,
      marginRight: document.body.style.marginRight,
    };

    const preventScrollLock = () => {
      document.body.style.overflow = originalStyle.overflow || "";
      document.body.style.marginRight = "0px";
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "style" ||
          mutation.attributeName === "data-scroll-locked"
        ) {
          preventScrollLock();
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    return () => {
      observer.disconnect();
      preventScrollLock();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          /* Ghi đè scroll lock và margin-right của Radix UI */
          body[data-scroll-locked="1"] {
            overflow: auto !important;
            margin-right: 0 !important;
          }
          /* Các style khác giữ nguyên */
          .nav-link {
            position: relative;
            transition: color 0.3s ease;
          }
          .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -2px;
            left: 0;
            background-color: #FBBF24;
            transition: width 0.3s ease;
          }
          .nav-link:hover::after,
          .nav-link.active::after {
            width: 100%;
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float 6s ease-in-out infinite 2s;
          }
        `}
      </style>
      <header className="bg-white shadow-sm h-16 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <SiGooglecampaignmanager360 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 fontFamily">
                Tro247
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`nav-link font-medium ${
                  isActive("/")
                    ? "text-blue-500 active"
                    : "text-gray-700 hover:text-yellow-400"
                }`}
              >
                Trang chủ
              </Link>
              <Link
                to="/rooms"
                className={`nav-link font-medium ${
                  isActive("/rooms")
                    ? "text-blue-500 active"
                    : "text-gray-700 hover:text-yellow-400"
                }`}
              >
                Phòng trọ
              </Link>
              <Link
                to="/about"
                className={`nav-link font-medium ${
                  isActive("/about")
                    ? "text-blue-500 active"
                    : "text-gray-700 hover:text-yellow-400"
                }`}
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                className={`nav-link font-medium ${
                  isActive("/contact")
                    ? "text-blue-500 active"
                    : "text-gray-700 hover:text-yellow-400"
                }`}
              >
                Liên hệ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none rounded-full cursor-pointer">
                    <Avatar>
                      <AvatarFallback>
                        <User className="w-6 h-6 text-gray-500" />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="h-4 w-4" /> Thống tin cá nhân
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/invoice")}
                    >
                      <LiaFileInvoiceDollarSolid className="h-4 w-4" /> Hoá đơn
                      phòng
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setIsOpenIssue(true)}
                    >
                      <Settings className="h-4 w-4" /> Báo cáo sự cố
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setIsChangePasswordOpen(true)}
                    >
                      <KeyRound className="h-4 w-4" /> Đổi mật khẩu
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <ModalLogin />
              )}
            </div>
            <button
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
          {isMobileMenuOpen && (
            <nav className="md:hidden bg-white px-4 py-4 shadow-sm">
              <a href="/" className="block py-2 text-blue-500 font-medium">
                Trang chủ
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-yellow-400"
              >
                Tìm phòng
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-yellow-400"
              >
                Phòng trọ
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-yellow-400"
              >
                Giới thiệu
              </a>
              <a
                href="#"
                className="block py-2 text-gray-700 hover:text-yellow-400"
              >
                Liên hệ
              </a>
            </nav>
          )}
        </div>
      </header>

      <Outlet />

      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left Column - About Us */}
            <div>
              <h3 className="text-xl font-bold mb-4">TRO247</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Tro247 giúp bạn tìm và quản lý phòng trọ dễ dàng, nhanh chóng
                với công nghệ hiện đại.
              </p>
              <h4 className="text-lg font-semibold mb-2">
                HỆ THỐNG QUẢN LÝ NHÀ TRỌ 4.0
              </h4>
              <p className="text-gray-400 text-sm italic">
                Dự án hỗ trợ người thuê và chủ trọ tại Hà Nội.
              </p>
            </div>

            {/* Right Column - Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">LIÊN KẾT</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    Cách tìm phòng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    Hướng dẫn thanh toán
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                  >
                    Hỏi đáp thường gặp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-600 pt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <h4 className="font-semibold mb-2">Địa chỉ:</h4>
                <p className="text-gray-300 text-sm">
                  Ov3.33 Khu đô thị Xuân Phương,
                  <br />
                  Nam Từ Liêm, Hà Nội.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Email:</h4>
                <a
                  href="mailto:tro247.support@gmail.com"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                >
                  hanguyen2505003@gmail.com
                </a>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Số điện thoại:</h4>
                <a
                  href="tel:+84838993838"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm"
                >
                  (+84) 0858146687
                </a>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Mạng xã hội:</h4>
                <div className="flex space-x-2">
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-600 hover:bg-blue-600 rounded flex items-center justify-center transition-colors"
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
                    className="w-8 h-8 bg-gray-600 hover:bg-red-600 rounded flex items-center justify-center transition-colors"
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

            <div className="border-t border-gray-600 pt-3 text-center">
              <p className="text-gray-400 text-sm">© 2025 Tro247</p>
            </div>
          </div>
        </div>
      </footer>
      <ModalAddIssueClient open={isOpenIssue} onOpenChange={setIsOpenIssue} />
      <ModalChangePassword
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </div>
  );
};

export default DefaultLayout;
