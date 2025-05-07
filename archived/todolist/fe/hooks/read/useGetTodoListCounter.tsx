import { INftSchema } from "@/lib/schemas/nft.schema";
import { hexToUint8Array } from "@/lib/utils";
import { BLACK_MARKET_ADDRESS, CLIENT, TODOLIST_ADDRESS } from "@/lib/web3";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useGetTodoListCounter() {
  const { account } = useWallet();

  const mutation = useQuery({
    queryFn: async () => {
      if (!account?.address) return;

      const response = await CLIENT.view({
        function: `${TODOLIST_ADDRESS}::todolist::get_todo_list_counter`,
        arguments: [account?.address],
        type_arguments: [],
      });
      return response[0];
    },
    queryKey: ["todolist-counter", account?.address],
    enabled: !!account?.address,
  });

  useEffect(() => {
    console.log(mutation?.error);
  }, [mutation?.error]);

  return { ...mutation };
}
