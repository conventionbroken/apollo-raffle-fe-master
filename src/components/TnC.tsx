import { FC } from "react";

const TnC: FC = () => {
  return (
    <div className=" bg-[#18262d] p-6 rounded-2xl mt-4">
      <h5 className="text-xl font-bold text-white">Terms & Conditions</h5>
      <ul className="pl-6 text-sm text-[#ddd] list-decimal flex flex-col gap-2 mt-2">
        <li>Here&#39;s a guide to buy into raffles.</li>
        <li>
          All NFT prizes are held by rafffle in escrow and can be claimed by the
          winner or creator once the draw is done.
        </li>
        <li>Raffle tickets cannot be refunded once bought.</li>
        <li>
          Raffle tickets will not be refunded if you did not win the raffle.
        </li>
        <li>You can only buy 20% of total tickets.</li>
        <li>You&#39;ll be charged 1% fees for swapping through Jupiter.</li>
        <li>
          FFF receives a portion of the fees generated for anyone utilizing the
          Raven services through our website.
        </li>
      </ul>
    </div>
  );
};

export default TnC;
