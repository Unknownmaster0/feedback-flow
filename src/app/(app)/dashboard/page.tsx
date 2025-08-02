"use client";

import MessageCard from "@/components/MessageCard";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import useGetSession from "@/hooks/useGetSession";
import { MessageInterface } from "@/models/models";
import { ApiResonseInterface } from "@/types/ApiResponse";
import { isAcceptingMessageSchema } from "@/validationSchema/isAcceptingMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  Calendar,
  Copy,
  Download,
  Eye,
  Loader2,
  MessageSquare,
  Share2,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  exportMessageAsImage,
  exportMessagesToPDF,
  generateEmbedCode,
} from "@/utils/export-data";
// import { redirect } from "next/navigation";

const Dashboard = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [, setIsAcceptingMessageStatusLoading] = useState(false);
  const [
    loadingWhileToggleAcceptingMessage,
    setloadingWhileToggleAcceptingMessage,
  ] = useState(false);
  const [exportingData, setExportingData] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<MessageInterface | null>(null);
  const messageRefs = useRef<Map<string, HTMLElement>>(new Map());

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
  }, [reset, toast]);

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
              description: "Get all latest messages successfully",
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
    [setMessages, setIsLoadingMsg, toast]
  );

  useEffect(() => {
    if (!session || !session.user) {
      // if user become log-out, then don't do anything
      return;
    }
    fetchAllMessages(true); //* check here passing refresh=true option to see the toast
    fetchIsAcceptingMessage();
  }, [session, setMessages, fetchAllMessages, fetchIsAcceptingMessage]);

  // toggle-isAcceptingMessage
  const toggleIsAcceptingMessage = async (
    data: z.infer<typeof isAcceptingMessageSchema>
  ) => {
    setloadingWhileToggleAcceptingMessage(true);
    try {
      const _response = (
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

  const copyToClipboard = (value: string) => {
    try {
      navigator.clipboard.writeText(value);
      toast({
        title: "Copy to clipboard",
        description: "Copy to clipboard Successfully",
      });
    } catch (error) {
      toast({
        title: "Copy to clipboard",
        description: "failed to copy clipboard",
        variant: "destructive",
      });
    }
  };

  // Export all data to PDF
  const handleExportData = async () => {
    setExportingData(true);
    try {
      // Export to PDF
      await exportMessagesToPDF(messages, session?.user);

      toast({
        title: "Data exported successfully!",
        description: "Your feedback data has been downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description:
          "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportingData(false);
    }
  };

  if (status === "unauthenticated" || !session || !session.user) {
    return <div>Please Login</div>;
    // return redirect('/signin');
  }

  const profileURL: string = `${window.location.protocol}//${window.location.host}/u/${session.user.userName}`;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  Welcome back,{" "}
                </span>
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent shadow-text">
                  {session.user.userName}!
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Here&apos;s your feedback analytics and recent messages
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                {exportingData ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </div>

        {/* dashboard overview cards cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          {/* Total Feedback Card  */}
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    {/* <p className="text-3xl font-bold text-foreground">{user.totalMessages}</p> */}
                    <p className="text-3xl font-bold text-foreground">{47}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Feedback Received
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  All time
                </Badge>
              </div>
            </CardContent>
          </Card>
          {/* Profile Views Card */}
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    {/* <p className="text-3xl font-bold text-foreground">{user.profileViews}</p> */}
                    <p className="text-3xl font-bold text-foreground">{234}</p>
                    <p className="text-sm text-muted-foreground">
                      Profile Views This Month
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  {/* <span className="text-sm font-medium text-green-600">+{user.profileViewsGrowth}%</span> */}
                  <span className="text-sm font-medium text-green-600">
                    +{50}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Public Profile URL Card */}
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Public Profile URL
                    </span>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(profileURL)}
                    size="sm"
                    variant="outline"
                    className="h-8"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground truncate">
                    {profileURL}
                  </p>
                </div>
                {/* Focus Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${session.user.isAcceptingMessage ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <span className="text-sm font-medium">
                      {session.user.isAcceptingMessage ? "Focus Mode" : "Busy"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <form
                      onSubmit={form.handleSubmit(toggleIsAcceptingMessage)}
                      className="p-2 pl-4 sm:pl-7 text-lg"
                    >
                      <Controller
                        name="isAcceptingMessage"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            {loadingWhileToggleAcceptingMessage ? (
                              <>
                                <Loader2 className="animate-spin" />
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* main section */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Analytics Sidebar  */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats  */}
            <Card className="card-modern animate-scale-in">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gradient">
                  Quick Stats
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Positive Rate
                  </span>
                  {/* <span className="text-sm font-semibold">{user.positiveRate}%</span> */}
                  <span className="text-sm font-semibold">{90}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    This Week
                  </span>
                  <span className="text-sm font-semibold">12 new</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Response Rate
                  </span>
                  <span className="text-sm font-semibold">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg. Length
                  </span>
                  <span className="text-sm font-semibold">127 words</span>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Types  */}
            <Card className="card-modern">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gradient">
                  Feedback Types
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Professional</span>
                  </div>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Personal</span>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Service</span>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-sm">General</span>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {isLoadingMsg ? (
              <>
                <Loader2 className="animate-spin size-5" />
                Please Wait Message is loading
              </>
            ) : (
              <Card className="card-modern animate-slide-up">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gradient">
                        Recent Feedback Messages
                      </h3>
                      <p className="text-muted-foreground">
                        Anonymous feedback from your community
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        No messages yet
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        Share your profile URL to start receiving feedback!
                      </p>
                      <Button
                        onClick={() => copyToClipboard(profileURL)}
                        className="btn-gradient"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Profile URL
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <MessageCard
                          msg={message}
                          key={message._id?.toString()}
                          onDeleteMessage={onDeleteMessage}
                          copyEmbedCode={copyToClipboard}
                          messageRefs={messageRefs}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;