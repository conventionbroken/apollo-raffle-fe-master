import { FC } from "react";

interface TabBarProps {
  tab: string;
  setTab: Function;
}
const TabBar: FC<TabBarProps> = ({ tab, setTab }) => {
  return (
    <div className="flex gap-3 mb-3">
      <button
        title="View active raffles"
        className={`w-[180px] h-12 rounded-full uppercase font-bold text-xl duration-300 transition-all ${
          tab === "featured"
            ? "bg-[#6a0070] text-white hover:bg-[#630968]"
            : "bg-[#fff] text-black hover:bg-[#ddd]"
        }`}
        onClick={() => setTab("featured")}
      >
        featured
      </button>
      <button
        title="View all raffles"
        className={`w-[180px] h-12 rounded-full uppercase font-bold text-xl duration-300 transition-all ${
          tab === "all"
            ? "bg-[#6a0070] text-white hover:bg-[#630968]"
            : "bg-[#fff] text-black hover:bg-[#ddd]"
        }`}
        onClick={() => setTab("all")}
      >
        all raffles
      </button>
      <button
        title="View ended raffles"
        className={`w-[180px] h-12 rounded-full uppercase font-bold text-xl duration-300 transition-all ${
          tab === "past"
            ? "bg-[#6a0070] text-white hover:bg-[#630968]"
            : "bg-[#fff] text-black hover:bg-[#ddd]"
        }`}
        onClick={() => setTab("past")}
      >
        past raffels
      </button>
    </div>
  );
};

export default TabBar;
