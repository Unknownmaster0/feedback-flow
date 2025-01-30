"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

const page = () => {
  const queryParams = useParams<{ userName: string }>();
  const userName = queryParams.userName;

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
  }, [setUser, setLoadingWhileValidatingUser]);

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

  return (
    <div className="max-h-screen">
      <div className="flex items-center justify-center p-10">
        <div className="w-full p-4 bg-white border border-zinc-400 rounded-lg shadow-lg">
          {loadingWhileValidatingUser ? (
            <div className="md:text-4xl sm:text-2xl text-lg text-slate-800">
              Please while user is being validate{" "}
              <Loader2 className="animate-spin" />
            </div>
          ) : user ? (
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
                      <FormLabel className="sm:text-lg md:text-xl">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          rows={5}
                          {...field}
                          className="border-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loadingWhileSendingMessage}>
                  {loadingWhileSendingMessage ? (
                    <>
                      <Loader2 className="animate-spin" /> Please Wait
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>
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

export default page;
