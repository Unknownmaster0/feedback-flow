"use client";

import MessageCard from "@/components/MessageCard";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import useGetSession from "@/hooks/useGetSession";
import { MessageInterface } from "@/models/models";
import { ApiResonseInterface } from "@/types/ApiResponse";
import { isAcceptingMessageSchema } from "@/validationSchema/isAcceptingMessageSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  Calendar,
  Copy,
  Download,
  Eye,
  Filter,
  Loader2,
  MessageSquare,
  RefreshCw,
  Share2,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [, setIsAcceptingMessageStatusLoading] = useState(false);
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

  if (status === "unauthenticated" || !session || !session.user) {
    return <div>Please Login</div>;
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
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent shadow-text">{session.user.userName}!</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Here&apos;s your feedback analytics and recent messages
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
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

/**
 <>
      <Separator className="w-screen" />
      <div className="text-xs sm:text-base mt-2 space-x-5 md:space-x-7 pl-5 shadow-sm flex items-center pb-1 sm:pb-2">
        PROFILE URL:<span className="space-x-1 sm:space-x-2"></span>
        <input
          type="text"
          value={profileURL}
          disabled
          className="min-w-[12rem] sm:min-w-[20rem] max-w-[30rem] bg-slate-700 text-center rounded-lg focus:border-none cursor-not-allowed text-[8px] sm:text-base text-zinc-300"
        />
        <FontAwesomeIcon
          icon={faCopy}
          className="text-xl text-zinc-200 bg-green-900 rounded-full p-2 cursor-pointer"
          onClick={() => copyToClipboard(profileURL)}
        />
      </div>
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
      <Separator className="border-zinc-400 shadow-md border-b-2" />
      <div className="flex flex-wrap space-x-6 p-2 space-y-2">
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
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
 */

/**
 import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Copy, 
  Trash2, 
  Settings, 
  MessageSquare, 
  Users, 
  BarChart3, 
  TrendingUp,
  Eye,
  RefreshCw,
  Share2,
  Filter,
  Calendar,
  Download
} from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: string;
  type: 'professional' | 'personal' | 'service' | 'general';
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Your dedication and hard work are truly admirable! You've accomplished so much, and it's evident that you're making progress. Keep pushing forward, and never doubt your capabilities.",
      createdAt: "2025-01-26T10:30:00Z",
      sender: "Anonymous",
      type: "professional"
    },
    {
      id: "2", 
      content: "You have a unique talent for bringing people together and creating a positive impact. Your kindness and empathy are strengths.",
      createdAt: "2025-01-25T15:45:00Z",
      sender: "Anonymous",
      type: "personal"
    },
    {
      id: "3",
      content: "Every challenge you face is an opportunity for growth, and you've demonstrated incredible resilience. Your determination is an inspiration to many.",
      createdAt: "2025-01-24T09:20:00Z", 
      sender: "Anonymous",
      type: "general"
    },
    {
      id: "4",
      content: "The service you provided was exceptional. Your attention to detail and professionalism made all the difference.",
      createdAt: "2025-01-23T14:15:00Z",
      sender: "Anonymous", 
      type: "service"
    }
  ]);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Mock user data
  const user = {
    username: "john_dev",
    profileViews: 247,
    profileViewsGrowth: 12, // % growth from last month
    totalMessages: messages.length,
    positiveRate: 87
  };

  const profileURL = `${window.location.protocol}//${window.location.host}/u/${user.username}`;

  const handleToggleMessages = async (checked: boolean) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAcceptingMessages(checked);
      toast({
        title: checked ? "Now accepting messages" : "Paused messages",
        description: checked 
          ? "You will receive new anonymous messages" 
          : "You won't receive new messages until you turn this back on",
      });
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Profile URL has been copied successfully.",
    });
  };

  const deleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
    toast({
      title: "Message deleted",
      description: "The message has been removed from your dashboard.",
      variant: "destructive"
    });
  };

  const refreshMessages = async () => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Messages refreshed",
        description: "Your feedback list has been updated.",
      });
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short", 
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        
        // Header 
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">Welcome back, </span>
                <span className="text-gradient">{user.username}!</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Here's your feedback analytics and recent messages
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </div>

        // Overview Dashboard Cards 
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          
          // Total Feedback Card 
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{user.totalMessages}</p>
                    <p className="text-sm text-muted-foreground">Total Feedback Received</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  All time
                </Badge>
              </div>
            </CardContent>
          </Card>

          // Profile Views Card 
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{user.profileViews}</p>
                    <p className="text-sm text-muted-foreground">Profile Views This Month</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+{user.profileViewsGrowth}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          // Public Profile URL Card 
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Public Profile URL</span>
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
                  <p className="text-xs text-muted-foreground truncate">{profileURL}</p>
                </div>
                
                // Focus Toggle 
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isAcceptingMessages ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">
                      {isAcceptingMessages ? "Focus Mode" : "Busy"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {loading && <Loader2 className="animate-spin h-4 w-4" />}
                    <Switch
                      checked={isAcceptingMessages}
                      onCheckedChange={handleToggleMessages}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        // Main Content Area 
        <div className="grid lg:grid-cols-4 gap-8">
          
          // Analytics Sidebar 
          <div className="lg:col-span-1 space-y-6">
            
            // Quick Stats 
            <Card className="card-modern animate-scale-in">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gradient">Quick Stats</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Positive Rate</span>
                  <span className="text-sm font-semibold">{user.positiveRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="text-sm font-semibold">12 new</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Response Rate</span>
                  <span className="text-sm font-semibold">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Length</span>
                  <span className="text-sm font-semibold">127 words</span>
                </div>
              </CardContent>
            </Card>

            // Feedback Types 
            <Card className="card-modern">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gradient">Feedback Types</h3>
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

          // Messages Panel 
          <div className="lg:col-span-3">
            <Card className="card-modern animate-slide-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gradient">Recent Feedback Messages</h3>
                    <p className="text-muted-foreground">Anonymous feedback from your community</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={refreshMessages}
                      disabled={refreshing}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-foreground mb-2">No messages yet</h4>
                    <p className="text-muted-foreground mb-4">Share your profile URL to start receiving feedback!</p>
                    <Button onClick={() => copyToClipboard(profileURL)} className="btn-gradient">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Profile URL
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <Card 
                        key={message.id}
                        className="border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">A</span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium text-foreground">Anonymous</p>
                                  <Badge className={`text-xs ${getTypeColor(message.type)}`}>
                                    {message.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => deleteMessage(message.id)}
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="text-foreground leading-relaxed">{message.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
 */
