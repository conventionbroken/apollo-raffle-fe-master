/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "next/router";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { MinusIcon, PlusIcon } from "../../components/SvgIcons";
import Link from "next/link";
import Countdown from "../../components/Countdown";
import { NextPage } from "next";
import moment from "moment";
import { getStateByKey } from "../../solana/transaction";
import {
  getAddressCounts,
  getNftMetaData,
  solConnection,
} from "../../utils/util";
import { EMPTY_USER, PROGRAM_ID } from "../../config";
import { RaffleItem } from "../../utils/type";
import LoadingScreen from "../../components/LoadingScreen";
import { useWallet } from "@solana/wallet-adapter-react";
import RevealWinner from "../../components/RevealWinner";
import Propeties from "../../components/Propeties";
import TnC from "../../components/TnC";
import Participants from "../../components/Participants";
import WinnerBox from "../../components/WinnerBox";
import Withdraw from "../../components/Withdraw";
import BuyTickets from "../../components/BuyTickets";

const RaffleDetail: NextPage = () => {
  const router = useRouter();
  const wallet = useWallet();
  const { raffleKey } = router.query;
  const [attributes, setAttributes] = useState<
    { trait_type: string; value: string }[]
  >([]);
  const [tickets, setTickets] = useState(3);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [raffleData, setRaffleData] = useState<RaffleItem>();
  const [force, setForce] = useState(false);

  const getRaffleDatail = async (showLoading: boolean) => {
    if (showLoading) setFetchLoading(true);
    if (raffleKey?.length !== 44) return;
    try {
      const raffleData = await getStateByKey(
        new PublicKey(raffleKey as string)
      );
      if (raffleData === null) {
        return;
      }
      const mint = raffleData.nftMint;
      const uri = await getNftMetaData(new PublicKey(mint));
      const { image, name } = await fetch(uri)
        .then((resp) => resp.json())
        .catch((error) => {
          console.log(error);
          return { image: "", name: "" };
        })
        .then((json: any) => {
          setAttributes(json.attributes);
          return {
            name: json.name as string,
            image: json.image as string,
          };
        });
      const puchased: string[] = [];
      for (let i = 0; i < raffleData.count.toNumber(); i++) {
        puchased.push(raffleData.entrants[i].toBase58());
      }
      setRaffleData({
        mint: mint.toBase58(),
        raffleKey: raffleKey as string,
        collection: "",
        name: name,
        price:
          raffleData.ticketPriceApe.toNumber() === 0
            ? raffleData.ticketPriceSol.toNumber() / LAMPORTS_PER_SOL
            : raffleData.ticketPriceApe.toNumber() / LAMPORTS_PER_SOL,
        token: raffleData.ticketPriceApe.toNumber() === 0 ? "SOL" : "SOLAPE",
        tokenDecimal: 9,
        image: image,
        creator: raffleData.creator.toBase58(),
        endTimeStamp: raffleData.endTimestamp.toNumber() * 1000,
        createdTimeStamp: 0,
        totalTickets: raffleData.maxEntrants.toNumber(),
        purchasedTickets: raffleData.count.toNumber(),
        entrants: puchased,
        whitelisted: raffleData.whitelisted.toNumber(),
        winner: raffleData.winner.toBase58(),
        verified: true,
      });
      setFetchLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTicketsChange = (e: any) => {
    setTickets(e.target.value as unknown as number);
    setForce(!force);
  };

  const isEnd =
    raffleData?.endTimeStamp && raffleData.endTimeStamp < new Date().getTime();

  const participants = useMemo(() => {
    console.log(raffleData);
    if (raffleData?.entrants) {
      return getAddressCounts(raffleData.entrants);
    } else {
      return [];
    }
  }, [raffleData]);

  const incValue = () => {
    let cnt = tickets;
    cnt++;
    setTickets(cnt);
  };

  const decValue = () => {
    let cnt = tickets;
    cnt--;
    setTickets(cnt);
  };

  useEffect(() => {
    getRaffleDatail(true);
    solConnection.onLogs(
      new PublicKey(PROGRAM_ID),
      async () => await getRaffleDatail(false)
    );
  }, [router]);

  const calculateRaffleStatus = useMemo(() => {
    if (!raffleData) {
      return {
        isRevealAble: false,
        isWithdrawAble: false,
      };
    }

    const { endTimeStamp, purchasedTickets, winner, whitelisted } = raffleData;
    const now = new Date().getTime();

    const isRevealAble =
      endTimeStamp <= now && winner === EMPTY_USER && purchasedTickets !== 0;

    const isWithdrawAble =
      endTimeStamp <= now &&
      wallet.publicKey?.toBase58() === raffleData.creator &&
      winner === EMPTY_USER &&
      purchasedTickets === 0 &&
      whitelisted !== 3;

    return {
      isRevealAble,
      isWithdrawAble,
    };
  }, [raffleData]);

  const { isRevealAble, isWithdrawAble } = calculateRaffleStatus;

  return (
    <>
      <Head>
        <title>KIZ Raffle</title>
        <meta name="description" content="Solan NFT Raffle Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingScreen title="Fetching Raffle Data" loading={fetchLoading} />
      <main className="bg-[#0b1418] min-h-screen">
        <Header />
        {!fetchLoading && (
          <div className="mx-auto max-w-[1024px] px-6">
            {raffleData && (
              <div className="py-[80px] lg:py-[140px] flex gap-4 lg:gap-6 flex-col md:flex-row">
                <div className="w-[300px] lg:w-[400px]  mx-auto relative overflow-hidden">
                  {isEnd && (
                    <div className="absolute z-10 w-[240px] text-2xl py-1 font-black bg-red-800 text-white text-center -rotate-45 -left-20 top-5">
                      Ended
                    </div>
                  )}
                  <img
                    src={raffleData.image}
                    className="rounded-xl w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] object-cover mx-auto"
                    alt=""
                  />
                  <WinnerBox
                    raffleData={raffleData}
                    participants={participants}
                  />
                  <Propeties attributes={attributes} />
                </div>

                <div className="w-full md:w-[calc(100%-316px)] lg:w-[calc(100%-424px)]">
                  <h1 className="text-[#eee] text-3xl font-500 flex gap-2 items-center text-[32px] leading-[1.5] font-bold">
                    {raffleData.name}
                  </h1>
                  <Link
                    href={`https://solscan.io/token/${raffleData.mint}`}
                    passHref
                  >
                    <a
                      target="_blank"
                      className="underline text-[#fff] text-sm md:text-md"
                      title="View on Solscan"
                    >
                      {raffleData.mint}
                    </a>
                  </Link>
                  <div className=" bg-[#18262d] p-6 rounded-2xl mt-4">
                    {!isEnd && (
                      <BuyTickets tickets={tickets} raffleData={raffleData} />
                    )}
                    {isWithdrawAble && (
                      <Withdraw
                        raffleKey={raffleData.raffleKey}
                        mint={raffleData.mint}
                      />
                    )}
                    {isRevealAble && (
                      <RevealWinner
                        raffleKey={raffleKey as string}
                        getData={async () => await getRaffleDatail(true)}
                      />
                    )}
                    <div className="flex flex-col items-center justify-between mt-4 md:flex-row">
                      {!isEnd ? (
                        <div className="flex items-center justify-between w-full h-12 gap-4 md:w-2/5">
                          <button
                            className="grid w-6 h-6 place-content-center"
                            onClick={decValue}
                          >
                            <MinusIcon color="#fff" />
                          </button>
                          <input
                            value={tickets}
                            onChange={handleTicketsChange}
                            min={1}
                            max={
                              raffleData.totalTickets -
                              raffleData.purchasedTickets
                            }
                            className="px-2 w-[120px] py-1 text-2xl text-center border border-[#ddd] rounded-full text-white h-full bg-[#ffffff20] "
                            type="number"
                          />
                          <button
                            className="grid w-6 h-6 place-content-center"
                            onClick={incValue}
                          >
                            <PlusIcon color="#fff" />
                          </button>
                        </div>
                      ) : (
                        <p className="flex items-center w-full h-12 text-white md:justify-start md:w-3/5">
                          Tickets sold :&nbsp;
                          <span className="ml-2 text-2xl font-bold">
                            {raffleData.purchasedTickets}/
                            {raffleData.totalTickets}
                          </span>
                        </p>
                      )}
                      <p className="flex items-center justify-center w-full h-12 text-white md:justify-end md:w-3/5">
                        Ticket Price:&nbsp;
                        <span className="ml-2 text-2xl font-bold">
                          {raffleData.price} {raffleData.token}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className=" bg-[#18262d] p-6 rounded-2xl mt-4">
                    <div className="flex flex-wrap justify-between">
                      <div className="">
                        <h5 className="text-xl font-bold text-white">
                          Details
                        </h5>
                        {!isEnd ? (
                          <div className="flex items-center gap-2 text-xl text-white">
                            End time:
                            <Countdown
                              endTimestamp={raffleData.endTimeStamp}
                              className="inline-flex gap-2 text-xl text-white"
                              completed={getRaffleDatail}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xl text-white">
                            Ended in:
                            <span className="inline-flex gap-2 text-xl text-white">
                              {/* {moment(raffleData.endTimeStamp).format(
                                "MM/DD/YYYY hh:mm A"
                              )} */}
                              {moment(raffleData.endTimeStamp).fromNow()}
                            </span>
                          </div>
                        )}
                      </div>
                      {!isEnd && (
                        <div className="flex flex-col items-end text-left text-white lg:text-right">
                          <h5 className="text-xl font-bold text-left lg:text-right">
                            Tickets Sold
                          </h5>
                          <div className="flex items-center gap-2 text-xl">
                            {raffleData.purchasedTickets}/
                            {raffleData.totalTickets}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {participants.length !== 0 && (
                    <Participants participants={participants} />
                  )}
                  <TnC />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default RaffleDetail;
