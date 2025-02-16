"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import ButtonComponent from "./ButtonComponent";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import useGetSession from "@/hooks/useGetSession";
import { useToast } from "@/hooks/use-toast";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import { Session } from "next-auth";

const Navbar = () => {
  const pathname = usePathname();
  const [isSendMessagePage, setIsSendMessagePage] = useState(false);
  const [serverSession, setServerSession] = useState<Session | null>(null);
  const [, setUserDropDownMenu] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { session } = useGetSession();

  useEffect(() => {
    setIsSendMessagePage(pathname.startsWith("/u/"));
  }, [setIsSendMessagePage, pathname]);

  useEffect(() => {
    if (!session) {
      return;
    }
    if (session && session.user && session.user.id) {
      setServerSession(session); //todo: correct the type here.
    }
  }, [session, setServerSession]); //todo: correct the type error later.

  async function onClickHandler() {
    try {
      // const _response = (
      //   await axios.delete<ApiResonseInterface>(`/api/delete-session`)
      // ).data;
      // // console.log(response);
      setServerSession(null);
      const data = await signOut({
        redirect: false,
        callbackUrl: "/signin",
      });
      toast({
        title: "Information",
        description: "You are logged out!",
        color: "red",
      });
      router.push(data.url);
    } catch (error) {
      console.log(`error while deleting cookie from server`, error);
    }
  }

  function showList() {
    setUserDropDownMenu((prev) => !prev);
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-transparent">
      {/* APP NAME BAR ON NAV-BAR */}
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <FontAwesomeIcon icon={faEnvelopeOpenText} className="lg:text-2xl" />
          <span className="self-center sm:text-lg md:text-xl lg:text-3xl font-semibold whitespace-nowrap dark:text-white font-mono tracking-tight hidden md:flex">
            {process.env.NEXT_PUBLIC_SMTP_COMPANY}
          </span>
          {/* No need of adding the short company name, just adjusted the above css only */}
          {/* <span className="self-center sm:text-lg font-semibold whitespace-nowrap dark:text-white font-mono tracking-tight md:hidden">
            {process.env.NEXT_PUBLIC_COMPANY_SHORT}
          </span> */}
        </Link>
        {isSendMessagePage ? (
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-900 sm:font-bold">
            Public Profile URL
          </div>
        ) : (
          <>
            <div className="flex items-center md:order-2 space-x-3 md:space-x-3">
              {serverSession && serverSession.user ? (
                <>
                  <div className="space-x-10" onClick={showList}>
                    <MenuBar text={`Welcome ${serverSession.user.userName}`} />
                  </div>
                  <ButtonComponent
                    text={"SIGN OUT"}
                    onClickHandler={onClickHandler}
                  />
                </>
              ) : (
                <>
                  <ButtonComponent
                    text={"SIGN IN"}
                    onClickHandler={() => router.push("/signin")}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

function MenuBar({ text }: { text: string }) {
  const router = useRouter();
  const pathHandler = function (num: number) {
    router.push(num == 1 ? "/" : "/dashboard");
  };
  return (
    <Menubar className="shadow-lg">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">{text}</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => pathHandler(1)}>HOME</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => pathHandler(2)}>DASHBOARD</MenubarItem>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default Navbar;
