import { Outlet, Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { ShoppingCart } from 'lucide-react';

const StorefrontLayout = () => {
  const items = useCartStore(state => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/">
            <img src="/GEETANJALI FARM FRESH LOGO.svg" alt="Gitanjali" className="h-10 w-auto" />
          </Link>
          <nav>
            <Link to="/checkout" className="relative inline-flex items-center justify-center w-10 h-10 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[11px] font-bold text-white bg-red-600 rounded-full px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/about-us" className="text-gray-500 hover:text-gray-800 transition-colors">About Us</Link>
            <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-800 transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-gray-500 hover:text-gray-800 transition-colors">Terms and Conditions</Link>
            <Link to="/refund-policy" className="text-gray-500 hover:text-gray-800 transition-colors">Refund Policy</Link>
            <Link to="/contact-us" className="text-gray-500 hover:text-gray-800 transition-colors">Contact Us</Link>
          </div>
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Gitanjali Supermart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
