/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { NextPage } from "next";
import axios from "axios";
import Header from "../components/Header";
import Head from "next/head";
import RaffleCard from "../components/RaffleCard";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import { solConnection } from "../utils/util";
import { RaffleItem } from "../utils/type";
import LoadingScreen from "../components/LoadingScreen";

const CreatePage: NextPage = () => {
  const wallet = useWallet();
  const [nfts, setNfts] = useState<RaffleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllNfts = useCallback(async () => {
    if (wallet.publicKey === null) return;
    setIsLoading(true);
    try {
      const nftList: RaffleItem[] = [];
      const originList = await getParsedNftAccountsByOwner({
        publicAddress: wallet.publicKey.toBase58(),
        connection: solConnection,
      });

      console.log("originList", originList);

      const uriPromises = originList.map((item) =>
        axios.get(item.data.uri).catch((error) => ({ error }))
      );

      const uriData = await Promise.allSettled(uriPromises);

      const responseData = uriData.map((result: any) => {
        if (result.status === "fulfilled") {
          return result.value.data;
        } else {
          console.log("Error fetching URI:", result.reason);
          return null; // or handle the error as needed
        }
      });

      for (let i = 0; i < originList.length; i++) {
        nftList.push({
          mint: originList[i].mint,
          raffleKey: "",
          collection: "",
          name: originList[i].data.name,
          price: 0,
          token: "",
          tokenDecimal: 9,
          image: responseData[i]?.image,
          creator: "",
          endTimeStamp: 0,
          createdTimeStamp: 0,
          totalTickets: 0,
          purchasedTickets: 0,
          verified: true,
        });
      }

      console.log("nftList", nftList);
      setNfts(nftList);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [wallet]);

  useEffect(() => {
    getAllNfts();
  }, [wallet.publicKey, wallet.connected]);

  return (
    <>
      <Head>
        <title>Create | KIZ Raffle</title>
        <meta name="description" content="Solan NFT Raffle Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-[#0b1418] min-h-screen">
        <Header />
        <div className="py-[140px] max-w-[1536px] mx-auto px-6">
          <h1 className="my-2 text-3xl font-bold text-white">
            Create New Raffle
          </h1>
          <p className="text-sm text-[#ddd] my-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at
            tellus quis ex pretium semper sed vitae risus. Nulla aliquet
            pulvinar mattis. Donec ac mauris sem.
          </p>
          <div className="flex flex-wrap">
            {isLoading && (
              <LoadingScreen
                title="Fetching NFTs in your wallet"
                loading={isLoading}
              />
            )}
            {nfts.map((item, key) => (
              <RaffleCard raffle={item} className="" key={key} isNew />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default CreatePage;
