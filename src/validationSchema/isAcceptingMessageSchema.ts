import { z } from "zod";

export const isAcceptingMessageSchema = z.object({
  isAcceptingMessage: z.boolean(),
});
