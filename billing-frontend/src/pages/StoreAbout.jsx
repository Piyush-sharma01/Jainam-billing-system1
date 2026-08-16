import React from "react";
import { ShieldCheck, Truck, Headphones, Award } from "lucide-react";

export default function StoreAbout() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">About Jainam</h1>
      <p className="text-gray-600 text-lg mb-6">
        Jainam is a dependable supplier of pipes, valves, fittings and related hardware,
        working directly with leading brands to keep our catalogue current, competitively
        priced, and consistently in stock.
      </p>
      <p className="text-gray-600 mb-6">
        Every client works with a dedicated account manager who personally handles their
        orders, pricing, and invoicing — so there's always a familiar face behind every order,
        not just a form.
      </p>
      <p className="text-gray-600 mb-12">
        Whether you're sourcing for a single project or maintaining an ongoing supply
        relationship, our team is set up to make ordering simple and predictable.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-5 text-center">
          <ShieldCheck className="mx-auto text-primary mb-2" size={28} />
          <p className="font-semibold text-gray-800">Trusted Quality</p>
        </div>
        <div className="bg-white border rounded-xl p-5 text-center">
          <Truck className="mx-auto text-primary mb-2" size={28} />
          <p className="font-semibold text-gray-800">Reliable Supply</p>
        </div>
        <div className="bg-white border rounded-xl p-5 text-center">
          <Headphones className="mx-auto text-primary mb-2" size={28} />
          <p className="font-semibold text-gray-800">Dedicated Support</p>
        </div>
        <div className="bg-white border rounded-xl p-5 text-center">
          <Award className="mx-auto text-primary mb-2" size={28} />
          <p className="font-semibold text-gray-800">Trusted Brands</p>
        </div>
      </div>
    </div>
  );
}
