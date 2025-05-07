import { z } from "zod";

export const PurchaseNftSchema = z.object({
  price: z.coerce.number().positive(),
  nftId: z.coerce.number().positive(),
});

export type IPurchaseNftSchema = z.infer<typeof PurchaseNftSchema>;

export const PurchaseNftSchemaDefaults: IPurchaseNftSchema = {
  price: 0,
  nftId: 0,
};
