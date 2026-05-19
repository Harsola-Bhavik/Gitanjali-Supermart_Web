import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

const DELIVERY_CHARGE = 40;

const schema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  customer_phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
  customer_email: z.string().email('Enter a valid email address'),
  customer_address: z.string().min(10, 'Please enter a full address'),
  notes: z.string().optional(),
});

function PaymentModal({ total, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-bold mb-1">Choose Payment Method</h3>
        <p className="text-sm text-gray-500 mb-5">Total payable: <span className="font-bold text-primary-600">₹{total.toFixed(2)}</span> (incl. ₹{DELIVERY_CHARGE} delivery)</p>
        <div className="space-y-3">
          <button
            onClick={() => onSelect('cod')}
            className="w-full border-2 border-gray-200 hover:border-primary-500 rounded-xl p-4 text-left transition-colors"
          >
            <p className="font-semibold text-gray-800">💵 Cash on Delivery</p>
            <p className="text-xs text-gray-500 mt-1">Pay ₹{total.toFixed(2)} when your order arrives</p>
          </button>
          <button
            onClick={() => onSelect('upi')}
            className="w-full border-2 border-gray-200 hover:border-primary-500 rounded-xl p-4 text-left transition-colors"
          >
            <p className="font-semibold text-gray-800">📱 UPI / Card (Zaakpay)</p>
            <p className="text-xs text-gray-500 mt-1">Pay securely online via UPI, Credit/Debit Card</p>
          </button>
        </div>
        <button onClick={onClose} className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600">Cancel</button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart, getCartTotal } = useCartStore();
  const navigate = useNavigate();
  const [pickupFromStore, setPickupFromStore] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const itemsTotal = getCartTotal();
  const deliveryCharge = pickupFromStore ? 0 : DELIVERY_CHARGE;
  const grandTotal = itemsTotal + deliveryCharge;

  const submitOrder = async (formData, paymentMethod) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/api/orders', {
        ...formData,
        items,
        pickup_from_store: pickupFromStore,
        payment_method: paymentMethod,
      });

      const { requiresPayment, payOrderUrl } = res.data;

      if (requiresPayment && payOrderUrl) {
        clearCart();
        setIsRedirecting(true);
        // Navigate browser directly to backend pay endpoint
        // which returns an HTML auto-submit form to Zaakpay
        const backendBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        window.location.href = `${backendBase}${payOrderUrl}`;
        return;
      }

      clearCart();
      toast.success(pickupFromStore
        ? 'Order placed! Invoice sent to your email. See you at the store!'
        : 'Order placed! Invoice sent to your email.');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const onSubmit = (formData) => {
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    if (pickupFromStore) {
      submitOrder(formData, 'pickup');
      return;
    }

    // Show payment method modal for delivery orders
    setPendingFormData(formData);
    setShowPaymentModal(true);
  };

  const handlePaymentSelect = (method) => {
    setShowPaymentModal(false);
    submitOrder(pendingFormData, method);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-500">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <>
      {showPaymentModal && (
        <PaymentModal
          total={grandTotal}
          onSelect={handlePaymentSelect}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Summary */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product_id} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🛒</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-primary-600 font-bold text-sm">₹{Number(item.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => item.quantity > 1 ? updateQuantity(item.product_id, item.quantity - 1) : removeItem(item.product_id)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 font-bold">−</button>
                  <span className="w-5 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 font-bold">+</button>
                </div>
                <button onClick={() => removeItem(item.product_id)} className="text-red-400 hover:text-red-600 ml-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Items Subtotal</span>
              <span>₹{itemsTotal.toFixed(2)}</span>
            </div>
            {!pickupFromStore && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-orange-600">₹{DELIVERY_CHARGE}.00</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span className="text-primary-600">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div>
          <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input {...register('customer_name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Your name" />
              {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input {...register('customer_phone')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="10-digit mobile number" />
              {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input {...register('customer_email')} type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="your@email.com" />
              {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Address</label>
              <textarea {...register('customer_address')} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="House no, street, area, city..." />
              {errors.customer_address && <p className="text-red-500 text-xs mt-1">{errors.customer_address.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes (optional)</label>
              <input {...register('notes')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Any special instructions..." />
            </div>

            {/* Store Pickup Section */}
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-bold text-amber-800">
                📌 If you want to pick your order from store then select below option
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pickupFromStore}
                  onChange={(e) => setPickupFromStore(e.target.checked)}
                  className="w-4 h-4 accent-primary-600 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Pickup from the store</span>
              </label>
              {pickupFromStore && (
                <p className="text-xs text-green-700 font-medium">✅ No delivery charge — you save ₹{DELIVERY_CHARGE}!</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isRedirecting}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-500 disabled:opacity-60 transition-colors"
            >
              {isRedirecting
                ? 'Redirecting to payment...'
                : isSubmitting
                  ? 'Placing Order...'
                  : pickupFromStore
                    ? `Place Order • ₹${grandTotal.toFixed(2)}`
                    : `Place Order • ₹${grandTotal.toFixed(2)} (incl. ₹${DELIVERY_CHARGE} delivery)`}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
