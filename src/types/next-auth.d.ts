import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  // these interfaces I am extending or updaing not changing. Default field will present over there.
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    userName?: string;
  }

  interface Session {
    user: {
      id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      userName?: string;
    } & DefaultSession["user"];
  }
}

// it is not mandatory that you have to write the each interface inside the next-auth one by one like this
// you can also write like this

// extending the jwt interface
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    userName?: string;
  }
}
