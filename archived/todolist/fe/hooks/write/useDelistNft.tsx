import { IDelistNftSchema } from "@/lib/schemas/delist_nft_schema";
import { BLACK_MARKET_ADDRESS, CLIENT } from "@/lib/web3";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDelistNft() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: IDelistNftSchema) => {
      if (!(window as any)?.aptos) {
        return;
      }

      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${BLACK_MARKET_ADDRESS}::black_market::delist`,
        type_arguments: [],
        arguments: [BLACK_MARKET_ADDRESS, values.nftId],
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
