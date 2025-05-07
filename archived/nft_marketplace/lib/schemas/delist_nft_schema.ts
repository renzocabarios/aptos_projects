import { z } from "zod";

export const DelistNftSchema = z.object({
  nftId: z.coerce.number().positive(),
});

export type IDelistNftSchema = z.infer<typeof DelistNftSchema>;

export const DelistNftSchemaDefaults: IDelistNftSchema = {
  nftId: 0,
};
