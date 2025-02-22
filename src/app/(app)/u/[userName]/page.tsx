"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ApiResonseInterface } from "@/types/ApiResponse";
import messageZodSchema from "@/validationSchema/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UserMessageInterface = () => {
  const queryParams = useParams<{ userName: string }>();
  const userName = queryParams.userName;

  const [messages, setMessages] = useState("");
  const [user, setUser] = useState({
    _id: "",
    userName: "",
    email: "",
    isAcceptingMessage: "",
  });
  const [loadingWhileValidatingUser, setLoadingWhileValidatingUser] =
    useState(false);
  const [loadingWhileSendingMessage, setLoadingWhileSendingMessage] =
    useState(false);
  const [loadingWhileGettingMessage, setLoadingWhileGettingMessage] =
    useState(false);

  const { toast } = useToast();
  //* using react-hook-form for the message sending
  const form = useForm<z.infer<typeof messageZodSchema>>({
    resolver: zodResolver(messageZodSchema),
    defaultValues: {
      content: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    (async () => {
      setLoadingWhileValidatingUser(true);
      try {
        const response = (
          await axios.get<ApiResonseInterface>(
            `/api/verify-userName?userName=${userName}`
          )
        ).data;
        if (response.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("error while registering user ", error);
        const axiosError = error as AxiosError<ApiResonseInterface>;
        const status = axiosError.status as number;
        toast({
          title: status < 500 ? "Request error" : "Server error",
          description: axiosError.response?.data?.message,
          variant: "destructive",
        });
      } finally {
        setLoadingWhileValidatingUser(false);
      }
    })();
  }, [setUser, setLoadingWhileValidatingUser, userName, toast]);

  const onSubmit = async (value: z.infer<typeof messageZodSchema>) => {
    if (user && !user?.isAcceptingMessage) {
      toast({
        title: "User message",
        description: "user is busy not accepting messages this time",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingWhileSendingMessage(true);
      const response = (
        await axios.post<ApiResonseInterface>(`/api/send-message`, {
          userName: user?.userName,
          message: value.content,
        })
      ).data;
      if (response.success) {
        toast({
          title: "User message",
          description: `Message is received by ${user?.userName} successfully`,
        });
        reset(); // normal reset will do everything to the default state.
      }
    } catch (error) {
      console.error("error while registering user ", error);
      const axiosError = error as AxiosError<ApiResonseInterface>;
      const status = axiosError.status as number;
      toast({
        title: status < 500 ? "Request error" : "Server error",
        description: axiosError.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setLoadingWhileSendingMessage(false);
    }
  };

  const fetchStreamedMessages = async () => {
    setLoadingWhileGettingMessage(true);
    setMessages("");

    try {
      const response = await fetch("/api/suggest-messages");
      console.log(response);
      if (!response.ok) {
        console.error("Failed to fetch:", response.statusText);
        toast({
          title: "error while fetching",
          description: response.statusText,
          variant: "destructive",
        });
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        console.error("Reader not available");
        toast({
          title: "error while fetching",
          description: "internal error",
          variant: "destructive",
        });
        return;
      }

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error("Error while fetching streamed text:", error);
      toast({
        title: "error while fetching streamed text",
        description: "internal error",
        variant: "destructive",
      });
    } finally {
      setLoadingWhileGettingMessage(false);
    }
  };

  const pasteMessageToForm = (msg: string) => {
    form.setValue("content", msg);
  };

  return (
    <div className="max-h-screen">
      <div className="flex items-center justify-center p-2 sm:p-3 md:p-6 lg:p-10">
        <div className="w-full p-1 sm:p-2 md:p-4 bg-white">
          {loadingWhileValidatingUser ? (
            <div className="md:text-4xl sm:text-2xl text-lg text-slate-800">
              Please while user is being validate{" "}
              <Loader2 className="animate-spin" />
            </div>
          ) : user ? (
            <div className="space-y-12 sm:space-y-14 md:space-y-20 lg:space-y-24">
              <div className="shadow-sm p-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="lg:space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sm:text-lg md:text-xl">
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your message here..."
                              rows={5}
                              {...field}
                              className="border-zinc-200 w-full h-[120px] resize-none message-text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-center">
                      <Button
                        type="submit"
                        disabled={loadingWhileSendingMessage}
                        className="flex-grow-0 my-2"
                      >
                        {loadingWhileSendingMessage ? (
                          <>
                            <Loader2 className="animate-spin" /> Please Wait
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              <div>
                <Button
                  disabled={loadingWhileGettingMessage}
                  onClick={fetchStreamedMessages}
                  className="mb-1 sm:mb-2 md:mb-4 lg:mb-5"
                >
                  Get AI suggestd Messages
                </Button>
                <div className="space-y-1 sm:space-y-2 md:mb-5">
                  {messages.split("|").map((msg, idx) => (
                    <SuggestMessageUI
                      msg={msg}
                      key={idx}
                      onClickHandler={() => pasteMessageToForm(msg)}
                    />
                  ))}
                </div>
                <p className="text-slate-950 font-medium rounded-sm inline-block">
                  <span className="text-red-900 font-bold">NOTE: </span>Click on
                  messages to paste it to message box
                </p>
              </div>
            </div>
          ) : (
            <div className="md:text-4xl sm:text-2xl text-lg text-slate-800">
              Error 404 user not found 😵‍💫😵‍💫😵‍💫
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function SuggestMessageUI({
  msg,
  onClickHandler,
}: {
  msg: string;
  onClickHandler: () => void;
}) {
  return (
    <Card onClick={onClickHandler} className="cursor-pointer border-none">
      <CardHeader>{msg}</CardHeader>
    </Card>
  );
}

export default UserMessageInterface;
