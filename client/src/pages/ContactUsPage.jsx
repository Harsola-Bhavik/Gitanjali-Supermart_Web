import { Mail, MapPin, Clock } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    title: "Email Us",
    lines: [
      {
        label: "General Enquiries",
        value: "hello@geetanjalifarmfresh.com",
        href: "mailto:hello@geetanjalifarmfresh.com",
      },
      {
        label: "Customer Support",
        value: "support@geetanjalifarmfresh.com",
        href: "mailto:support@geetanjalifarmfresh.com",
      },
      {
        label: "Escalation Desk",
        value: "escalation.desk@geetanjalifarmfresh.com",
        href: "mailto:escalation.desk@geetanjalifarmfresh.com",
      },
    ],
  },
  {
    icon: MapPin,
    title: "Visit Us",
    lines: [
      {
        label: "Store Address",
        value:
          "Before jio petrol pump, 352, revadiya mahadev, nr. milan party plot, next to Airport Circle, new, Karelibagh, Vadodara, Gujarat 390022",
      },
    ],
  },
];

const ContactUsPage = () => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    {/* Header */}
    <div className="text-center mb-10">
      <span className="inline-block bg-primary-50 text-primary-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
        Get In Touch
      </span>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
      <p className="text-gray-500 text-sm max-w-xl mx-auto">
        Have a question, feedback, or need help with your order? We're here for
        you — reach out through any of the channels below.
      </p>
    </div>

    {/* Contact Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {contacts.map(({ icon: Icon, title, lines }) => (
        <div key={title} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
              <Icon size={20} />
            </div>
            <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          </div>
          <div className="flex flex-col gap-3">
            {lines.map(({ label, value, href }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-lg px-4 py-3 gap-1"
              >
                <span className="text-xs text-gray-400 font-medium shrink-0">
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="text-sm font-medium text-primary-600 hover:underline break-all"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-sm text-gray-700">{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Quick Message Box */}
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">
        Send Us a Message
      </h2>
      <p className="text-xs text-gray-400 mb-5">
        Fill in the form below and we'll get back to you within 24 hours.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { name, email, message } = e.target.elements;
          window.location.href = `mailto:support@geetanjalifarmfresh.com?subject=Message from ${encodeURIComponent(name.value)}&body=${encodeURIComponent(`Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`)}`;
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Your Name
            </label>
            <input
              name="name"
              required
              placeholder="John Doe"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Message
          </label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="How can we help you?"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        <button
          type="submit"
          className="self-start bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-500 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
);

export default ContactUsPage;
