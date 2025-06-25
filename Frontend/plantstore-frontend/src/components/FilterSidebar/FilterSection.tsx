interface Props {
  title: string;
  children: React.ReactNode;
}

export default function FilterSection({ title, children }: Props) {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {title}
      </label>
      {children}
    </div>
  );
}
