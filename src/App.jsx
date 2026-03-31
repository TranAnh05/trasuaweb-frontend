import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ProductDetail from "./pages/ProductDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import MyOrders from "./pages/MyOrders";
import ProfileLayout from "./components/layouts/ProfileLayout";
import OrderTracking from "./pages/OrderTracking";

// Component Layout dùng chung cho các trang có Header/Footer
const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
        </div>
    );
};

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />

                    {/* Các Route sử dụng Layout chung */}
                    <Route
                        path="/"
                        element={
                            <MainLayout>
                                <Home />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/menu"
                        element={
                            <MainLayout>
                                <Menu />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/product/:slug"
                        element={
                            <MainLayout>
                                <ProductDetail />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/cart"
                        element={
                            <MainLayout>
                                <Cart />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/checkout"
                        element={
                            <MainLayout>
                                <Checkout />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/success"
                        element={
                            <MainLayout>
                                <Success />
                            </MainLayout>
                        }
                    />

                    <Route
                        path="/track-order"
                        element={
                            <MainLayout>
                                <OrderTracking />
                            </MainLayout>
                        }
                    />

                    {/* KHỐI NESTED ROUTES: Quản lý tài khoản */}
                    {/* Bọc ProfileLayout bên trong MainLayout để vẫn giữ được Navbar và Footer */}
                    <Route
                        path="/account"
                        element={
                            <MainLayout>
                                <ProfileLayout />
                            </MainLayout>
                        }
                    >
                        {/* URL: /account -> Tự động chuyển hướng sang /account/profile */}
                        <Route
                            index
                            element={<Navigate to="profile" replace />}
                        />

                        {/* URL: /account/profile -> Sẽ render Profile vào vị trí Outlet */}
                        <Route
                            path="profile"
                            element={
                                <div>Trang hồ sơ cá nhân (Đang phát triển)</div>
                            }
                        />

                        {/* URL: /account/orders -> Sẽ render MyOrders vào vị trí Outlet */}
                        <Route path="orders" element={<MyOrders />} />
                    </Route>
                </Routes>
            </Router>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default App;
