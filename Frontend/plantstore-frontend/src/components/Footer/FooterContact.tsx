export default function FooterContact() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Kontakt</h3>
      <p><span className="font-semibold">tel.:</span> 723 047 028</p>
      <p>
        <span className="font-semibold">e-mail:</span>{" "}
        <a href="mailto:Test@test.com" className="text-blue-600 hover:underline">
          Test@test.com
        </a>
      </p>
    </div>
  );
}
