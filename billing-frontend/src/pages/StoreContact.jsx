import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, ArrowRight } from "lucide-react";

export default function StoreContact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});

    const lines = [
      form.email && `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      form.interest && `Interested in: ${form.interest}`,
      "",
      form.message,
    ].filter(Boolean);

    const subject = encodeURIComponent(`Enquiry from ${form.name}`);
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:sales@jainam.example?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const contactInfo = [
    { icon: Phone, label: "Phone Number", value: "+91 00000 00000", href: "tel:+910000000000" },
    { icon: Mail,  label: "Email Address", value: "sales@jainam.example", href: "mailto:sales@jainam.example" },
    { icon: Clock, label: "Opening Hours", value: "Mon – Fri, 9:00 AM – 6:00 PM", href: null },
    { icon: MapPin, label: "Our Location", value: "Mumbai, Maharashtra, India", href: null },
  ];

  const mapSrc = "https://www.google.com/maps?q=Mumbai,Maharashtra,India&output=embed";

  return (
    <div className="page-enter">

      {/* ══════════════════════════════════════
          PAGE BANNER
      ══════════════════════════════════════ */}
      <section className="bg-royal py-14 sm:py-20 text-center px-4">
        <h1 className="font-display font-600 text-3xl sm:text-5xl text-white leading-none mb-4">
          Contact Us
        </h1>
        <p className="font-mono text-[11px] tracking-widest text-white/60 uppercase">
          Home <span className="mx-2 text-habanero">/</span> Contact Us
        </p>
      </section>

      {/* ══════════════════════════════════════
          INFO CARD + FORM CARD
      ══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-10 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Contact information card */}
          <div className="bg-white border border-tan p-6 sm:p-8 shadow-sm">
            <h2 className="font-display font-600 text-lg text-royal mb-2">
              Contact Information
            </h2>
            <p className="text-ink-soft text-sm leading-relaxed mb-6">
              Have a question or need help with an order? Our team is always ready to assist
              with sourcing, pricing, and support. Reach out any way that's easiest for you.
            </p>

            <div className="divide-y divide-tan">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-10 h-10 bg-tan flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-royal" />
                  </div>
                  <div>
                    <p className="font-display font-600 text-sm text-royal mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-ink-soft text-sm hover:text-habanero transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-ink-soft text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Get in touch form card */}
          <div className="bg-tan/40 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-habanero" />
              <span className="font-mono text-[10px] tracking-widest text-royal uppercase">
                Get In Touch
              </span>
            </div>
            <h2 className="font-display font-600 text-xl sm:text-2xl text-royal mb-2">
              Send Us Your Requirement
            </h2>
            <p className="text-ink-soft text-sm leading-relaxed mb-6">
              Fill out the form and our team will get back to you with pricing and
              availability, as soon as possible.
            </p>

            {sent && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 mb-4">
                Opening your mail client…
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                    className={`w-full px-3 py-3 bg-white border text-sm text-royal placeholder:text-ink-soft focus:outline-none focus:border-royal/40 transition-colors min-h-[44px] ${
                      errors.name ? "border-red-400" : "border-tan"
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email Address"
                  className="w-full px-3 py-3 bg-white border border-tan text-sm text-royal placeholder:text-ink-soft focus:outline-none focus:border-royal/40 transition-colors min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone Number"
                  className="w-full px-3 py-3 bg-white border border-tan text-sm text-royal placeholder:text-ink-soft focus:outline-none focus:border-royal/40 transition-colors min-h-[44px]"
                />
                <select
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="w-full px-3 py-3 bg-white border border-tan text-sm text-royal focus:outline-none focus:border-royal/40 transition-colors min-h-[44px]"
                >
                  <option value="">What are you looking for?</option>
                  <option value="Product Enquiry">Product Enquiry</option>
                  <option value="Bulk Order">Bulk Order</option>
                  <option value="Custom Sourcing">Custom Sourcing</option>
                  <option value="Support">Support / Existing Order</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  placeholder="Message"
                  className={`w-full px-3 py-3 bg-white border text-sm text-royal placeholder:text-ink-soft focus:outline-none focus:border-royal/40 transition-colors resize-none ${
                    errors.message ? "border-red-400" : "border-tan"
                  }`}
                />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-habanero text-white font-display font-medium text-sm px-7 py-3.5 hover:bg-royal transition-colors min-h-[48px]"
              >
                Send Message <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MAP SECTION
      ══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-tan/50 px-3 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-habanero" />
            <span className="font-mono text-[10px] tracking-widest text-royal uppercase">
              Our Location
            </span>
          </div>
          <h2 className="font-display font-600 text-xl sm:text-2xl text-royal">
            Find Us on the Map
          </h2>
        </div>
        <div className="aspect-[16/7] w-full border border-tan overflow-hidden">
          <iframe
            title="Jainam location map"
            src={mapSrc}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          CLOSING BAND
      ══════════════════════════════════════ */}
      <section className="bg-royal py-14 sm:py-16 text-center px-4">
        <h2 className="font-display font-600 text-2xl sm:text-4xl text-white mb-6">
          Have a requirement?
          <br className="hidden sm:block" /> Let's get started.
        </h2>
        <Link
          to="/store/catalogue"
          className="inline-flex items-center gap-2 bg-habanero text-white font-display font-medium text-sm px-7 py-3.5 hover:bg-white hover:text-royal transition-colors"
        >
          Browse Catalogue <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
