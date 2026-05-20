import { FileText, Tag, ShoppingCart, UserCheck, Lock, AlertTriangle, RefreshCw, Truck, RotateCcw } from 'lucide-react';

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
        Welcome to Geetanjali Farm Fresh. By accessing or using our website, mobile application, or services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before placing an order.
      </p>
    </div>

    <div className="flex flex-col gap-4">

      <Section icon={FileText} title="Products and Services">
        <p className="text-gray-600 text-sm mb-3">Geetanjali Farm Fresh provides fresh food, groceries, and related consumer products.</p>
        <BulletList items={[
          'Product Variations: Since we deal in fresh farm produce and perishable items, the actual products may vary slightly in color, size, and appearance from the images displayed on the website.',
          'Availability: Product availability is highly subject to seasonal supply and stock levels. We reserve the right to limit order quantities or discontinue any product at any time without prior notice.',
        ]} />
      </Section>

      <Section icon={Tag} title="Pricing and Payments">
        <BulletList items={[
          'Price Changes: All prices listed on our platform are inclusive of applicable taxes unless stated otherwise. Prices are subject to change at any moment due to market fluctuations, without any prior notification.',
          'Payment Confirmation: An order is only considered accepted and confirmed once payment is successfully processed (for online payments) or when an official confirmation notification is sent to you.',
        ]} />
      </Section>

      <Section icon={ShoppingCart} title="Order Cancellations">
        <BulletList items={[
          'Our Right to Cancel: We reserve the ultimate right to cancel or refuse any order due to stock limitations, sudden unavailability of fresh produce, technical errors in pricing, or other unforeseen operational constraints. In such cases, a full refund will be issued to your original payment method.',
          'Customer Cancellations: Because we specialize in instant fulfillment, orders cannot be cancelled or modified once they have been dispatched to our third-party delivery partners.',
        ]} />
      </Section>

      <Section icon={Truck} title="Delivery and Fulfillment Policy">
        <p className="text-gray-600 text-sm mb-3">We strive to bring you the freshest products as quickly as possible through localized on-demand courier networks.</p>
        <BulletList items={[
          'Third-Party Aggregators: All home delivery services are fulfilled using third-party on-demand delivery aggregators and quick-commerce courier networks (including, but not limited to, Rapido, Porter, and similar local courier services).',
          'Delivery Timeline: Our standard target delivery window is 45 to 60 minutes from the time of order confirmation. However, this timeline is an estimate and may vary based on traffic, weather conditions, distance, and peak aggregator demand.',
          'Delivery Charges: A standard delivery fee of ₹40 applies to all home delivery orders. This fee goes directly toward covering the operational costs of our third-party delivery partners and is strictly non-refundable once the order has been dispatched from our facility.',
          'Store Pickup: No delivery or handling charges apply to orders placed under the "Store Pickup" option. Customers choosing this option are responsible for collecting their orders within the specified store hours.',
        ]} />
      </Section>

      <Section icon={RotateCcw} title="Complaints, Replacements, and Refund Policy">
        <p className="text-gray-600 text-sm mb-3">We take great pride in the quality of our food and groceries. If something goes wrong with your order, we are committed to fixing it immediately under our Replacement-First Policy.</p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-amber-700 mb-2">⚠️ Crucial Timelines at a Glance</p>
          <ul className="space-y-1 text-xs text-amber-800">
            <li>• Complaint Window: Must be filed within 48 hours of order delivery.</li>
            <li>• Replacement Resolution: Dispatched and delivered within 2 hours of approval.</li>
            <li>• Refund Processing: Reflects in your bank account within 7 to 15 working days (only if a replacement cannot be fulfilled).</li>
          </ul>
        </div>

        <p className="text-gray-700 text-sm font-medium mb-1">A. Core Policy Protocol</p>
        <BulletList items={[
          'Replacement Priority: First and absolute priority will always be given to replacing the affected items. If you receive an item that is damaged, expired, spoiled, or incorrect, we will default to delivering a brand-new replacement item to your address.',
          'Conditional Refund: A monetary refund will only be issued if fulfillment of a replacement is impossible (e.g., the product is entirely out of stock, or seasonal fresh produce is no longer available).',
        ]} />

        <p className="text-gray-700 text-sm font-medium mt-3 mb-1">B. Eligible Grounds for Complaints</p>
        <BulletList items={[
          'Expired Products: Packaged items that have passed their printed expiration or "Best Before" date at the time of delivery.',
          'Damaged Products: Items with torn, broken, crushed, or compromised packaging that affects the safety or usability of the product.',
          'Spoiled Products: Fresh or perishable goods (such as milk, vegetables, or fruits) that arrive decayed, rotten, or unfit for consumption.',
          'Incorrect Items: Items delivered that do not match the items listed on your order confirmation invoice.',
          'Undelivered/Missing Items: Items paid for but missing from your delivery package.',
        ]} />

        <p className="text-gray-700 text-sm font-medium mt-3 mb-1">C. Resolution Timelines & Process</p>
        <BulletList items={[
          'Filing the Claim: To initiate a claim, you must contact our support team within 48 hours of delivery. You must provide clear photographic or video evidence of the damaged, expired, or incorrect product alongside the original delivery invoice.',
          'The 2-Hour Replacement Window: Once your claim is reviewed and approved by our support team, a replacement order will be assigned to a third-party aggregator and delivered to your doorstep within 2 hours.',
          'The Bank Refund Window: In cases where a replacement is not possible due to inventory constraints, a refund will be processed. The refunded amount will be credited back to your original bank account or payment method within 7 to 15 working days, depending on your financial institution\'s processing cycles.',
        ]} />
      </Section>

      <Section icon={UserCheck} title="User Responsibilities">
        <p className="text-gray-600 text-sm mb-2">As a user of our platform, you agree to:</p>
        <BulletList items={[
          'Provide completely accurate, current, and verifiable contact details, phone numbers, and delivery addresses.',
          'Ensure someone is available to receive the delivery within the 45 to 60-minute delivery window (and the subsequent 2-hour window if a replacement is issued). If a delivery fails because you provided an incorrect address or were unreachable, delivery fees are non-refundable.',
          'Use our website and services strictly for lawful purposes and refrain from misusing, hacking, or disrupting the platform.',
        ]} />
      </Section>

      <Section icon={Lock} title="Intellectual Property">
        <p className="text-gray-600 text-sm">All content featured on this website — including but not limited to text, logos, custom graphics, brand names, layout design, and images — is the exclusive intellectual property of Geetanjali Farm Fresh. Unauthorized copying, reproduction, distribution, or modifications of this content for commercial or personal use without our explicit written consent is strictly prohibited.</p>
      </Section>

      <Section icon={AlertTriangle} title="Limitation of Liability">
        <BulletList items={[
          'Third-Party Delays: While we dispatch orders and replacements immediately, Geetanjali Farm Fresh is not liable for any delays, missed delivery windows, or behavioral issues directly caused by third-party delivery aggregators (like Rapido or Porter) or unexpected traffic/weather conditions.',
          'Platform Downtime: We are not responsible for any temporary website disruptions, server downtime, technical glitches, or indirect losses arising from your inability to access our platform or place an order.',
          'Product Misuse: We are not liable for any spoilage or damage to products resulting from improper storage, handling, or refrigeration by the customer after successful delivery.',
        ]} />
      </Section>

      <Section icon={RefreshCw} title="Changes to Terms and Conditions">
        <p className="text-gray-600 text-sm">We reserve the right to modify, amend, or update these Terms and Conditions at any time to reflect changes in our business operations, courier policies, or legal requirements. Any updates will become effective immediately upon being posted to this page without prior individual notice. Continued use of our platform constitutes your acceptance of the updated terms.</p>
      </Section>

    </div>
  </div>
);

export default TermsPage;
