/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { CloseIcon, MenuIcon } from "./SvgIcons";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="absolute top-0 left-0 z-30 w-full px-4 py-3 mt-0 lg:py-10">
      <div className="container flex items-center justify-between mx-auto max-w-[1024px]">
        <div className="lg:bg-[#fff] py-2 rounded-[100px] px-0 lg:px-[40px] flex gap-[60px] items-center  mr-4 md:mr-0">
          <Link href="/" passHref>
            <div className="font-black cursor-pointer text-[40px] leading-10 text-white lg:text-black">
              KIZ
            </div>
          </Link>
          <nav className="hidden lg:block">
            <ul className="flex gap-9">
              <li className="font-bold uppercase text-md hover:text-[#9C27B0]">
                <Link href="/">Home</Link>
              </li>
              <li className="font-bold uppercase text-md hover:text-[#9C27B0]">
                <Link href="/create">Create</Link>
              </li>
              <li className="font-bold uppercase text-md hover:text-[#9C27B0]">
                <Link href="#">Link</Link>
              </li>
              <li className="font-bold uppercase text-md hover:text-[#9C27B0]">
                <Link href="#">Link</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center">
          <WalletMultiButton />
          <button
            className="block -mr-2 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {!isOpen ? <MenuIcon /> : <CloseIcon />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen py-3 bg-black">
          <div className="flex items-center justify-between px-4">
            <div className="lg:bg-[#fff] py-3 rounded-[100px] px-1 lg:px-[70px] flex gap-[60px] items-center mr-4 md:mr-0">
              <div className="font-black cursor-pointer text-[40px] leading-10 text-white lg:text-black">
                KIZ
              </div>
            </div>
            <div className="flex items-center">
              <WalletMultiButton />
              <button
                className="block -mr-2 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {!isOpen ? <MenuIcon /> : <CloseIcon />}
              </button>
            </div>
          </div>
          <nav className="block lg:hidden">
            <ul className="flex flex-col items-center pt-20 gap-9">
              <li
                className="uppercase text-[16px] text-[#fff]"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/">Home</Link>
              </li>
              <li
                className="uppercase text-[16px] text-[#fff]"
                onClick={() => setIsOpen(false)}
              >
                <Link href="#">Create</Link>
              </li>
              <li
                className="uppercase text-[16px] text-[#fff]"
                onClick={() => setIsOpen(false)}
              >
                <Link href="#">Link</Link>
              </li>
              <li
                className="uppercase text-[16px] text-[#fff]"
                onClick={() => setIsOpen(false)}
              >
                <Link href="#">Link</Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
