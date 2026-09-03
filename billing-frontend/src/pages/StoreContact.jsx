import React, { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function StoreContact() {
  const [form, setForm]   = useState({ name: "", message: "" });
  const [sent, setSent]   = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required.";
    if (!form.message.trim()) e.message = "Message is required."; 
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body    = encodeURIComponent(form.message);
    window.location.href = `mailto:sales@jainam.example?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const contactInfo = [
    { icon: Phone,  label: "Phone",   value: "+91 00000 00000",    href: "tel:+910000000000" },
    { icon: Mail,   label: "Email",   value: "sales@jainam.example", href: "mailto:sales@jainam.example" },
    { icon: MapPin, label: "Address", value: "Mumbai, Maharashtra, India", href: null },
  ];

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-mono text-[11px] tracking-widest text-coral uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="font-display font-600 text-3xl sm:text-4xl text-white leading-tight">
            Contact Us
          </h1>
          <p className="text-white/60 mt-3 text-base">
            Have a question about an order or need something not in the catalogue?
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Contact info */}
          <div className="space-y-6">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-line flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-navy" />
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-ink-soft uppercase mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="font-display font-medium text-sm text-navy hover:text-coral transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-display font-medium text-sm text-navy">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <p className="text-sm text-ink-soft leading-relaxed pt-4 border-t border-line">
              For order-specific questions, your account manager is always the fastest way to
              get an answer.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-line p-6 space-y-5" noValidate>
            {sent && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3">
                Opening your mail client…
              </div>
            )}

            <div>
              <label className="block font-display font-medium text-xs text-ink-soft uppercase tracking-widest mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full px-3 py-2.5 bg-white border text-sm text-navy placeholder:text-ink-soft focus:outline-none focus:border-navy/40 transition-colors min-h-[44px] ${
                  errors.name ? "border-red-400" : "border-line"
                }`}
                placeholder="e.g. Rahul Mehta"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block font-display font-medium text-xs text-ink-soft uppercase tracking-widest mb-2">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className={`w-full px-3 py-2.5 bg-white border text-sm text-navy placeholder:text-ink-soft focus:outline-none focus:border-navy/40 transition-colors resize-none ${
                  errors.message ? "border-red-400" : "border-line"
                }`}
                placeholder="Your enquiry…"
              />
              {errors.message && (
                <p className="text-xs text-red-600 mt-1">{errors.message}</p>
              )}
            </div>
  
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-navy text-white py-3 font-display font-medium text-sm hover:bg-navy/90 transition-colors min-h-[48px]"
            >
              <Send size={15} /> Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
