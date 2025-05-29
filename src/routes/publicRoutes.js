import LoginPage from "@/pages/admin/pages/LoginPage/LoginPage";
import AboutPage from "@/pages/client/pages/AboutPage/AboutPage";
import ContactPage from "@/pages/client/pages/ContactPage/ContactPage";
import HomePage from "@/pages/client/pages/HomePage/HomePage";
import InvoicePage from "@/pages/client/pages/InvoicePage/InvoicePage";
import RoomDetailPage from "@/pages/client/pages/RoomDetailPage/RoomDetailPage";
import RoomPage from "@/pages/client/pages/RoomPage/RoomPage";

export const publicRoutes = [
  {
    path: "/admin/login",
    page: LoginPage,
  },
  {
    path: "/",
    page: HomePage,
  },
  {
    path: "/rooms",
    page: RoomPage,
  },
  {
    path: "/rooms/room-detail",
    page: RoomDetailPage,
  },
  {
    path: "/invoice",
    page: InvoicePage,
  },
  {
    path: "/about",
    page: AboutPage,
  },
  {
    path: "/contact",
    page: ContactPage,
  },
];
