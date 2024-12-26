import { z } from "zod";

export const ListNftSchema = z.object({
  price: z.coerce.number().positive(),
  nftId: z.coerce.number().positive(),
});

export type IListNftSchema = z.infer<typeof ListNftSchema>;

export const ListNftSchemaDefaults: IListNftSchema = {
  price: 0,
  nftId: 0,
};
