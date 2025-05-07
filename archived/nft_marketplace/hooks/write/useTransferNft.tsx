import { ITransferNftSchema } from "@/lib/schemas/transfer_nft";
import { BLACK_MARKET_ADDRESS, CLIENT } from "@/lib/web3";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function useTransferNft() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: ITransferNftSchema) => {
      if (!(window as any)?.aptos) {
        return;
      }

      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${BLACK_MARKET_ADDRESS}::black_market::transfer_ownership`,
        type_arguments: [],
        arguments: [BLACK_MARKET_ADDRESS, values.nftId, values.user],
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
