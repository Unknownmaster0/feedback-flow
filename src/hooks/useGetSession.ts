import { ApiResonseInterface } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const useGetSession = () => {
  const { data: session, status } = useSession();
  const [customCookie, setCustomCookie] = useState(null);
  const [loadingWhileGettingSession, setloadingWhileGettingSession] =
    useState(true);

  useEffect(() => {
    // go to backend and get the custom cookie.
    const fetchSession = async () => {
      try {
        const response = (
          await axios.get<ApiResonseInterface>(`/api/get-session`, {
            withCredentials: true,
          })
        ).data;

        if (response.success && response.data?.session) {
          setCustomCookie(response.data?.session); //todo: type error as I have set the ApiResponse type of data: any, do change.
        }
      } catch (error) {
        console.error("error while getting session from backend ", error);
        const axiosError = error as AxiosError<ApiResonseInterface>;
        const status = axiosError.status as number;
        // status < 500 ? "Request error" : "Server error",
      } finally {
        setloadingWhileGettingSession(false);
      }
    };

    if(!session){
      fetchSession();
    }else{
      setloadingWhileGettingSession(false);
    }

  }, [setCustomCookie, session]);

  return {
    session: session || customCookie,
    status: session
      ? status
      : customCookie
        ? "authenticated"
        : "unauthenticated",
    loadingWhileGettingSession,
  };
};

export default useGetSession;
