import { INftSchema } from "@/lib/schemas/nft.schema";
import { hexToUint8Array } from "@/lib/utils";
import { BLACK_MARKET_ADDRESS, CLIENT } from "@/lib/web3";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

interface IUseGetNftProps {
  id: number;
}

export default function useGetNft({ id }: IUseGetNftProps) {
  const { account } = useWallet();

  const mutation = useQuery({
    queryFn: async () => {
      if (!account?.address) return;

      const nftDetails = await CLIENT.view({
        function: `${BLACK_MARKET_ADDRESS}::black_market::get_nft_details`,
        arguments: [BLACK_MARKET_ADDRESS, id],
        type_arguments: [],
      });

      const [nftId, owner, name, description, uri, price, forSale, rarity] =
        nftDetails as [
          number,
          string,
          string,
          string,
          string,
          number,
          boolean,
          number
        ];

      return {
        id: nftId,
        name: new TextDecoder().decode(hexToUint8Array(name.slice(2))),
        description: new TextDecoder().decode(
          hexToUint8Array(description.slice(2))
        ),
        owner,
        uri: new TextDecoder().decode(hexToUint8Array(uri.slice(2))),
        rarity,
        price: price / 100000000,
        for_sale: forSale,
      };
    },
    queryKey: ["nft", account?.address ?? ""],
    enabled(query) {
      return !!account?.address;
    },
  });

  return { ...mutation };
}
