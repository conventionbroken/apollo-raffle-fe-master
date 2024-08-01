import { useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useState } from "react";
import { SyncLoader } from "react-spinners";
import { revealWinner, withdrawNft } from "../solana/transaction";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";

interface Props {
  raffleKey: string;
  mint: string;
}
const Withdraw: FC<Props> = ({ raffleKey, mint }) => {
  const wallet = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      await withdrawNft(
        wallet,
        new PublicKey(mint),
        new PublicKey(raffleKey),
        setIsLoading
      );
      router.push("/create");
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="mb-4 text-sm text-red-500">
        The raffle time has ended. But no one buys tickets 😫. You can withdraw
        NFT.
      </p>
      <button
        className="h-[52px] w-full px-8 bg-[#fff] font-bold rounded-full md:w-[340px] text-lg md:text-xl transition-all duration-300 hover:bg-[#ddd] disabled:cursor-not-allowed"
        disabled={isLoading}
        onClick={handleWithdraw}
      >
        {isLoading ? (
          <SyncLoader color={"#000"} loading={isLoading} size={8} />
        ) : (
          <>Withdraw NFT</>
        )}
      </button>
    </div>
  );
};

export default Withdraw;
