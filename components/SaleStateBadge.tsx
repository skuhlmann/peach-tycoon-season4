import { SALE_STATE } from "@/lib/constants";

export default function SaleStateBadge() {
  const state = SALE_STATE;

  const config = {
    upcoming: {
      label: "• COMING SOON •",
      color: "bg-brand-blue text-brand-black",
    },
    ongoing: {
      label: "• SALE OPEN •",
      color: "bg-brand-green text-brand-black",
    },
    closed: {
      label: "• SOLD OUT •",
      color: "bg-brand-red text-brand-black",
    },
  }[state];

  return (
    <span
      className={`inline-block w-[200px] text-center px-5 h-[34px] leading-[2.5] ${config.color} font-display font-bold uppercase text-sm rounded-full`}
    >
      {config.label}
    </span>
  );
}
