import { INftSchema } from "@/lib/schemas/nft.schema";
import { hexToUint8Array } from "@/lib/utils";
import { BLACK_MARKET_ADDRESS, CLIENT } from "@/lib/web3";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useGetAllNftsForSale() {
  const { account } = useWallet();

  const mutation = useQuery({
    queryFn: async () => {
      if (!account?.address) return;

      const nftIdsResponse = await CLIENT.view({
        function: `${BLACK_MARKET_ADDRESS}::black_market::get_all_for_sale`,
        arguments: [BLACK_MARKET_ADDRESS, "100", "0"],
        type_arguments: [],
      });

      const nftIds = Array.isArray(nftIdsResponse[0])
        ? nftIdsResponse[0]
        : nftIdsResponse;

      const userNFTs = (
        await Promise.all(
          nftIds.map(async (id) => {
            try {
              const nftDetails = await CLIENT.view({
                function: `${BLACK_MARKET_ADDRESS}::black_market::get_nft_details`,
                arguments: [BLACK_MARKET_ADDRESS, id],
                type_arguments: [],
              });

              const [
                nftId,
                owner,
                name,
                description,
                uri,
                price,
                forSale,
                rarity,
              ] = nftDetails as [
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
                uri: new TextDecoder().decode(hexToUint8Array(uri.slice(2))),
                rarity,
                price: price / 100000000,
                for_sale: forSale,
              };
            } catch (error) {
              console.error(`Error fetching details for NFT ID ${id}:`, error);
              return null;
            }
          })
        )
      ).filter((nft): nft is INftSchema => nft !== null);

      return userNFTs;
    },
    queryKey: ["marketplace"],
    enabled(query) {
      return !!account?.address;
    },
  });

  useEffect(() => {
    console.log(mutation?.error);
  }, [mutation?.error]);

  return { ...mutation };
}
