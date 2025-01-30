import connectDb from "@/lib/db";
import User from "@/models/models";
import { log } from "console";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// log("auth secret in option.ts: ", process.env.AUTH_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: {
          label: "email",
          placeholder: "master@gmail.com",
          type: "text",
        },
        password: {
          label: "password",
          placeholder: "*******",
          type: "password",
        },
      },

      async authorize(credentials: any): Promise<any> {
        await connectDb();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("User not exist with this email");
          }
          if (!user.isVerified) {
            throw new Error("Verify email");
          }
          //   if user exist and also verified then need to check its password finally.
          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordMatch) {
            throw new Error("Wrong password");
          }
          return user; // FINALLY RETURN THE USER.
        } catch (error: any) {
          log("error while next-auth option", error);
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    // SESSION ONLY HAVE FEW THINGS LIKE (EXPIRES, USER)
    // we customised the session in the next-auth.d.ts file in "types" file.
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isVerified = token.isVerified;
      session.user.isAcceptingMessage = token.isAcceptingMessage;
      session.user.userName = token.userName;
      return session;
    },
    // token also have only few things like (email, image, id, name)
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.userName = user.userName;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};
