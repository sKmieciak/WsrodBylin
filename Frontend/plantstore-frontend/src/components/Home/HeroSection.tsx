export default function HeroSection() {
  return (
    <section className="bg-green-100 py-16 px-4 text-center">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Witamy w Wśród Bylin 🌱</h1>
      <p className="text-gray-700 text-lg max-w-xl mx-auto">
        Sklep z roślinami ozdobnymi, który pokochasz. Trawy, byliny, kwiaty – wszystko w jednym miejscu!
      </p>
      <a
        href="/products"
        className="mt-8 inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
      >
        Przeglądaj produkty
      </a>
    </section>
  );
}
