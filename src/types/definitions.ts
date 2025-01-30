import { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
  user: {
    id: string;
    email: string;
    userName: string;
    isAcceptingMessage: boolean;
  };
  expires: Date;
}
