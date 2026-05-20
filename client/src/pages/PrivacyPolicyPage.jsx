import { Shield, Database, Share2, Cookie, Mail, Lock, Clock, UserCheck, Baby } from 'lucide-react';

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

const PrivacyPolicyPage = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    {/* Hero */}
    <div className="text-center mb-10">
      <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Legal</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 text-left">
        <p className="text-gray-600 text-sm leading-relaxed">
          At Geetanjali Farm Fresh, we are deeply committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy outlines how we collect, use, process, disclose, and safeguard your information when you visit our website, use our mobile application, or interact with our on-demand grocery delivery services.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mt-3 pt-3 border-t border-gray-100">
          By accessing or using our platform, you explicitly consent to the data practices described in this policy.
        </p>
      </div>
    </div>

    <div className="flex flex-col gap-4">

      <Section icon={Database} title="Information We Collect">
        <p className="text-gray-600 text-sm mb-3">We collect several types of information to provide a seamless, rapid-fulfillment shopping experience:</p>

        <p className="text-gray-700 text-sm font-medium mb-1">A. Personal Information Provided Voluntarily</p>
        <BulletList items={[
          'Account & Profile Data: Your full name, email address, primary and alternative phone numbers, and account passwords.',
          'Delivery & Shipping Details: Complete geographical addresses, landmark designations, and delivery instructions.',
          'Financial & Transactional Data: Your order history, items purchased, transaction values, and payment preferences.',
        ]} />
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mt-3 mb-3">
          <p className="text-xs text-blue-700">
            <span className="font-semibold">Note on Payment Security:</span> We do not store your raw credit/debit card numbers, CVVs, or net-banking passwords on our servers. All financial transactions are processed securely through certified, encrypted third-party payment gateways.
          </p>
        </div>

        <p className="text-gray-700 text-sm font-medium mb-1">B. Information Collected Automatically</p>
        <BulletList items={[
          'Device and Technical Logs: Your IP address, browser type, operating system, device identifiers, and system crash logs.',
          'Usage Behavior: Pages viewed, time spent on our website, products searched for, links clicked, and items added to your cart.',
        ]} />

        <p className="text-gray-700 text-sm font-medium mt-3 mb-1">C. Precise Location Data</p>
        <BulletList items={[
          'Real-Time Logistics Tracking: Because we target a 45 to 60-minute quick-delivery window, our platform may request access to your device\'s precise GPS location. This allows us to map your address accurately and optimize delivery routes for our courier partners.',
        ]} />
      </Section>

      <Section icon={Shield} title="How We Use Your Information">
        <p className="text-gray-600 text-sm mb-3">We process your personal information based on lawful grounds, primarily to fulfill our operational commitments to you:</p>
        <BulletList items={[
          'Order Fulfillment: To process your transactions, pack your groceries, and successfully deliver orders or handle 2-hour replacements.',
          'Logistics Coordination: To share necessary delivery paths and contact metrics with our quick-commerce delivery fleets.',
          'Customer Support & Dispute Resolutions: To verify claims, manage the 48-hour complaint window, inspect photographic evidence of damaged/expired products, and process authorized bank refunds.',
          'Communications & Alerts: To send instant order confirmations, live delivery tracking links, OTPs for secure logins, and critical policy update notifications.',
          'Marketing & Personalization (Opt-Out Available): To recommend seasonal farm produce, notify you of active discounts, and improve user interface performance.',
        ]} />
      </Section>

      <Section icon={Share2} title="Sharing and Disclosure of Information">
        <p className="text-gray-600 text-sm mb-3">We strictly enforce a policy of never selling, renting, or trading your personal data to third-party marketing companies. Your information is only shared under the following limited conditions:</p>

        <p className="text-gray-700 text-sm font-medium mb-1">A. Third-Party Service Providers & Aggregators</p>
        <BulletList items={[
          'Delivery and On-Demand Couriers: Your name, delivery address, and phone number are shared with third-party delivery aggregators (such as Rapido, Porter, and equivalent hyper-local courier networks) so their riders can navigate to your location and contact you upon arrival.',
          'Payment Processors: Your transactional details are securely shared with authorized payment gateways to process digital payments and process refunds within the 7 to 15 working days window.',
        ]} />

        <p className="text-gray-700 text-sm font-medium mt-3 mb-1">B. Legal and Regulatory Obligations</p>
        <p className="text-gray-600 text-sm">We may disclose your data if strictly required to do so by applicable laws, court orders, or government authorities, or when necessary to protect the safety, property, and legal rights of Geetanjali Farm Fresh, our users, or the public.</p>
      </Section>

      <Section icon={Lock} title="Data Protection and Security Measures">
        <p className="text-gray-600 text-sm mb-3">We implement robust, industry-standard administrative, technical, and physical security protocols to safeguard your personal data:</p>
        <BulletList items={[
          'Encryption: All data transmitted between your device and our servers is secured using Secure Socket Layer (SSL/TLS) encryption technology.',
          'Access Control: Restricted access protocols ensure that only authorized employees and operations managers who require your data to resolve customer issues or dispatch orders can view it.',
          'Vulnerability Monitoring: Our digital infrastructure is regularly scanned and monitored to prevent unauthorized access, data breaches, or malicious altercations.',
        ]} />
        <p className="text-gray-500 text-xs mt-3">While we take maximum precautions, please note that no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
      </Section>

      <Section icon={Clock} title="Data Retention Policy">
        <p className="text-gray-600 text-sm">We retain your personal data only for as long as your account remains active or as required to fulfill the operational purposes detailed in this policy. Additionally, certain transactional records will be retained longer to comply with legal, tax, accounting, and anti-fraud mandates.</p>
      </Section>

      <Section icon={Cookie} title="Cookies and Tracking Technologies">
        <p className="text-gray-600 text-sm mb-3">Our platform utilizes cookies, web beacons, and pixels to elevate your browsing experience:</p>
        <BulletList items={[
          'Essential Cookies: Necessary for basic website functionalities, such as keeping you logged into your account and maintaining items inside your shopping cart.',
          'Performance & Analytics Cookies: Help us evaluate how visitors interact with the website, identifying speed issues or broken links so we can continuously optimize the interface.',
          'Managing Cookies: You can choose to disable cookies through your individual browser settings. However, doing so may disable core features of our platform, preventing you from placing orders or saving delivery preferences.',
        ]} />
      </Section>

      <Section icon={UserCheck} title="Your Data Rights">
        <p className="text-gray-600 text-sm mb-3">You maintain complete control over your personal data. At any time, you can exercise the following rights by logging into your account profile or contacting our support desk:</p>
        <BulletList items={[
          'Access and Correction: The right to review, update, or correct inaccuracies in your name, delivery address, or contact details.',
          'Data Erasure: The right to request the permanent deletion of your account and associated personal data, subject to unresolved transactions, active disputes, or legal retention requirements.',
          'Consent Withdrawal: The right to opt-out of promotional emails, marketing SMS campaigns, or WhatsApp alerts by clicking the "Unsubscribe" links provided.',
        ]} />
      </Section>

      <Section icon={Baby} title="Children's Privacy">
        <p className="text-gray-600 text-sm">Our services are designed for and directed toward individuals who are capable of entering legally binding contracts. We do not knowingly collect or solicit personal information from individuals under the age of 18. If we discover that a minor has provided us with personal data without verifiable parental consent, we will delete that data from our systems immediately.</p>
      </Section>

      <Section icon={Mail} title="Contact Us & Grievance Redressal">
        <p className="text-gray-600 text-sm mb-3">If you have any questions, clarifications, grievances, or complaints regarding this Privacy Policy or our data management practices, please contact our designated Privacy Compliance Team:</p>
        <BulletList items={[
          'Email: support@geetanjalifarmfresh.com',
          'Corporate Address: Geetanjali Farm Fresh, Main Market Road, Your City – 400001, Maharashtra, India',
          'Customer Support Desk: Available via the contact portal on our official website.',
        ]} />
      </Section>

    </div>
  </div>
);

export default PrivacyPolicyPage;
