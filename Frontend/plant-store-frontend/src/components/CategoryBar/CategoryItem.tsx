interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function CategoryItem({ label, active, onClick }: Props) {
  return (
    <button
      className={`inline-flex items-center gap-1 text-lg font-medium transition ${
        active
          ? "text-green-700 underline underline-offset-4"
          : "text-gray-800 hover:text-green-600 hover:underline underline-offset-4"
      }`}
      onClick={onClick}
    >
      <span>{label}</span>
      <svg
        className="text-gray-500 mt-[1px]"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}
