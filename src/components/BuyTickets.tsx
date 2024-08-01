import { FC, useCallback, useState } from "react";
import { SyncLoader } from "react-spinners";
import { RaffleItem } from "../utils/type";
import { errorAlert } from "./ToastGroup";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { buyTicket } from "../solana/transaction";

interface Props {
  tickets: number;
  raffleData: RaffleItem;
}
const BuyTickets: FC<Props> = ({ tickets, raffleData }) => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = useCallback(async () => {
    if (tickets <= 0) {
      errorAlert("Invalid tickets count");
      return;
    }
    setIsLoading(true);
    try {
      await buyTicket(
        wallet,
        new PublicKey(raffleData.raffleKey),
        tickets,
        setIsLoading
      );
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [raffleData, tickets, wallet]);
  return (
    <div className="text-center">
      <button
        className="h-[52px] w-full px-8 bg-[#fff] font-bold rounded-full md:w-[340px] text-lg md:text-xl transition-all duration-300 hover:bg-[#ddd] disabled:cursor-not-allowed"
        disabled={isLoading}
        onClick={handleBuy}
      >
        {isLoading ? (
          <SyncLoader color={"#000"} loading={isLoading} size={8} />
        ) : (
          <>
            Buy {tickets} ticket{tickets === 1 ? "" : "s"} for{" "}
            {(tickets * raffleData.price).toLocaleString()} {raffleData.token}
          </>
        )}
      </button>
    </div>
  );
};

export default BuyTickets;
