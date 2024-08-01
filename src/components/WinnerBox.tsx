import { FC, useMemo, useState } from "react";
import { RaffleItem } from "../utils/type";
import { EMPTY_USER } from "../config";
import { AddressCount } from "../utils/util";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { SyncLoader } from "react-spinners";
import { claimReward } from "../solana/transaction";
import { PublicKey } from "@solana/web3.js";

interface Props {
  raffleData: RaffleItem;
  participants: AddressCount[];
}
const WinnerBox: FC<Props> = ({ raffleData, participants }) => {
  const wallet = useWallet();

  const isWinner = useMemo(() => {
    return (
      wallet.publicKey && raffleData.winner === wallet.publicKey.toBase58()
    );
  }, [raffleData, wallet]);

  const isCliamed = useMemo(() => {
    return raffleData.whitelisted === 4;
  }, [raffleData]);

  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    try {
      await claimReward(
        wallet,
        new PublicKey(raffleData.mint),
        new PublicKey(raffleData.raffleKey),
        setIsLoading
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {raffleData.winner && raffleData.winner !== EMPTY_USER && (
        <div className="flex flex-col items-center justify-center p-5 mt-5 text-orange-300 border-2 border-orange-300 rounded-xl">
          {isWinner ? (
            <>
              <p className="font-bold text-md">Congratulation!</p>
              <h5 className="text-3xl font-black">You Won!</h5>
            </>
          ) : (
            <>
              <p className="font-bold text-md">Raffle Winner</p>
              <Link
                href={`https://solscan.io/account/${raffleData.winner}`}
                passHref
              >
                <a
                  className="text-3xl font-black cursor-pointer hover:underline"
                  target="_blank"
                >
                  {raffleData.winner?.slice(0, 4)}...
                  {raffleData.winner?.slice(-4)}
                </a>
              </Link>
            </>
          )}
          <p className="font-bold text-md">
            {`Won with ${
              participants.find((item) => item.address === raffleData.winner)
                ?.count
            } Ticket(s)`}
          </p>
          {isWinner && !isCliamed && (
            <button
              className="h-[52px] w-full px-8 bg-orange-400 font-bold rounded-full md:w-[340px] text-lg md:text-xl transition-all duration-300 hover:bg-orange-500 disabled:cursor-not-allowed mt-3 text-[#000]"
              disabled={isLoading}
              onClick={handleClaim}
            >
              {isLoading ? (
                <SyncLoader color={"#000"} loading={isLoading} size={8} />
              ) : (
                <>Claim Reward</>
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default WinnerBox;
