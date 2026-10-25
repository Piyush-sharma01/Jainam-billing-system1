import React, { useState } from "react";
import { Clock3, Mail, MapPin, Send, ArrowUpRight, MessageCircle, Navigation } from "lucide-react";

const EMAIL = "jainamautoindustries@gmail.com";
const ADDRESS = "Plot No. 29, B. U. Bhandari Ind. Estate, Gat No. 156/1544, Behind Mazak Company, Next to Sericol Company, Pune Nagar Road, Sanaswadi, Taluka - Shirur, Dist. - Pune - 412208, Maharashtra, India";
const WHATSAPP = "919422308740";
const MAP_LINK = "https://www.google.com/maps/search/?api=1&query=Plot+No.+29+BU+Bhandari+Ind+Estate+Sanaswadi+Pune+412208";

export default function StoreContact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!form.message.trim()) nextErrors.message = "Please add a short message.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Please enter a valid email address.";
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setErrors({});

    const subject = encodeURIComponent(form.subject.trim() || `Enquiry from ${form.name.trim()}`);
    const body = encodeURIComponent([
      `Name: ${form.name.trim()}`,
      form.email ? `Email: ${form.email.trim()}` : "",
      "",
      form.message.trim(),
    ].filter(Boolean).join("\n"));
    setSent(true);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const cards = [
    { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, action: "Write an email" },
    { icon: MessageCircle, label: "WhatsApp", value: "+91 94223 08740", href: `https://wa.me/${WHATSAPP}?text=Hello%20Jainam%20Auto%20Industries%2C%20I%20have%20a%20product%20enquiry.`, action: "Start a conversation" },
    { icon: MapPin, label: "Factory", value: "Sanaswadi, Pune, Maharashtra", href: MAP_LINK, action: "Get directions" },
  ];

  return (
    <div className="page-enter">
      <section className="relative overflow-hidden bg-royal text-white">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "54px 54px" }} />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-habanero">Jainam Auto Industries · Pune</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.8rem,7vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.045em]">Let's talk about<br /><span className="text-habanero">your requirements.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">Send your vehicle model, component type, specification or quantity. The Jainam team can help you find the right catalogue item.</p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs text-white/70"><Clock3 size={14} className="text-habanero" /> Monday–Saturday · 9:00 am–7:00 pm</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-10 lg:py-20">
        <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_20px_70px_-50px_rgba(22,34,78,0.55)] sm:p-9">
          <div className="mb-8">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-habanero">Send an enquiry</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-royal sm:text-3xl">How can we help?</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">Submitting opens your email app with the message addressed to Jainam Auto Industries.</p>
          </div>

          {sent && <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Your email app should open with the enquiry ready to send.</div>}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Your name" error={errors.name}>
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" className={inputClass(errors.name)} autoComplete="name" />
              </Field>
              <Field label="Email address" error={errors.email}>
                <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" className={inputClass(errors.email)} autoComplete="email" />
              </Field>
            </div>
            <Field label="Subject">
              <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Product or vehicle model" className={inputClass()} />
            </Field>
            <Field label="Requirement" error={errors.message}>
              <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows={5} placeholder="Tell us the component, size or vehicle details you need…" className={`${inputClass(errors.message)} min-h-[135px] resize-y`} />
            </Field>
            <button type="submit" className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-habanero px-6 text-sm font-semibold text-white transition-all hover:bg-royal sm:w-auto">
              Prepare email <Send size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {cards.map(({ icon: Icon, label, value, href, action }) => <a key={label} href={href} target={label === "WhatsApp" || label === "Factory" ? "_blank" : undefined} rel={label === "WhatsApp" || label === "Factory" ? "noreferrer" : undefined} className="group flex gap-4 rounded-2xl border border-line bg-paper/50 p-5 transition-all hover:-translate-y-0.5 hover:border-royal/20 hover:bg-white hover:shadow-lg hover:shadow-royal/5 sm:p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-royal text-white transition-colors group-hover:bg-habanero"><Icon size={19} /></span>
            <span className="min-w-0 flex-1"><span className="block font-mono text-[9px] font-semibold uppercase tracking-[0.17em] text-ink-soft/60">{label}</span><span className="mt-1 block break-words text-sm font-semibold text-royal sm:text-base">{value}</span><span className="mt-1 block text-xs text-ink-soft">{action}</span></span>
            <ArrowUpRight size={16} className="mt-1 shrink-0 text-ink-soft/45 transition-colors group-hover:text-habanero" />
          </a>)}

          <div className="rounded-2xl bg-deadly p-5 text-white sm:p-6">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.17em] text-habanero">Factory address</p>
            <p className="mt-3 flex items-start gap-3 text-sm leading-6 text-white/75"><MapPin size={17} className="mt-0.5 shrink-0 text-habanero" />{ADDRESS}</p>
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-habanero">Open directions <Navigation size={15} /></a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-paper">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-white px-5 py-4 sm:px-7">
            <div><p className="font-mono text-[9px] font-semibold uppercase tracking-[0.17em] text-habanero">Find our factory</p><p className="mt-1 font-display text-lg font-semibold text-royal">Sanaswadi, Pune</p></div>
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-royal transition-colors hover:border-habanero hover:text-habanero">Open in Maps <ArrowUpRight size={13} /></a>
          </div>
          <iframe title="Jainam Auto Industries factory location in Sanaswadi, Pune" src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`} className="h-[300px] w-full border-0 sm:h-[380px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </div>
  );
}

function Field({ label, error, children }) {
  return <label className="block"><span className="mb-2 block text-xs font-semibold text-royal">{label}</span>{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
}

function inputClass(hasError = false) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm text-royal outline-none transition focus:border-royal focus:ring-4 focus:ring-royal/10 placeholder:text-ink-soft/40 ${hasError ? "border-red-400" : "border-line"}`;
}
