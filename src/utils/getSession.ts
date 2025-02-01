import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { decrypt } from "@/lib/session";
import { SessionPayload } from "@/types/definitions";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const cookieSession = (await cookieStore).get("session")?.value || "";

  const cookiePayload: SessionPayload | null = cookieSession
    ? ((await decrypt(cookieSession)) as SessionPayload)
    : null;

  const authPayload = (await getServerSession(
    authOptions
  )) as SessionPayload | null;

  //   console.log("auth payload: ", authPayload); (next-auth user payload: authPayload)

  return authPayload || cookiePayload;
}
