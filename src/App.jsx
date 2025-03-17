import { adminRoutes, publicRoutes } from "@/routes";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AdminPage from "./pages/admin/pages/AdminPage/AdminPage";
function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* public routes */}
          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={<route.page />} />
          ))}

          {/* admin routes */}
          <Route path="/admin" element={<AdminPage />}>
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
    </>
  );
}

export default App;
