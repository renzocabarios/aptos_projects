import { z } from "zod";

export const CreateNftSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  uri: z.string().url(),
  rarity: z.coerce.number(),
});

export type ICreateNftSchema = z.infer<typeof CreateNftSchema>;

export const CreateNftSchemaDefaults: ICreateNftSchema = {
  name: "",
  uri: "",
  description: "",
  rarity: 0,
};
