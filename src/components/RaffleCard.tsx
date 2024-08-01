/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { FC, useMemo } from "react";
import { RaffleItem } from "../utils/type";
import { VerifiedIcon } from "./SvgIcons";
import Link from "next/link";
import Countdown from "./Countdown";
import { useWindowSize } from "react-use";
import { useRouter } from "next/router";
import moment from "moment";

interface Props {
  raffle: RaffleItem;
  className: string;
  isNew?: boolean;
  tab?: string;
  getAllData?: any;
}
const RaffleCard: FC<Props> = ({ raffle, isNew, tab, getAllData }) => {
  const {
    image,
    name,
    price,
    token,
    raffleKey,
    mint,
    endTimeStamp,
    totalTickets,
    purchasedTickets,
  } = raffle;

  const { width } = useWindowSize();
  const router = useRouter();

  const isEnd = endTimeStamp < new Date().getTime();

  const cardWidth = useMemo(() => {
    if (width >= 1536) {
      return (1536 - 24 * 3 - 48) / 4 - 0;
    } else if (width > 1240 && width < 1536) {
      return (width - 48 - 26 * 3) / 4 - 2;
    } else {
      return (width - 48 - 26 * 3) / 3 - 2;
    }
  }, [width, router]);

  return (
    <div
      className="rounded-3xl border-[1px] border-[#aaa] bg-[#18262d] overflow-hidden group m-2"
      style={{ width: cardWidth }}
    >
      <Link href={!isNew ? `/raffle/${raffleKey}` : `/new/${mint}`} passHref>
        <div
          className="relative overflow-hidden cursor-pointer"
          style={{ width: cardWidth, height: cardWidth }}
        >
          <img
            src={image}
            className="object-cover transition-all duration-300 group-hover:scale-110"
            style={{
              width: cardWidth,
              height: cardWidth,
              filter: `grayscale(${isEnd && !isNew ? 1 : 0})`,
            }}
            alt={name}
          />
          {!isEnd ? (
            <Countdown
              endTimestamp={endTimeStamp}
              className="absolute right-4 top-4 flex border border-[#000] bg-[#000000aa] text-lg gap-1 px-3 text-green-400 h-10 items-center"
              completed={getAllData}
            />
          ) : (
            !isNew && (
              <div className="absolute right-4 top-4 flex border border-[#000] bg-[#000000aa] text-lg gap-1 px-3 text-red-400 h-10 items-center">
                Ended in:&nbsp;{moment(endTimeStamp).fromNow()}
              </div>
            )
          )}
        </div>
      </Link>
      <div className="px-5 py-4">
        <div className="">
          {/* <p className="text-[#eee] text-md font-500 flex gap-2 items-center">
            <span title={verified ? "Verified" : "Unverified"}>
              <VerifiedIcon color={verified ? "#86098d" : "#9E9E9E"} />
            </span>
            {collection}
          </p> */}
          <p className="text-[#eee] text-lg font-500 flex gap-2 items-center">
            {name}
          </p>
          {!isNew && (
            <>
              <div className="flex items-center justify-between">
                <div className="my-2 text-left text-white">
                  <p className="text-xl font-bold">
                    {purchasedTickets} / {totalTickets}
                  </p>
                  <p className="text-sm text-[#aaa]">
                    {isEnd ? "Ended" : "Tickets sold"}
                  </p>
                </div>
                <div className="my-2 text-right text-white">
                  <p className="text-xl font-bold">
                    {price} {token}
                  </p>
                  <p className="text-sm text-[#aaa]">Ticket Price</p>
                </div>
              </div>
              <div className="flex w-full gap-2 pb-2">
                <Link href={`/raffle/${raffleKey}`} passHref>
                  <div className="border grid place-content-center border-white h-12 rounded-lg bg-white uppercase w-full font-bold  transition-all duration-300 hover:bg-[#ddd] cursor-pointer">
                    view raffle
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaffleCard;
