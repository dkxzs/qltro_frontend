import { adminRoutes, publicRoutes } from "@/routes";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
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
          {adminRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={<route.page />} />
          ))}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
