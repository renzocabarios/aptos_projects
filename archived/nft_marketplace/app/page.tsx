"use client";

import { Button } from "@/components/ui/button";
import useGetAllNftsForSale from "@/hooks/read/useGetAllNftsForSale";
import usePurchaseNft from "@/hooks/write/usePurchaseNft";
import Image from "next/image";

export default function Home() {
  const { data: nfts } = useGetAllNftsForSale();
  const { mutate: purchaseNft } = usePurchaseNft();

  const onPurchase = (nftId: number, price: number) => {
    purchaseNft({ nftId, price });
  };
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[1440px] flex items-center justify-between">
        {nfts?.map((e) => {
          return (
            <div key={e.id} className="flex flex-col gap-2">
              <div className="w-full flex items-center justify-center p-2 bg-slate-500">
                <Image src={e.uri} alt="image" width={100} height={100}></Image>
              </div>

              <p className="text-2xl font-semibold">{e.name}</p>
              <p className="text-sm ">{e.description}</p>
              <p className="text-sm ">{e.price}</p>

              <Button
                onClick={() => {
                  onPurchase(e.id, e.price);
                }}
              >
                Buy
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
