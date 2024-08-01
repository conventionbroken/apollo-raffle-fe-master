import { useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useState } from "react";
import { SyncLoader } from "react-spinners";
import { revealWinner } from "../solana/transaction";
import { PublicKey } from "@solana/web3.js";

interface Props {
  raffleKey: string;
  getData: Function;
}
const RevealWinner: FC<Props> = ({ raffleKey, getData }) => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const handleReveal = async () => {
    setIsLoading(true);
    try {
      await revealWinner(wallet, new PublicKey(raffleKey), setIsLoading);
      await getData();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="mb-4 text-sm text-green-300">
        A button must be clicked to display the winner. Don&#39;t worry,
        it&#39;s free 😁
      </p>
      <button
        className="h-[52px] w-full px-8 bg-[#fff] font-bold rounded-full md:w-[340px] text-lg md:text-xl transition-all duration-300 hover:bg-[#ddd] disabled:cursor-not-allowed"
        disabled={isLoading}
        onClick={handleReveal}
      >
        {isLoading ? (
          <SyncLoader color={"#000"} loading={isLoading} size={8} />
        ) : (
          <>Reveal winner</>
        )}
      </button>
    </div>
  );
};

export default RevealWinner;
