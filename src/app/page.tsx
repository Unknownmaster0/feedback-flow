"use client";

import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useGetSession from "@/hooks/useGetSession";
import { ApiResonseInterface } from "@/types/ApiResponse";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface userPorotype {
  id: string;
  email: string;
  userName: string;
}

interface userWithProfileUrl extends userPorotype {
  profileUrl: string;
}

export default function Home() {
  const [users, setUsers] = useState<[userWithProfileUrl]>([
    { id: "", email: "", userName: "", profileUrl: "" },
  ]);
  const [loadingWhileGettingUser, setLoadingWhileGettingUser] = useState(true);
  const { session } = useGetSession();

  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const response = (
          await axios.get<ApiResonseInterface>(`/api/get-all-users`)
        ).data;
        if (response.success) {
          const users = response.data.users.map((user: userPorotype) => ({
            id: user.id,
            email: user.email,
            userName: user.userName,
            profileUrl: `/u/${user.userName}`,
          }));
          let finalUser = users;
          if (session && session.user) {
            finalUser = users.filter(
              (user: userPorotype) => user.userName !== session.user?.userName
            );
          }
          setUsers(finalUser);
        } else {
          toast({
            title: "Invalid response",
            description: response.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("error while getting user ", error);
        const axiosError = error as AxiosError<ApiResonseInterface>;
        const status = axiosError.status as number;
        toast({
          title: status < 500 ? "Request error" : "Server error",
          description: axiosError.response?.data?.message,
          variant: "destructive",
        });
      } finally {
        setLoadingWhileGettingUser(false);
      }
    })();
  }, [setUsers, toast]);

  // to avoid the hydration issue of the react and next.js. the content don't match with pre-rendered and server side content sent.
  if (typeof window === "undefined") {
    return (
      <>
        <Loader2 className="animate-spin" /> Please Wait
      </>
    );
  }

  return (
    <div className="pt-3 lg:pt-5">
      {loadingWhileGettingUser ? (
        <>
          <Loader2 className="animate-spin" /> Please Wait ...
        </>
      ) : (
        <div className="first-line:space-y-1 sm:space-y-2 md:space-y-3">
          {users.map((user) => (
            <UserProfileUrl user={user} key={user.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserProfileUrl({ user }: { user: userWithProfileUrl }) {
  return (
    <div className="w-full flex items-center lg:space-x-4 pl-5 pb-4 space-x-2 md:space-x-3">
      <span className="font-extralight text-sm shadow-md p-2 rounded-md text-center text-pretty">
        {user.userName}
      </span>
      <Input
        value={`${window.location.protocol}//${window.location.host}${user.profileUrl}`}
        disabled
        type="text"
        className="p-1 sm:p-2 md:p-4 w-1/2"
      />
      <a href={`${user.profileUrl}`} target="_blank">
        <FontAwesomeIcon icon={faArrowRight} />
      </a>
    </div>
  );
}
