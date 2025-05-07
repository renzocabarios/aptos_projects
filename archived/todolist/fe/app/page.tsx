"use client";

import { Button } from "@/components/ui/button";
import useGetAllNftsForSale from "@/hooks/read/useGetAllNftsForSale";
import useGetTodoListCounter from "@/hooks/read/useGetTodoListCounter";
import useGetTodoLists from "@/hooks/read/useGetTodoLists";
import useCreateTodoList from "@/hooks/write/useCreateTodoList";
import usePurchaseNft from "@/hooks/write/usePurchaseNft";
import Image from "next/image";

export default function Home() {
  const { mutate: purchaseNft } = usePurchaseNft();
  const { mutate: createTodoList } = useCreateTodoList();
  const { data: todoListCounter } = useGetTodoListCounter();
  const { data: todoLists } = useGetTodoLists({
    todoListsCounter: (todoListCounter ?? 0) as number,
  });
  const onPurchase = (nftId: number, price: number) => {
    purchaseNft({ nftId, price });
  };

  const onCreateTodoList = () => {
    createTodoList();
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[1280px] flex flex-col items-center justify-between">
        <Button onClick={onCreateTodoList}>Create Todo List</Button>

        <div className="flex flex-col gap-4">
          {todoLists?.map((todoList) => {
            return (
              <div
                key={todoList.id}
                className="w-full flex flex-col p-4 border"
              >
                <p>{todoList.id}</p>
                <p>{todoList.numberOfTodos}</p>
              </div>
            );
          })}
        </div>

        {/* {nfts?.map((e) => {
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
        })} */}
      </div>
    </div>
  );
}
