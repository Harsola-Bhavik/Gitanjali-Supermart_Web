import { Shield, Database, Share2, Cookie, Mail } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex gap-4">
    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      {children}
    </div>
  </div>
);

const PrivacyPolicyPage = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    {/* Hero */}
    <div className="text-center mb-10">
      <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Legal</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm max-w-xl mx-auto">
        Welcome to Geetanjali Farm Fresh. Your privacy is important to us. This policy explains how we collect, use, and protect your information.
      </p>
    </div>

    <div className="flex flex-col gap-4">
      <Section icon={Database} title="Information We Collect">
        <ul className="space-y-1.5 text-gray-600 text-sm">
          {['Name', 'Email address', 'Phone number', 'Delivery address', 'Order and payment details'].map(item => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Shield} title="How We Use Your Information">
        <ul className="space-y-1.5 text-gray-600 text-sm">
          {['Process and deliver orders', 'Improve customer experience', 'Provide customer support', 'Send order updates and important notifications'].map(item => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Shield} title="Data Protection">
        <p className="text-gray-600 text-sm">We take reasonable security measures to protect your personal information from unauthorized access or misuse.</p>
      </Section>

      <Section icon={Share2} title="Sharing of Information">
        <p className="text-gray-600 text-sm">We do not sell or rent your personal information to third parties. Information may only be shared with delivery or payment partners when necessary to complete your order.</p>
      </Section>

      <Section icon={Cookie} title="Cookies">
        <p className="text-gray-600 text-sm">Our website may use cookies to improve website functionality and user experience.</p>
      </Section>

      <Section icon={Mail} title="Contact">
        <p className="text-gray-600 text-sm">For any privacy-related concerns, you can contact us through the details available on the website.</p>
      </Section>
    </div>
  </div>
);

export default PrivacyPolicyPage;
