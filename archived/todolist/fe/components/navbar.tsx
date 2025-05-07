import React from "react";
import { WalletSelector } from "./connect-wallet";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full bg-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-[1280px] flex items-center justify-between">
        <Link href={"/"}>
          <p className="text-2xl font-bold">Black Market</p>
        </Link>
        <div className="flex items-center gap-4">
          <Link href={"/create"}>
            <p className="text-sm">Create</p>
          </Link>
          <Link href={"/my-nft"}>
            <p className="text-sm">My NFTs</p>
          </Link>
          <WalletSelector />
        </div>
      </div>
    </div>
  );
}
