import { Leaf, Truck, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3 text-center">
        <div>
          <Leaf className="mx-auto text-green-600" size={40} />
          <h3 className="mt-4 text-lg font-semibold">Naturalne produkty</h3>
          <p className="text-gray-600 text-sm">
            Wszystkie nasze rośliny pochodzą z ekologicznych upraw i lokalnych szkółek.
          </p>
        </div>
        <div>
          <Truck className="mx-auto text-green-600" size={40} />
          <h3 className="mt-4 text-lg font-semibold">Szybka dostawa</h3>
          <p className="text-gray-600 text-sm">
            Realizujemy zamówienia w 24h – Twoje rośliny dotrą świeże i bezpieczne.
          </p>
        </div>
        <div>
          <ShieldCheck className="mx-auto text-green-600" size={40} />
          <h3 className="mt-4 text-lg font-semibold">Gwarancja jakości</h3>
          <p className="text-gray-600 text-sm">
            Każdy produkt przechodzi kontrolę przed wysyłką. Gwarantujemy 100% satysfakcji.
          </p>
        </div>
      </div>
    </section>
  );
}
