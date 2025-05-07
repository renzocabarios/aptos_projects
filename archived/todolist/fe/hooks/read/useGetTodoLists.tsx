import { INftSchema } from "@/lib/schemas/nft.schema";
import { hexToUint8Array } from "@/lib/utils";
import { BLACK_MARKET_ADDRESS, CLIENT, TODOLIST_ADDRESS } from "@/lib/web3";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface UseGetTodoListsProps {
  todoListsCounter?: number;
}

export default function useGetTodoLists({
  todoListsCounter,
}: UseGetTodoListsProps) {
  const { account } = useWallet();

  const mutation = useQuery({
    queryFn: async () => {
      if (!account?.address) return;
      if (!todoListsCounter) return;

      const todoLists: any[] = [];

      for (let i: number = 0; i < todoListsCounter - 1; i++) {
        console.log(i);

        const response = await CLIENT.view({
          function: `${TODOLIST_ADDRESS}::todolist::get_todo_list`,
          arguments: [account?.address, i.toString()],
          type_arguments: [],
        });

        todoLists.push({
          id: i,
          owner: response[0],
          numberOfTodos: Number(i),
        });
      }

      return todoLists;
    },
    queryKey: ["todolists", account?.address, todoListsCounter],
    enabled: !!account?.address || !!todoListsCounter,
  });

  useEffect(() => {
    console.log(mutation?.error);
  }, [mutation?.error]);

  return { ...mutation };
}
