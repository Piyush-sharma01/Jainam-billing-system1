import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Clock3, Mail, MapPin, Menu, X } from "lucide-react";

const navLinks = [
  { to: "/store", label: "Home", end: true },
  { to: "/store/catalogue", label: "Catalogue" },
  { to: "/store/about", label: "About Jainam" },
  { to: "/store/contact", label: "Contact" },
];

const email = "jainamautoindustries@gmail.com";
const whatsappHref = "https://wa.me/919422308740?text=Hello%20Jainam%20Auto%20Industries%2C%20I%20need%20a%20product%20quote.";
const factoryAddress = "Plot No. 29, B. U. Bhandari Ind. Estate, Gat No. 156/1544, Behind Mazak Company, Next to Sericol Company, Pune Nagar Road, Sanaswadi, Taluka - Shirur, Dist. - Pune - 412208, Maharashtra, India";
const officialLogoUrl = "https://www.jainamautoindustries.com/images/logo-light.png";

function JainamLogo({ className }) {
  const [src, setSrc] = useState("/jainam-logo-cropped.png");
  return (
    <img
      src={src}
      alt="Jainam Auto Industries"
      className={className}
      onError={() => setSrc((current) => current === officialLogoUrl ? current : officialLogoUrl)}
      loading="eager"
    />
  );
}

export default function StorefrontLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <div className="hidden bg-royal text-white/80 sm:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-6 text-[10px] tracking-wide lg:px-10">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-habanero" />
            <span>ISO 9001:2015 certified</span><span className="text-white/30">·</span><span>Pune, Maharashtra · Since 2002</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><Clock3 size={12} /> Mon–Sat, 9:00–19:00</span>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-white"><Mail size={12} /> {email}</a>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur transition-shadow duration-300 ${scrolled ? "shadow-lg shadow-royal/10" : ""}`}>
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[90px] lg:px-10">
          <Link to="/store" className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-habanero/20" onClick={closeMenu} aria-label="Jainam Auto Industries home">
            <JainamLogo className="block h-auto w-[164px] object-contain sm:w-[178px] lg:w-[194px]" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `relative rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors ${isActive ? "bg-paper text-royal" : "text-ink-soft hover:bg-paper hover:text-royal"}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-habanero px-5 py-3 text-xs font-semibold text-white shadow-md shadow-habanero/20 transition-all hover:-translate-y-0.5 hover:bg-deadly">Talk to Jainam <ArrowUpRight size={14} /></a>
          </div>

          <button className="flex h-11 w-11 items-center justify-center rounded-xl text-royal transition-colors hover:bg-paper md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <>
          <button className="fixed inset-0 z-40 bg-royal/40 backdrop-blur-[2px] md:hidden" onClick={closeMenu} aria-label="Close navigation" />
          <nav className="fixed left-0 right-0 top-[76px] z-50 rounded-b-3xl border-b border-line bg-white p-4 shadow-2xl md:hidden" aria-label="Mobile navigation">
            {navLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.end} onClick={closeMenu} className={({ isActive }) => `flex min-h-12 items-center justify-between rounded-xl px-4 text-sm font-medium ${isActive ? "bg-paper text-royal" : "text-ink-soft hover:bg-paper hover:text-royal"}`}>{link.label}<ArrowUpRight size={15} className="opacity-40" /></NavLink>)}
            <a href={whatsappHref} target="_blank" rel="noreferrer" onClick={closeMenu} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-habanero px-4 text-sm font-semibold text-white">WhatsApp Enquiry <ArrowUpRight size={15} /></a>
            <a href={`mailto:${email}`} className="mt-3 flex items-center justify-center gap-2 py-3 text-xs text-ink-soft"><Mail size={14} />{email}</a>
          </nav>
        </>
      )}

      <main className="flex-1">{children}</main>

      <footer className="relative overflow-hidden bg-royal text-white">
        <div className="h-1 bg-gradient-to-r from-habanero via-orange-300 to-habanero" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1.4fr] lg:gap-12 lg:px-10 lg:py-16">
          <div>
            <Link to="/store" className="inline-flex rounded-xl bg-white p-3 sm:p-4" aria-label="Jainam Auto Industries home">
              <JainamLogo className="block h-auto w-[174px] object-contain sm:w-[194px]" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">Precision fluid-transmission components for commercial vehicles, OEMs and replacement markets.</p>
            <p className="mt-4 text-xs font-semibold tracking-wide text-white/85">Pune, Maharashtra · Since 2002</p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/75">{navLinks.map((link) => <li key={link.to}><Link to={link.to} className="transition-colors hover:text-habanero">{link.label}</Link></li>)}</ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Product lines</h2>
            <ul className="mt-5 grid grid-cols-1 gap-2.5 text-sm text-white/75">{["Automobile pipes", "Nozzle pipes", "Hydraulic hoses", "Brake pipes", "Nylon brake pipes", "Power steering hoses", "Teflon pipes"].map((item) => <li key={item}>{item}</li>)}</ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Contact & factory</h2>
            <a href={`mailto:${email}`} className="mt-5 flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-habanero"><Mail size={15} className="text-habanero" />{email}</a>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-habanero">WhatsApp <ArrowUpRight size={14} className="text-habanero" /></a>
            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-white/65"><MapPin size={15} className="mt-0.5 shrink-0 text-habanero" /><span>{factoryAddress}</span></p>
            <p className="mt-3 flex items-center gap-2 text-xs text-white/50"><Clock3 size={13} />Mon–Sat · 9:00–19:00</p>
          </div>
        </div>
        <div className="relative border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 text-[11px] text-white/45 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10"><span>© {new Date().getFullYear()} Jainam Auto Industries. All rights reserved.</span><span>GSTIN/UIN: 27ABXPD9091J1ZV</span></div>
        </div>
      </footer>
    </div>
  );
}
