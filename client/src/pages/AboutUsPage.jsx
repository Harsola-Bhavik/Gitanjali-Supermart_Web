import { Leaf, BadgeCheck, ShoppingBag } from 'lucide-react';

const badges = [
  'Registered under MSME/Udyam',
  'GST Registered',
  'FSSAI Licensed',
];

const commitments = [
  'Delivering quality food products',
  'Maintaining food safety standards',
  'Providing a smooth and trusted shopping experience',
  'Offering fresh and carefully selected products',
];

const categories = [
  'Cereals and pulses',
  'Tea, coffee, spices, and flour',
  'Fruits and vegetables',
  'Food products and grocery items',
  'Beverages',
  'Other food retail products',
];

const AboutUsPage = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    {/* Hero */}
    <div className="text-center mb-10">
      <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Our Story</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to Geetanjali Farm Fresh</h1>
      <p className="text-gray-500 text-sm max-w-xl mx-auto">
        A Gujarat-based business focused on providing quality food and grocery products to customers with freshness and reliability.
      </p>
    </div>

    {/* Commitments */}
    <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
          <Leaf size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Our Commitments</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {commitments.map(item => (
          <div key={item} className="flex items-start gap-2 bg-gray-50 rounded-lg px-4 py-3">
            <BadgeCheck size={16} className="text-primary-600 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Business Info */}
    <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
          <BadgeCheck size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Our Business</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Business Type', value: 'Proprietorship' },
          { label: 'Industry', value: 'Food & Grocery Retail' },
          { label: 'Enterprise Type', value: 'Micro Enterprise' },
          { label: 'Location', value: 'Gujarat, India' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.map(b => (
          <span key={b} className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <BadgeCheck size={12} />
            {b}
          </span>
        ))}
      </div>
    </div>

    {/* Categories */}
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
          <ShoppingBag size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Categories We Deal In</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <span key={cat} className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full">{cat}</span>
        ))}
      </div>
    </div>
  </div>
);

export default AboutUsPage;
