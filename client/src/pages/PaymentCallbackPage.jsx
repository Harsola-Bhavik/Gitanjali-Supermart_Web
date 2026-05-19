import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSuccess = searchParams.get('payment') === 'success';

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-6">
              Your order has been confirmed. An invoice has been sent to your email.
            </p>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-500 transition-colors"
            >
              Continue Shopping
            </button>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-500 mb-6">
              Your payment was not completed. No amount has been deducted. Please try again.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/checkout', { replace: true })}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-500 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/', { replace: true })}
                className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
