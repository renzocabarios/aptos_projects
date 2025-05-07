"use client";
import useGetMyNft from "@/hooks/read/useGetMyNft";
import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useListNft from "@/hooks/write/useListNft";
import Link from "next/link";
import useDelistNft from "@/hooks/write/useDelistNft";

export default function MyNft() {
  const { data: nfts } = useGetMyNft();

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[1440px] flex items-center justify-between">
        {nfts?.map((e) => {
          return (
            <div key={e.id} className="flex flex-col gap-2">
              <div className="w-full flex items-center justify-center p-4 bg-slate-500">
                <Image src={e.uri} alt="image" width={100} height={100}></Image>
              </div>

              <p className="text-2xl font-semibold">{e.name}</p>
              <p className="text-sm ">{e.description}</p>

              <Link href={`/nft/${e.id}`}>
                <Button>View NFT</Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
