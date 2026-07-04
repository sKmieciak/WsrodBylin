import { Tooltip } from "@mui/material"; // lub dowolna biblioteka / własny tooltip

interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const CategoryItemMobile = ({ label, active, onClick, icon }: Props) => {
  return (
    <Tooltip title={label} arrow>
      <button
        onClick={onClick}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition ${
          active
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        {icon}
      </button>
    </Tooltip>
  );
};

export default CategoryItemMobile;
