export default function FooterLinks() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Informacje</h3>
      <ul className="space-y-1">
        <li><a href="/regulamin" className="hover:underline">Regulamin</a></li>
        <li><a href="/polityka-prywatnosci" className="hover:underline">Polityka prywatności</a></li>
      </ul>
    </div>
  );
}
