import { z } from "zod";

export const NftSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(2).max(50),
  owner: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  uri: z.string().url(),
  price: z.coerce.number(),
  for_sale: z.boolean(),
  rarity: z.coerce.number(),
});

export type INftSchema = z.infer<typeof NftSchema>;

export const NftSchemaDefaults: INftSchema = {
  id: 0,
  name: "",
  owner: "",
  description: "",
  uri: "",
  price: 0,
  for_sale: false,
  rarity: 0,
};
