import { FileText, Tag, ShoppingCart, UserCheck, Lock, AlertTriangle, RefreshCw } from 'lucide-react';

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

const BulletList = ({ items }) => (
  <ul className="space-y-1.5 text-gray-600 text-sm">
    {items.map(item => (
      <li key={item} className="flex items-start gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0 mt-1.5" />
        {item}
      </li>
    ))}
  </ul>
);

const TermsPage = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    {/* Hero */}
    <div className="text-center mb-10">
      <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Legal</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
      <p className="text-gray-500 text-sm max-w-xl mx-auto">
        By using this website, you agree to follow these Terms and Conditions. Please read them carefully.
      </p>
    </div>

    <div className="flex flex-col gap-4">
      <Section icon={FileText} title="Products and Services">
        <p className="text-gray-600 text-sm">Geetanjali Farm Fresh offers food and grocery-related products. Product availability may change without prior notice.</p>
      </Section>

      <Section icon={Tag} title="Pricing">
        <p className="text-gray-600 text-sm">All prices displayed on the website are subject to change at any time without notice.</p>
      </Section>

      <Section icon={ShoppingCart} title="Orders">
        <BulletList items={[
          'Orders are confirmed only after successful payment or confirmation.',
          'We reserve the right to cancel any order due to stock issues, pricing errors, or other operational reasons.',
        ]} />
      </Section>

      <Section icon={UserCheck} title="User Responsibilities">
        <p className="text-gray-600 text-sm mb-2">Users must:</p>
        <BulletList items={['Provide accurate information', 'Use the website lawfully', 'Avoid misuse of the platform']} />
      </Section>

      <Section icon={Lock} title="Intellectual Property">
        <p className="text-gray-600 text-sm">All website content including text, logos, graphics, and images belongs to Geetanjali Farm Fresh and may not be copied without permission.</p>
      </Section>

      <Section icon={AlertTriangle} title="Limitation of Liability">
        <p className="text-gray-600 text-sm mb-2">We are not responsible for:</p>
        <BulletList items={[
          'Delays caused by third-party services',
          'Temporary website downtime',
          'Indirect losses arising from website usage',
        ]} />
      </Section>

      <Section icon={RefreshCw} title="Changes to Terms">
        <p className="text-gray-600 text-sm">We may update these Terms and Conditions at any time without prior notice.</p>
      </Section>
    </div>
  </div>
);

export default TermsPage;
