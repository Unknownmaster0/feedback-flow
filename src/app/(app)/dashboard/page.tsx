"use client";

import MessageCard from "@/components/MessageCard";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import useGetSession from "@/hooks/useGetSession";
import { MessageInterface } from "@/models/models";
import { ApiResonseInterface } from "@/types/ApiResponse";
import { isAcceptingMessageSchema } from "@/validationSchema/isAcceptingMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const Dashboard = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [_, setIsAcceptingMessageStatusLoading] = useState(false);
  const [
    loadingWhileToggleAcceptingMessage,
    setloadingWhileToggleAcceptingMessage,
  ] = useState(false);

  const { session, status } = useGetSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof isAcceptingMessageSchema>>({
    resolver: zodResolver(isAcceptingMessageSchema),
  });

  const { control, handleSubmit, reset, watch } = form;

  const isAcceptingMessage = watch("isAcceptingMessage");

  const fetchIsAcceptingMessage = useCallback(() => {
    (async () => {
      setIsAcceptingMessageStatusLoading(true);
      try {
        const response = (
          await axios.get<ApiResonseInterface>(`/api/accepting-messages`)
        ).data;
        // console.log("response of fetching isAcceptingMessage: ", response);
        reset({ isAcceptingMessage: response.isAcceptingMessage }); //* i am sure that data will come in boolean form
        toast({
          title: response.isAcceptingMessage
            ? "accepting message"
            : "currently busy to accept message",
        });
      } catch (error) {
        console.error(
          "error in dashboard while fetch isAcceptingMessage ",
          error
        );
        const axiosError = error as AxiosError<ApiResonseInterface>;
        const status = axiosError.status as number;
        toast({
          title: status < 500 ? "Request error" : "Server error",
          description: axiosError.response?.data?.message,
          variant: "destructive",
        });
      } finally {
        setIsAcceptingMessageStatusLoading(false);
      }
    })();
  }, [reset]);

  const fetchAllMessages = useCallback(
    (refresh: boolean = false) => {
      (async () => {
        setIsLoadingMsg(true);
        setIsAcceptingMessageStatusLoading(false); // todo: go and check why this is here by making it comment in future.

        try {
          const response = (
            await axios.get<ApiResonseInterface>(`/api/get-messages`)
          ).data;

          setMessages(response.messages || []);
          if (refresh) {
            toast({
              title: "Refresh messages",
              description: response.message,
            });
          }
        } catch (error) {
          console.error(
            "error in dashboard while fetching all messages ",
            error
          );
          const axiosError = error as AxiosError<ApiResonseInterface>;
          const status = axiosError.status as number;
          toast({
            title: status < 500 ? "Request error" : "Server error",
            description: axiosError.response?.data?.message,
            variant: "destructive",
          });
        } finally {
          setIsLoadingMsg(false);
        }
      })();
    },
    [setMessages, setIsLoadingMsg]
  );

  useEffect(() => {
    if (!session || !session.user) {
      // if user become log-out, then don't do anything
      return;
    }
    fetchAllMessages(true); //* check here passing refresh=true option to see the toast
    fetchIsAcceptingMessage();
  }, [session, setMessages]);

  // toggle-isAcceptingMessage
  const toggleIsAcceptingMessage = async (
    data: z.infer<typeof isAcceptingMessageSchema>
  ) => {
    setloadingWhileToggleAcceptingMessage(true);
    try {
      const response = (
        await axios.post<ApiResonseInterface>(`/api/accepting-messages`, {
          isAcceptingMessage: data.isAcceptingMessage,
        })
      ).data;

      reset({ isAcceptingMessage: data.isAcceptingMessage });

      toast({
        title: data.isAcceptingMessage
          ? "accepting message"
          : "currently busy to accept message",
      });
    } catch (error) {
      console.error("error while toggleing the isAcceptingMessages ", error);
      const axiosError = error as AxiosError<ApiResonseInterface>;
      const status = axiosError.status as number;
      toast({
        title: status < 500 ? "Request error" : "Server error",
        description: axiosError.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setloadingWhileToggleAcceptingMessage(false);
    }
  };

  const onDeleteMessage = (msgId: string) => {
    setMessages((prevMsg) => prevMsg.filter((msg) => msg._id != msgId));
  };

  if (status === "unauthenticated" || !session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <>
      <Separator className="" />
      <form
        onSubmit={form.handleSubmit(toggleIsAcceptingMessage)}
        className="sm:p-2 lg:p-4 text-lg"
      >
        <Controller
          name="isAcceptingMessage"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              {loadingWhileToggleAcceptingMessage ? (
                <>
                  <Loader2 />
                  Please Wait
                </>
              ) : (
                <>
                  <Switch
                    id="isAcceptingMessage"
                    checked={field.value}
                    onCheckedChange={(value) => {
                      field.onChange(value);
                      handleSubmit(toggleIsAcceptingMessage)();
                    }}
                  />
                </>
              )}

              <label htmlFor="isAcceptingMessage">
                {isAcceptingMessage ? "Focus" : "Busy"}
              </label>
            </div>
          )}
        />
      </form>
      <Separator className="border-zinc-400 shadow-md border-b-2" />
      <div className="flex flex-wrap space-x-6 p-2 space-y-2">
        {isLoadingMsg ? (
          <>
            <Loader2 className="animate-spin size-5" />
            Please Wait Message is loading
          </>
        ) : (
          <>
            {messages.map((message) => (
              <MessageCard
                msg={message}
                key={message._id?.toString()}
                onDeleteMessage={onDeleteMessage}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
