import { FC } from "react";

interface Props {
  attributes: { trait_type: string; value: string }[];
}

const Propeties: FC<Props> = ({ attributes }) => {
  return (
    <div className="w-full bg-[#18262d] p-4 md:p-6 rounded-2xl mt-4 lg:mt-6">
      <h5 className="text-xl font-bold text-white">Propeties</h5>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {attributes &&
          attributes.length !== 0 &&
          attributes.map((item, key) => (
            <div
              className="relative px-4 pt-5 pb-2 border border-[#ffffff30] rounded-xl text-md text-right text-white"
              key={key}
            >
              <span className="text-xs text-[#aaa] uppercase absolute left-2 top-1">
                {item.trait_type}
              </span>
              {item.value}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Propeties;
