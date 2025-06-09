import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin/ProtectedRouteAdmin";
import DefaultLayout from "./pages/client/pages/DefaultLayout/DefaultLayout";
import LoginPage from "@/pages/admin/pages/LoginPage/LoginPage";
import AboutPage from "@/pages/client/pages/AboutPage/AboutPage";
import ContactPage from "@/pages/client/pages/ContactPage/ContactPage";
import HomePage from "@/pages/client/pages/HomePage/HomePage";
import InvoicePage from "@/pages/client/pages/InvoicePage/InvoicePage";
import RoomDetailPage from "@/pages/client/pages/RoomDetailPage/RoomDetailPage";
import RoomPage from "@/pages/client/pages/RoomPage/RoomPage";
import AdminPage from "./pages/admin/pages/AdminPage/AdminPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { adminRoutes } from "@/routes";
import UserProfilePage from "./pages/client/pages/UserProfilePage/UserProfilePage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<DefaultLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomPage />} />
            <Route path="/room/:id" element={<RoomDetailPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* admin routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRouteAdmin>
                <AdminPage />
              </ProtectedRouteAdmin>
            }
          >
            {adminRoutes.map((route, index) =>
              route.index ? (
                <Route key={index} index element={<route.page />} />
              ) : (
                <Route key={index} path={route.path} element={<route.page />} />
              )
            )}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
