import { z } from "zod";

export const TransferNftSchema = z.object({
  user: z.string(),
  nftId: z.coerce.number().positive(),
});

export type ITransferNftSchema = z.infer<typeof TransferNftSchema>;

export const TransferNftSchemaDefaults: ITransferNftSchema = {
  user: "",
  nftId: 0,
};
