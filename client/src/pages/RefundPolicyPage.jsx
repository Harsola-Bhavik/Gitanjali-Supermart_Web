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

const BulletList = ({ items, color = 'primary' }) => (
  <ul className="space-y-2">
    {items.map(item => (
      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${color === 'red' ? 'bg-red-400' : 'bg-primary-500'}`} />
        {item}
      </li>
    ))}
  </ul>
);

const RefundPolicyPage = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    {/* Hero */}
    <div className="text-center mb-10">
      <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Legal</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 text-left">
        <p className="text-gray-600 text-sm leading-relaxed">
          At Geetanjali Farm Fresh, we commit to delivering the highest quality fresh produce, food items, and groceries straight to your doorstep. We understand that issues can occasionally happen during transit or packaging. Because we deal with perishable goods and hyper-local instant delivery, we enforce a strict, transparent policy regarding replacements and refunds.
        </p>
      </div>
    </div>

    {/* Eligible / Not Eligible side by side */}
    <div className="grid sm:grid-cols-2 gap-4 mb-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={20} className="text-primary-600" />
          <h2 className="text-base font-semibold text-gray-800">Eligible for Replacement</h2>
        </div>
        <BulletList items={[
          'Incorrect product received',
          'Damaged packaging or product',
          'Spoiled or rotten perishables',
          'Expired items at time of delivery',
          'Missing items from the order',
        ]} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <XCircle size={20} className="text-red-500" />
          <h2 className="text-base font-semibold text-gray-800">Not Refundable</h2>
        </div>
        <BulletList color="red" items={[
          'Change of mind after delivery',
          'Incorrect address or landmark provided',
          'Customer unavailable at delivery time',
          'Spoilage due to improper storage post-delivery',
          'The ₹40 delivery fee (non-refundable once dispatched)',
        ]} />
      </div>
    </div>

    <div className="flex flex-col gap-4">

      <Section icon={RefreshCw} title="The Replacement-First Core Principle">
        <p className="text-gray-600 text-sm mb-3">Our store operates under a Replacement-First Policy to ensure you get the items you paid for without unnecessary delays.</p>
        <BulletList items={[
          'Our Priority: If an eligible issue is verified with your order, our immediate course of action is to dispatch a brand-new replacement product to you.',
          'When Refunds Apply: A monetary refund to your original payment method will only be initiated if a replacement is entirely impossible — such as when an item goes completely out of stock, or seasonal farm produce becomes unavailable.',
        ]} />
      </Section>

      <Section icon={Clock} title="Strict Resolution Timelines">
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-3">
          <p className="text-xs font-semibold text-amber-700 mb-2">⏱️ Critical Windows to Note</p>
          <ul className="space-y-1 text-xs text-amber-800">
            <li>• The 48-Hour Complaint Window: You must officially register your complaint within 48 hours of the delivery timestamp. Any claims filed after 48 hours will be automatically rejected.</li>
            <li>• The 2-Hour Replacement Fulfillment: Once your replacement claim is verified and approved, a new courier will deliver the replacement items to your address within 2 hours.</li>
            <li>• The 7-to-15 Working Day Bank Refund: If a refund is authorized (due to zero stock), the funds will hit your original bank account or digital wallet within 7 to 15 working days, depending entirely on your bank's clearance cycles.</li>
          </ul>
        </div>
      </Section>

      <Section icon={ClipboardList} title="How to File a Claim (Step-by-Step)">
        <p className="text-gray-600 text-sm mb-3">If your order meets the eligibility criteria, please follow these steps to secure your 2-hour replacement:</p>
        <ul className="space-y-2">
          {[
            { step: '1', text: 'Gather Evidence: Take clear, well-lit photographs or a short video showing the damage, spoilage, incorrect item, or the expired date stamp. Keep your original paper invoice handy.' },
            { step: '2', text: 'Contact Support: Reach out to our customer care team via the official support channels listed on our website.' },
            { step: '3', text: 'Provide Details: Send your Order ID, registered phone number, a brief description of the issue, and your photographic/video evidence.' },
            { step: '4', text: 'Verification: Our operations team will quickly cross-reference your claim against our warehouse packaging records.' },
            { step: '5', text: 'Dispatch/Credit: Upon approval, your 2-hour replacement delivery will be triggered automatically. If stock is unavailable, your 7-to-15 working day bank refund process will be initiated.' },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center mt-0.5">{step}</span>
              {text}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={HeadphonesIcon} title="Contact Information">
        <p className="text-gray-600 text-sm">For all questions, claims, or immediate assistance regarding an order discrepancy, please reach out directly to our grievance desk through the designated contact portals on the Geetanjali Farm Fresh website.</p>
      </Section>

    </div>
  </div>
);

export default RefundPolicyPage;
