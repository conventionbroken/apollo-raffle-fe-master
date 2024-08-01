import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import RaffleCard from "../components/RaffleCard";
import TabBar from "../components/TabBar";
import { getNftMetaData, solConnection } from "../utils/util";
import { PublicKey } from "@metaplex-foundation/js";
import { PROGRAM_ID } from "../config";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAllData } from "../solana/transaction";
import RaffleCardSkeleton from "../components/RaffleCardSkeleton";
import { RaffleItem } from "../utils/type";

export default function Home() {
  const [tab, setTab] = useState("featured");

  const [loading, setLoading] = useState(false);
  const [raffles, setRaffles] = useState<RaffleItem[]>([]);

  

  // const getAllNfts = async (showLoading: boolean) => {
  //   if (showLoading) setLoading(true);
  //   const data = await getAllData();

  //   const metaPromises = data.map(async (item) => {
  //     const uri = await getNftMetaData(new PublicKey(item.nftMint));
  //     return fetch(uri)
  //       .then((resp) => resp.json())
  //       .catch((error) => {
  //         console.error(error);
  //         return { image: "", name: "" };
  //       });
  //   });

  //   const metadata = await Promise.allSettled(metaPromises);

  //   const raffles = data.map((item, i) => {
  //     const metaDataResult = metadata[i];
  //     const metaData =
  //       metaDataResult.status === "fulfilled"
  //         ? metaDataResult.value
  //         : { image: "", name: "" };

  //     return {
  //       mint: item.nftMint,
  //       raffleKey: item.raffleKey,
  //       collection: "",
  //       name: metaData.name,
  //       price:
  //         item.ticketPriceApe === 0
  //           ? item.ticketPriceSol / LAMPORTS_PER_SOL
  //           : item.ticketPriceApe / LAMPORTS_PER_SOL,
  //       token: item.ticketPriceApe === 0 ? "SOL" : "SOLAPE",
  //       tokenDecimal: 9,
  //       image: metaData.image,
  //       creator: item.creator,
  //       endTimeStamp: item.endTimestamp * 1000,
  //       createdTimeStamp: 0,
  //       totalTickets: item.maxEntrants,
  //       purchasedTickets: item.entrants.length,
  //       verified: true,
  //       winner: item.winner,
  //       entrants: item.entrants,
  //       whitelisted: item.whitelisted,
  //     };
  //   });

  //   setRaffles(raffles);
  //   setLoading(false);
  // };

  const getAllNfts = async (showLoading: boolean) => {
    if (showLoading) setLoading(true);
    const data = await getAllData();

    // Ensure data is an array before calling map
    const metaPromises = (Array.isArray(data) ? data : []).map(async (item) => {
      const uri = await getNftMetaData(new PublicKey(item.nftMint));
      return fetch(uri)
        .then((resp) => resp.json())
        .catch((error) => {
          console.error(error);
          return { image: "", name: "" };
        });;
    });;

    const metadata = await Promise.allSettled(metaPromises);

    const raffles = (Array.isArray(data) ? data : []).map((item, i) => {
      const metaDataResult = metadata[i];
      const metaData =
        metaDataResult.status === "fulfilled"
          ? metaDataResult.value
          : { image: "", name: "" };

      return {
        mint: item.nftMint,
        raffleKey: item.raffleKey,
        collection: "",
        name: metaData.name,
        price:
          item.ticketPriceApe === 0
            ? item.ticketPriceSol / LAMPORTS_PER_SOL
            : item.ticketPriceApe / LAMPORTS_PER_SOL,
        token: item.ticketPriceApe === 0 ? "SOL" : "SOLAPE",
        tokenDecimal: 9,
        // Ensure the rest of your code follows
  }});
    // Continue with the rest of your function...
};

  const visibleRaffles = useMemo(() => {
    if (tab === "featured") {
      return raffles
        .filter((item) => item.endTimeStamp > new Date().getTime())
        .sort((a, b) => b.endTimeStamp - a.endTimeStamp);
    } else if (tab === "past") {
      return raffles
        .filter((item) => item.endTimeStamp <= new Date().getTime())
        .sort((a, b) => b.endTimeStamp - a.endTimeStamp);
    } else {
      return raffles.sort((a, b) => b.endTimeStamp - a.endTimeStamp);
    }
  }, [tab, raffles]);

  useEffect(() => {
    getAllNfts(true);
    solConnection.onLogs(
      new PublicKey(PROGRAM_ID),
      async () => await getAllNfts(false)
    );
  }, []);
  return (
    <>
      <Head>
        <title>KIZ Raffle</title>
        <meta name="description" content="Solan NFT Raffle Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-[#0b1418] min-h-screen">
        <Header />
        <div className="max-w-[1536px] mx-auto px-6 py-[140px]">
          <TabBar tab={tab} setTab={setTab} />
          <div className="flex flex-wrap ">
            {loading
              ? Array.from({ length: 4 }).map((_, key) => (
                  <RaffleCardSkeleton key={key} />
                ))
              : visibleRaffles.map((item, key) => (
                  <RaffleCard
                    raffle={item}
                    className=""
                    key={key}
                    tab={tab}
                    getAllData={() => getAllNfts(false)}
                  />
                ))}
          </div>
        </div>
      </main>
    </>
  );
}
