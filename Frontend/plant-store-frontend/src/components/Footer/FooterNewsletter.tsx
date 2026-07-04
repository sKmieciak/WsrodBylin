import { Facebook } from "lucide-react";

export default function FooterNewsletter() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Newsletter</h3>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          type="email"
          placeholder="Adres e-mail"
          className="px-3 py-2 border border-gray-300 rounded w-full"
        />
        <button className="bg-teal-400 hover:bg-teal-500 text-white px-4 py-2 rounded">
          Zapisz się
        </button>
      </div>
      <div className="mt-4">
        <a
          href="https://www.facebook.com/profile.php?id=61577414364344&locale=pl_PL"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="w-6 h-6 text-black hover:text-blue-600 transition-colors" />
        </a>
      </div>
    </div>
  );
}
