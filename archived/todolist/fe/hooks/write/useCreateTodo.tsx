import { ICreateNftSchema } from "@/lib/schemas/create_nft.schema";
import { stringToVector } from "@/lib/utils";
import { BLACK_MARKET_ADDRESS, CLIENT, TODOLIST_ADDRESS } from "@/lib/web3";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function useCreateTodo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: ICreateNftSchema) => {
      if (!window) {
        return;
      }

      const name = stringToVector(values.name);
      const description = stringToVector(values.description);
      const uri = stringToVector(values.uri);

      const entryFunctionPayload = {
        type: "entry_function_payload",
        function: `${TODOLIST_ADDRESS}::todolist::create_todo`,
        type_arguments: [],
        arguments: [name, description, uri, values.rarity],
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
