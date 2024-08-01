/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { CSSProperties, useEffect, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "next/router";
import { ArrowDownIcon } from "../../components/SvgIcons";
import Link from "next/link";
import { NextPage } from "next";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { getNftMetaData } from "../../utils/util";
import { RaffleItem } from "../../utils/type";
import LoadingScreen from "../../components/LoadingScreen";
import { errorAlert } from "../../components/ToastGroup";
import { createRaffle } from "../../solana/transaction";
import { DAY, TOKENS } from "../../config";
import SyncLoader from "react-spinners/SyncLoader";
import Propeties from "../../components/Propeties";
import moment from "moment";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const CreateNew: NextPage = () => {
  const router = useRouter();
  const wallet = useWallet();
  const { mint } = router.query;
  const [fetchLoading, setFetchLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [ticketCount, setTicketCount] = useState(30);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [endTimeStamp, setEndTimeStamp] = useState(new Date());

  const [nftData, setNftData] = useState<RaffleItem | null>(null);
  const [attributes, setAttributes] = useState<
    { trait_type: string; value: string }[]
  >([]);

  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).format("YYYY-MM-DDTHH:mm")
  );

  const handleDayClick = (days: number) => {
    const currentDate = new Date();
    const updatedDate = new Date(
      currentDate.setDate(currentDate.getDate() + days)
    );
    const formattedDate = moment(updatedDate).format("YYYY-MM-DDTHH:mm");
    setSelectedDate(formattedDate);
    setEndTimeStamp(new Date(formattedDate));
  };

  const getNFTdetail = async () => {
    setFetchLoading(true);

    if (mint !== undefined) {
      const uri = await getNftMetaData(new PublicKey(mint));
      const data = await fetch(uri)
        .then((resp) => resp.json())
        .catch((error) => {
          console.log(error);
          return null;
        })
        .then((json: any) => {
          setAttributes(json.attributes);
          return {
            mint: mint as string,
            raffleKey: "",
            collection: "",
            name: json.name as string,
            price: 0,
            token: "",
            tokenDecimal: 9,
            image: json.image as string,
            creator: "",
            endTimeStamp: 0,
            createdTimeStamp: 0,
            totalTickets: 0,
            purchasedTickets: 0,
            verified: true,
          };
        });
      setNftData(data);
    }
    setFetchLoading(false);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketCount(e.target.value as unknown as number);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketPrice(e.target.value as unknown as number);
  };

  const [token, setToken] = useState("SOL");

  const handleCreate = async () => {
    if (!wallet.connected || wallet.publicKey === null) {
      errorAlert("Please connect wallet!");
      return;
    } else if (ticketPrice <= 0) {
      errorAlert("Enter correct price!");
      return;
    } else if (ticketCount <= 0) {
      errorAlert("Enter correct ticket count!");
      return;
    } else if (new Date(selectedDate) <= new Date()) {
      errorAlert("Enter correct end date!");
      return;
    } else {
      setBtnLoading(true);
      try {
        await createRaffle(
          wallet,
          new PublicKey(mint as string),
          token === "SOL" ? ticketPrice : 0,
          token === "SOLAPE" ? ticketPrice : 0,
          new Date(selectedDate).getTime() / 1000, //endTimeStamp.getTime() / 1000,
          ticketCount,
          setBtnLoading
        );
        setBtnLoading(false);
      } catch (error) {
        console.log(error);
        setBtnLoading(false);
      }
    }
  };

  useEffect(() => {
    getNFTdetail();
  }, [router]);

  return (
    <>
      <Head>
        <title>KIZ Raffle</title>
        <meta name="description" content="Solan NFT Raffle Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingScreen title="Loading NFT" loading={fetchLoading} />
      <main className="bg-[#0b1418] min-h-screen">
        <Header />
        <div className="mx-auto max-w-[1024px] px-6">
          {nftData && (
            <div className="py-[80px] lg:py-[140px] flex gap-4 lg:gap-6 flex-col md:flex-row">
              <div className="w-full md:w-[300px] lg:w-[400px]">
                <img
                  src={nftData.image}
                  className="rounded-xl w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] object-cover mx-auto"
                  alt=""
                />
                <Propeties attributes={attributes} />
              </div>

              <div className="w-full md:w-[calc(100%-316px)] lg:w-[calc(100%-424px)]">
                {/* collection verified
                <h5 className="text-[#eee] text-md font-500 flex gap-2 items-center">
                  <span title={nftData.verified ? "Verified" : "Unverified"}>
                    <VerifiedIcon
                      color={nftData.verified ? "#86098d" : "#9E9E9E"}
                    />
                  </span>
                  {nftData.collection}
                </h5> */}
                <h1 className="text-[#eee] text-3xl font-500 flex gap-2 items-center text-[32px] leading-[1.5] font-bold">
                  {nftData.name}
                </h1>
                <Link
                  href={`https://solscan.io/token/${nftData.mint}`}
                  passHref
                >
                  <a
                    target="_blank"
                    className="underline text-[#fff] text-sm md:text-md"
                    title="View on Solscan"
                  >
                    {nftData.mint}
                  </a>
                </Link>
                <div className="bg-[#18262d] p-6 rounded-2xl mt-4">
                  <div className="flex flex-row flex-wrap gap-2">
                    <div className="flex flex-col w-[calc(50%-4px)]">
                      <label className="text-[#ccc] uppercase text-sm ">
                        Ticket count
                      </label>
                      <input
                        value={ticketCount}
                        onChange={handleCountChange}
                        type="number"
                        placeholder="Enter the number of tickets"
                        className="px-2 py-1 text-xl text-left mt-2 w-full border border-[#ddd] rounded-lg text-white h-12 bg-[#ffffff20] value-box"
                      />
                    </div>
                    <div className="flex flex-col w-[calc(50%-4px)]">
                      <label className="text-[#ccc] uppercase text-sm ">
                        End Date
                      </label>
                      <input
                        type="datetime-local"
                        value={selectedDate}
                        className="px-2 py-1 text-md text-left mt-2 w-full border border-[#ddd] rounded-lg text-white h-12 bg-[#ffffff20] placeholder:text-md value-box"
                        onChange={(e) =>
                          setSelectedDate(
                            moment(new Date(e.target.value)).format(
                              "YYYY-MM-DDTHH:mm"
                            )
                          )
                        }
                      />
                      <div className="flex items-center justify-between gap-1 mt-2">
                        <button
                          className="border-[#ddd] rounded-lg text-black bg-[#fff] px-4  py-2 font-bold hover:bg-[#ddd] duration-300 transition-all"
                          onClick={() => handleDayClick(1)}
                        >
                          1 Day
                        </button>
                        <button
                          className="border-[#ddd] rounded-lg text-black bg-[#fff] px-4  py-2 font-bold hover:bg-[#ddd] duration-300 transition-all"
                          onClick={() => handleDayClick(3)}
                        >
                          3 Days
                        </button>
                        <button
                          className="border-[#ddd] rounded-lg text-black bg-[#fff] px-4  py-2 font-bold hover:bg-[#ddd] duration-300 transition-all"
                          onClick={() => handleDayClick(7)}
                        >
                          7 Days
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col w-[calc(50%-4px)] mt-1">
                      <label className="text-[#ccc] uppercase text-sm ">
                        ticket price
                      </label>
                      <input
                        value={ticketPrice}
                        onChange={handlePriceChange}
                        step={0.1}
                        min={0}
                        type="number"
                        placeholder="Enter price"
                        className="px-2 py-1 text-xl text-left mt-2 w-full border border-[#ddd] rounded-lg text-white h-12 bg-[#ffffff20] placeholder:text-md value-box"
                      />
                    </div>
                    {/* Dropdown */}
                    <div className="flex flex-col w-[calc(50%-4px)] mt-1">
                      <label className="text-[#ccc] uppercase text-sm ">
                        Select token
                      </label>
                      <div className="group px-2 py-1 text-xl text-left mt-2 w-full relative border border-[#ddd] rounded-lg text-white h-12 bg-[#ffffff20]">
                        <div className="relative text-right pr-7 flex items-center justify-end h-full text-[16px] uppercase">
                          {token}
                          <span className="absolute right-0 top-4">
                            <ArrowDownIcon />
                          </span>
                        </div>
                        <div className="group-hover:flex absolute w-full hidden flex-col left-0 top-11 bg-[#354147] rounded-lg overflow-hidden border border-[#ddd]">
                          {TOKENS.map((token, key) => (
                            <button
                              className="text-right border-t border-[#aaa] w-full py-2 px-8 text-[16px] hover:text-purple-300"
                              onClick={() => setToken(token.tokenSymbol)}
                              key={key}
                            >
                              {token.tokenSymbol}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      className="bg-white uppercase h-[48px] w-[240px] rounded-full px-10 mt-5 text-lg font-bold hover:bg-[#ddd] transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
                      onClick={handleCreate}
                      disabled={btnLoading}
                    >
                      {btnLoading ? (
                        <SyncLoader
                          color={"#000"}
                          loading={btnLoading}
                          size={8}
                        />
                      ) : (
                        "create raffle"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CreateNew;
