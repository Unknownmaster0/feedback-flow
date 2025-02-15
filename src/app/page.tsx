"use client";

import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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
          setUsers(users);
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
    <div className="sm:p-3 lg:p-5">
      {loadingWhileGettingUser ? (
        <>
          <Loader2 className="animate-spin" /> Please Wait ...
        </>
      ) : (
        <div>
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
    <div className="w-full flex items-center lg:space-x-4 pl-5 pb-4">
      <span className="font-extralight text-sm border shadow-md">
        {user.userName}
      </span>
      <Input
        value={`${window.location.protocol}://${window.location.host}${user.profileUrl}`}
        disabled
        type="text"
        className="p-4 w-1/2"
      />
      <a href={`${user.profileUrl}`} target="_blank">
        <FontAwesomeIcon icon={faArrowRight} />
      </a>
    </div>
  );
}
