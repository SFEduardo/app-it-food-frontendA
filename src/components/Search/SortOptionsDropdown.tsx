import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { buttonVariants } from "../ui/button";
type Props = {
  onChange: (value: string) => void;
  sortOption: string;
};

const SORT_OPTIONS = [
  {
    label: "Mejor coincidencia",
    value: "bestMatch",
  },
  {
    label: "Precio de entrega",
    value: "deliverPrice",
  },
  {
    label: "Tiempo estimado de entrega",
    value: "estimatedDeliveryTime",
  },
];

const SortOptionsDropdown = ({ onChange, sortOption }: Props) => {
  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortOption)?.label ||
    SORT_OPTIONS[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline", className: "cursor-pointer" })}>
        Ordenar por: {selectedSortLabel}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 space-y-2" sideOffset={8}>
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            className="cursor-pointer py-2"
            onClick={() => onChange(option.value)}
            key={option.value}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortOptionsDropdown;
