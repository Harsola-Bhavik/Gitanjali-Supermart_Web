import { CheckCircle, XCircle, ClipboardList, Clock, RefreshCw, HeadphonesIcon } from 'lucide-react';

const Section = ({ icon: Icon, title, children, accent }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex gap-4">
    <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${accent === 'red' ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-600'}`}>
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      {children}
    </div>
  </div>
);

const RefundPolicyPage = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    {/* Hero */}
    <div className="text-center mb-10">
      <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Legal</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Policy</h1>
      <p className="text-gray-500 text-sm max-w-xl mx-auto">
        We want you to be satisfied with every order. Here's everything you need to know about our refund process.
      </p>
    </div>

    {/* Eligible / Not Eligible side by side */}
    <div className="grid sm:grid-cols-2 gap-4 mb-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={20} className="text-primary-600" />
          <h2 className="text-base font-semibold text-gray-800">Refund Eligible</h2>
        </div>
        <ul className="space-y-2">
          {['Wrong product delivered', 'Damaged product received', 'Missing items in the order'].map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <XCircle size={20} className="text-red-500" />
          <h2 className="text-base font-semibold text-gray-800">Not Refundable</h2>
        </div>
        <ul className="space-y-2">
          {['Change of mind after delivery', 'Incorrect address provided by the customer', 'Delay caused by unavoidable circumstances'].map(item => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="flex flex-col gap-4">
      <Section icon={ClipboardList} title="Refund Process">
        <p className="text-gray-600 text-sm">Contact support within a reasonable time after delivery with your order details and we'll review your request promptly.</p>
      </Section>

      <Section icon={Clock} title="Refund Time">
        <p className="text-gray-600 text-sm">Approved refunds are usually processed within a few business days depending on the payment method used.</p>
      </Section>

      <Section icon={RefreshCw} title="Replacement">
        <p className="text-gray-600 text-sm">In some situations, replacement products may be offered instead of a monetary refund.</p>
      </Section>

      <Section icon={HeadphonesIcon} title="Contact Support">
        <p className="text-gray-600 text-sm">For refund-related issues, contact us through the details available on the website and we'll be happy to assist you.</p>
      </Section>
    </div>
  </div>
);

export default RefundPolicyPage;
