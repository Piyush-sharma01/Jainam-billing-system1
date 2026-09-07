import React, { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function StoreContact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
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
      "",
      form.message,
    ].filter(Boolean);

    const subject = encodeURIComponent(form.subject || `Enquiry from ${form.name}`);
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:sales@jainam.example?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const infoCards = [
    { icon: Phone,  label: "Phone Number", value: "+91 00000 00000", href: "tel:+910000000000" },
    { icon: Mail,   label: "Email Address", value: "sales@jainam.example", href: "mailto:sales@jainam.example" },
    { icon: MapPin, label: "Our Location", value: "Mumbai, Maharashtra, India", href: null },
  ];

  const mapSrc = "https://www.google.com/maps?q=Mumbai,Maharashtra,India&output=embed";

  return (
    <div className="page-enter">

      {/* ══════════════════════════════════════
          PHOTO HERO BANNER
      ══════════════════════════════════════ */}
      <section className="relative h-[260px] sm:h-[340px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1636887584784-954392022b75?fm=jpg&q=70&w=1600&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-royal/80" />
        <div className="relative text-center px-4">
          <h1 className="font-display font-600 text-4xl sm:text-6xl text-white leading-none mb-4">
            Contact Us
          </h1>
          <p className="font-mono text-[11px] tracking-widest text-white/70 uppercase">
            Home <span className="mx-2 text-habanero">/</span> Contact Us
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          GET IN TOUCH — form + stacked info cards
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16">

          {/* Left — heading + simple stacked form */}
          <div>
            <h2 className="font-display font-600 text-2xl sm:text-3xl text-royal mb-3">
              Get In Touch
            </h2>
            <p className="text-ink-soft leading-relaxed mb-8 max-w-md">
              Have a question about an order or need something sourced that's not in the
              catalogue? Send us a message and our team will get back to you.
            </p>

            {sent && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 mb-5">
                Opening your mail client…
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label className="block font-display font-medium text-sm text-royal mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name..."
                  className={`w-full px-4 py-3 bg-white border text-sm text-royal placeholder:text-ink-soft/60 focus:outline-none focus:border-royal/40 transition-colors min-h-[46px] ${
                    errors.name ? "border-red-400" : "border-tan"
                  }`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block font-display font-medium text-sm text-royal mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@youremail.com"
                  className="w-full px-4 py-3 bg-white border border-tan text-sm text-royal placeholder:text-ink-soft/60 focus:outline-none focus:border-royal/40 transition-colors min-h-[46px]"
                />
              </div>

              <div>
                <label className="block font-display font-medium text-sm text-royal mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Title..."
                  className="w-full px-4 py-3 bg-white border border-tan text-sm text-royal placeholder:text-ink-soft/60 focus:outline-none focus:border-royal/40 transition-colors min-h-[46px]"
                />
              </div>

              <div>
                <label className="block font-display font-medium text-sm text-royal mb-2">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  placeholder="Type Here..."
                  className={`w-full px-4 py-3 bg-white border text-sm text-royal placeholder:text-ink-soft/60 focus:outline-none focus:border-royal/40 transition-colors resize-none ${
                    errors.message ? "border-red-400" : "border-tan"
                  }`}
                />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-habanero text-white font-display font-medium text-sm py-3.5 hover:bg-royal transition-colors min-h-[48px]"
              >
                Send Now <Send size={15} />
              </button>
            </form>
          </div>

          {/* Right — stacked info cards */}
          <div className="space-y-5">
            {infoCards.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bg-tan/30 p-8 text-center">
                <div className="w-12 h-12 bg-habanero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-white" />
                </div>
                <p className="font-display font-600 text-base text-royal mb-2">
                  {label}
                </p>
                {href ? (
                  <a href={href} className="text-ink-soft text-sm hover:text-habanero transition-colors">
                    {value}
                  </a>
                ) : (
                  <p className="text-ink-soft text-sm">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MAP
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24">
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
    </div>
  );
}
