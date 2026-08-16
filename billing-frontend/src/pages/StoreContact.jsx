import React, { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function StoreContact() {
  const [form, setForm] = useState({ name: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint for contact messages yet — this opens the user's
    // mail client pre-filled instead, so the message still reaches sales@.
    const subject = encodeURIComponent(`Message from ${form.name || "storefront visitor"}`);
    const body = encodeURIComponent(form.message);
    window.location.href = `mailto:sales@jainam.example?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-10">
        Have a question about an order or need something not in the catalogue? Reach out.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-3 rounded-lg">
              <Phone className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="font-medium text-gray-800">+91 00000 00000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-accent p-3 rounded-lg">
              <Mail className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium text-gray-800">sales@jainam.example</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-accent p-3 rounded-lg">
              <MapPin className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Address</p>
              <p className="font-medium text-gray-800">Mumbai, Maharashtra, India</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 pt-2">
            For order-specific questions, your account manager is always the fastest way to
            get an answer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
          {sent && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
              Opening your mail client...
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              className="w-full border rounded-lg p-2.5"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              className="w-full border rounded-lg p-2.5"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Send size={16} /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
