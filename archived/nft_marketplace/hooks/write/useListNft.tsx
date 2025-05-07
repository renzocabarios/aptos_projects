import { IListNftSchema } from "@/lib/schemas/list_nft_schema";
import { BLACK_MARKET_ADDRESS, CLIENT } from "@/lib/web3";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function useListNft() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: IListNftSchema) => {
      if (!(window as any)?.aptos) {
        return;
      }

      const priceInOctas = parseFloat(values.price.toString()) * 100000000;

      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${BLACK_MARKET_ADDRESS}::black_market::list_for_sale`,
        type_arguments: [],
        arguments: [BLACK_MARKET_ADDRESS, values.nftId, priceInOctas],
      };

      const txnResponse = await (window as any).aptos.signAndSubmitTransaction(
        entryFunctionPayload
      );

      await CLIENT.waitForTransaction(txnResponse.hash);

      console.log(txnResponse.hash);
    },
    onSuccess: () => {
      // Invalidate and refetch
      //   queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return { ...mutation };
}
