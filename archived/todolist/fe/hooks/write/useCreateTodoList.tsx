import { ICreateNftSchema } from "@/lib/schemas/create_nft.schema";
import { stringToVector } from "@/lib/utils";
import { BLACK_MARKET_ADDRESS, CLIENT, TODOLIST_ADDRESS } from "@/lib/web3";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function useCreateTodoList() {
  const queryClient = useQueryClient();
  const { signAndSubmitTransaction } = useWallet();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signAndSubmitTransaction) {
        return;
      }

      const txnResponse = await signAndSubmitTransaction({
        data: {
          function: `${TODOLIST_ADDRESS}::todolist::create_todo_list`,
          functionArguments: [],
        },
      });

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
