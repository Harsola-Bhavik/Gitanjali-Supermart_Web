import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import StorefrontLayout from './components/StorefrontLayout';
import AdminLayout from './components/AdminLayout';
import NotFound from './pages/NotFound';

import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AboutUsPage from './pages/AboutUsPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ContactUsPage from './pages/ContactUsPage';

import AdminLoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsListPage from './pages/admin/ProductsListPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import OrdersListPage from './pages/admin/OrdersListPage';
import OrderDetailPage from './pages/admin/OrderDetailPage';
import CategoriesPage from './pages/admin/CategoriesPage';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Customer Storefront */}
        <Route path="/" element={<StorefrontLayout />}>
          <Route index element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment/callback" element={<PaymentCallbackPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="terms-and-conditions" element={<TermsPage />} />
          <Route path="refund-policy" element={<RefundPolicyPage />} />
          <Route path="contact-us" element={<ContactUsPage />} />
        </Route>

        {/* Admin Panel */}
        <Route path="/admin">
          <Route path="login" element={<AdminLoginPage />} />
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsListPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="orders" element={<OrdersListPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
