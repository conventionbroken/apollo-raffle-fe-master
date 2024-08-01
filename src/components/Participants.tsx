import { FC } from "react";
import { AddressCount } from "../utils/util";

export interface ParticipantsType {
  participants: AddressCount[];
}
const Participants: FC<ParticipantsType> = ({ participants }) => {
  return (
    <div className=" bg-[#18262d] p-6 rounded-2xl mt-4">
      <h5 className="text-xl font-bold text-white">
        Participants ({participants.length})
      </h5>
      <div className="flex flex-col items-center mt-2 text-2xl text-white">
        {participants.map((item, key) => (
          <div
            className="flex items-center justify-between w-full text-sm py-3 border-t border-[#999]"
            key={key}
          >
            <p className="">{item.address}</p>
            <p>{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;
