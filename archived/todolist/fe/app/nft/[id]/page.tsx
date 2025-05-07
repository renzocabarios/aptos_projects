"use client";
import useGetMyNft from "@/hooks/read/useGetMyNft";
import { useEffect } from "react";
import useListNft from "@/hooks/write/useListNft";
import { useParams } from "next/navigation";
import useGetNft from "@/hooks/read/useGetNft";
import Image from "next/image";
import {
  IListNftSchema,
  ListNftSchema,
  ListNftSchemaDefaults,
} from "@/lib/schemas/list_nft_schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useDelistNft from "@/hooks/write/useDelistNft";
import useTransferNft from "@/hooks/write/useTransferNft";
import {
  ITransferNftSchema,
  TransferNftSchema,
  TransferNftSchemaDefaults,
} from "@/lib/schemas/transfer_nft";
export default function MyNft() {
  const params = useParams();
  const { id } = params; // Access the dynamic [id]
  const { data: nft } = useGetNft({ id: (id ?? 0) as number });
  const { mutate: listNft } = useListNft();
  const { mutate: delistNft } = useDelistNft();
  const { mutate: transferNft } = useTransferNft();

  const form = useForm<IListNftSchema>({
    resolver: zodResolver(ListNftSchema),
    defaultValues: ListNftSchemaDefaults,
  });

  const transferForm = useForm<ITransferNftSchema>({
    resolver: zodResolver(TransferNftSchema),
    defaultValues: TransferNftSchemaDefaults,
  });

  useEffect(() => {
    form.setValue("nftId", Number(id ?? 0));
  }, [form.setValue, id]);

  useEffect(() => {
    transferForm.setValue("nftId", Number(id ?? 0));
  }, [transferForm.setValue, id]);

  useEffect(() => {
    console.log(transferForm.formState);
  }, [transferForm.formState]);

  async function onSubmit(values: IListNftSchema) {
    listNft({ ...values });
  }

  async function onTransfer(values: ITransferNftSchema) {
    transferNft({ ...values });
  }

  const onDelist = () => {
    delistNft({ nftId: Number(id ?? 0) });
  };

  return (
    <div className="w-full flex items-center justify-center p-4 flex-col">
      <div className="flex items-center gap-8 justify-center">
        <div className="min-w-[200px] min-h-[200px] border border-slate-400 flex items-center justify-center rounded-xl">
          {nft?.uri && (
            <Image
              src={nft?.uri ?? ""}
              alt="image"
              width={100}
              height={100}
            ></Image>
          )}
        </div>

        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold">{nft?.name}</p>
              <p className="">{nft?.for_sale ? "Listed" : "Unlisted"}</p>
            </div>
            <p className="text-sm">{nft?.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <p>APT: {nft?.price}</p>
            <p>Rarity: {nft?.rarity}</p>
          </div>
          <p>Owner: {nft?.owner}</p>
        </div>
      </div>

      {nft?.for_sale && <Button onClick={onDelist}>Delist</Button>}

      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Enlist</Button>
          </form>
        </Form>
      </div>

      <div className="flex flex-col gap-4">
        <Form {...transferForm}>
          <form
            onSubmit={transferForm.handleSubmit(onTransfer)}
            className="space-y-8"
          >
            <FormField
              control={transferForm.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Transfer</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
