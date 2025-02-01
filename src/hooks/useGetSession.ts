import { CustomSessionContext } from "@/context/CustomsessionProvider";
import { ApiResonseInterface } from "@/types/ApiResponse";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

const useGetSession = () => {
  const { data: session, status } = useSession();
  // const [customCookie, setCustomCookie] = useState(null);
  const { customSession, setCustomSession } = useContext(CustomSessionContext);
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
          setCustomSession(response.data?.session); //todo: type error as I have set the ApiResponse type of data: any, do change.
        }
      } catch (error) {
        console.error("error while getting session from backend ", error);
        // const axiosError = error as AxiosError<ApiResonseInterface>;
        // const status = axiosError.status as number;
        // status < 500 ? "Request error" : "Server error",
      } finally {
        setloadingWhileGettingSession(false);
      }
    };

    if (!session) {
      fetchSession();
    } else {
      setloadingWhileGettingSession(false);
    }
  }, [setCustomSession, session]);

  return {
    session: session || customSession,
    status: session
      ? status
      : customSession
        ? "authenticated"
        : "unauthenticated",
    loadingWhileGettingSession,
  };
};

export default useGetSession;
