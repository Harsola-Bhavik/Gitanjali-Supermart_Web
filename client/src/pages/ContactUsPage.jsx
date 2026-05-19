import { Mail } from 'lucide-react';

const emails = [
  { label: 'General Enquiries', address: 'hello@geetanjalifarmfresh.com' },
  { label: 'Customer Support', address: 'support@geetanjalifarmfresh.com' },
  { label: 'Escalation Desk', address: 'escalation.desk@geetanjalifarmfresh.com' },
];

const ContactUsPage = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <div className="text-center mb-10">
      <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">Get In Touch</span>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
      <p className="text-gray-500 text-sm max-w-xl mx-auto">
        Have a question or need help? Reach out to us at any of the email addresses below and we'll get back to you as soon as possible.
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
          <Mail size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Email Us</h2>
      </div>
      <div className="flex flex-col gap-3">
        {emails.map(({ label, address }) => (
          <div key={address} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-sm text-gray-500">{label}</span>
            <a href={`mailto:${address}`} className="text-sm font-medium text-primary-600 hover:underline">
              {address}
            </a>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ContactUsPage;
