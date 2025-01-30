import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "@/types/definitions";
import { cookies } from "next/headers";

const secretKey = process.env.AUTH_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if(!session)  return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
    throw new Error("Error while decrypting the session");
  }
}

export async function createSession(
  userId: string,
  email: string,
  userName: string,
  isAcceptingMessage: boolean
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const payload: SessionPayload = {
    user: {
      id: userId,
      email,
      userName,
      isAcceptingMessage,
    },
    expires: expiresAt,
  };

  const session = await encrypt(payload);

  console.log("session in create-session: ", session);
  return session;
}

//todo: used this in later section of the code.
export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}
