import { usePageTitle } from "../../hooks/usePageTitle";

const ContactPage = () => {
  usePageTitle("Kontakt");
  return (
    <div className="container max-w-screen-lg mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-green-800">Kontakt</h1>

      <div className="mb-8">
        <p className="text-lg mb-2">Masz pytania? Zadzwoń:</p>
        <a
          href="tel:+48723047028"
          className="text-xl text-green-700 hover:text-green-900 font-semibold underline"
        >
          +48 723 047 028
        </a>
        <p className="text-lg mt-4 mb-2">Napisz do nas:</p>
        <a
          href="mailto:WsrodBylin@wp.pl"
          className="text-xl text-green-700 hover:text-green-900 font-semibold underline"
        >
          WsrodBylin@wp.pl
        </a>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4 text-gray-800">Lokalizacja</h2>
        <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-md">
          <iframe
            title="Nasza lokalizacja"
            src="https://maps.google.com/maps?q=52.0542433,19.377334&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
