import { MessageInterface } from "@/models/models";

export interface ApiResonseInterface {
  success: boolean;
  message: string;
  data?: any;
  isAcceptingMessage?: boolean;
  messages?: Array<MessageInterface>;
}
