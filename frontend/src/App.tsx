import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./Pages/Home";
import "@fontsource/karma/600.css";
import "@fontsource-variable/outfit";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import { AuthContext } from "./context/AuthContext";
import { useState } from "react";
import AuthPrivate from "./utils/AuthPrivate";
import ForgotPassword from "./Pages/ForgotPassword";
import Footer from "./components/Footer";
import { UserInfo } from "./utils/Types";
import ContactUs from "./Pages/ContactUs";
import BeautyHome from "./Pages/BeautySection/BeautyHome";
import Beauty from "./Pages/BeautySection/Beauty";
import Skincare from "./Pages/BeautySection/Skincare";
import WishBag from "./Pages/WishBag";
function App() {
  const [user, setUserT] = useState<UserInfo>({
    userId: false,
    success: false,
    message: "",
    avatarUrl: "",
    name: "",
  });
  return (
    <div
      style={{
        display: "grid",
        minHeight: "100vh",
        gridTemplateRows: "auto auto 1fr auto",
        position: "relative",
      }}
    >
      <AuthContext.Provider value={{ user, setUserT }}>
        <NavBar />
        <Routes>
          {/* Add your routes here */}
          {/* Example: <Route exact path="/" element={<Home />} /> */}
          <Route path="/" element={<Home />} />
          <Route
            path="/auth/signup"
            element={
              <AuthPrivate>
                <SignUp />
              </AuthPrivate>
            }
          />
          <Route
            path="/auth/login"
            element={
              <AuthPrivate>
                <Login />
              </AuthPrivate>
            }
          />
          <Route
            path="/auth/forgotPassword"
            element={
              <AuthPrivate>
                <ForgotPassword />
              </AuthPrivate>
            }
          />
          <Route path="/wishbag" element={<WishBag />} />
          <Route path="/beauty&skincare" element={<BeautyHome />} />
          <Route path="/beauty&skincare/beauty/:product" element={<Beauty />} />
          <Route
            path="/beauty&skincare/skincare/:product"
            element={<Skincare />}
          />
          <Route path="/help">
            <Route index element={<Navigate to={"/"} />} />
            <Route path="contactUs" element={<ContactUs />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route></Route>
        </Routes>
      </AuthContext.Provider>
      <Footer />
    </div>
  );
}

export default App;
