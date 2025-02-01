import { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
  user: {
    id: string;
    userName: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  };
  expires: Date;
}

export interface customSessionPayload {
  user: {
    id: string;
    userName: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  };
  expires: Date;
}
