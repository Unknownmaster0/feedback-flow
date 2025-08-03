"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Copy, Download, Image, Trash2 } from "lucide-react";
import { MessageInterface } from "@/models/models";
import axios, { AxiosError } from "axios";
import { ApiResonseInterface } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { exportMessageAsImage, generateEmbedCode } from "@/utils/export-data";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export type MessageCardProps = {
  msg: MessageInterface;
  onDeleteMessage: (msgId: string) => void;
  copyEmbedCode: (code: string) => void;
  messageRefs?: React.RefObject<Map<string, HTMLElement>>;
};

export default function MessageCard({
  msg,
  onDeleteMessage,
  copyEmbedCode,
  messageRefs,
}: MessageCardProps) {
  const { toast } = useToast();
  const [embedCode, setEmbedCode] = useState("");
  const [embedTheme, setEmbedTheme] = useState<"light" | "dark">("light");
  const [selectedMessage, setSelectedMessage] = useState<MessageInterface>(msg);

  useEffect(() => {
    const code = generateEmbedCode(msg, embedTheme);
    setEmbedCode(code);
  }, [msg, embedTheme]);

  const deleteMessage = async () => {
    try {
      const res = await axios.delete<ApiResonseInterface>(
        `/api/delete-message?msgId=${msg._id}`
      );
      const response = res.data;
      toast({
        title: "Message deleted successfully 🎉",
        description: response.message,
        color: "green",
      });
      onDeleteMessage(msg._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResonseInterface>;
      const status = axiosError.status as number;
      toast({
        title: status < 500 ? "Request error" : "Server error",
        description: axiosError.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  // Export message as image
  const handleExportAsImage = async (message: MessageInterface) => {
    try {
      if (messageRefs && messageRefs.current) {
        // Use the message's ID to get the correct element from messageRefs
        const messageElement = messageRefs.current.get(message._id as string);
        if (messageElement) {
          await exportMessageAsImage(messageElement, message);
          toast({
            title: "Image exported!",
            description: "Message has been downloaded as an image.",
          });
        } else {
          toast({
            title: "Export failed",
            description: "Could not find the message element to export.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description:
          "There was an error exporting the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const date = new Date(msg.createdAt);
  const finalDate = `${weekObj[date.getDay()]} ${monthObj[date.getMonth()]}-${date.getDate()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return (
    <Card
      key={msg._id?.toString()}
      ref={(el) => {
        if (el && messageRefs && messageRefs.current) {
          // Use _id instead of id to ensure correct reference storage
          messageRefs.current.set(msg._id as string, el);
        }
      }}
      className="border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
      style={{ animationDelay: `${msg.id * 0.1}s` }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-foreground">Anonymous</p>
              </div>
              <p className="text-xs text-muted-foreground">{finalDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => handleExportAsImage(msg)}
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              title="Export as image"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {}}
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Get embed code"
                >
                  <Code className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Export Message</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="embed" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="embed">HTML Embed</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="embed" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Theme</label>
                      <div className="flex space-x-2">
                        <Button
                          variant={
                            embedTheme === "light" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setEmbedTheme("light");
                          }}
                        >
                          Light
                        </Button>
                        <Button
                          variant={
                            embedTheme === "dark" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            setEmbedTheme("dark");
                          }}
                        >
                          Dark
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        HTML Embed Code
                      </label>
                      <Textarea
                        value={embedCode}
                        readOnly
                        rows={10}
                        className="font-mono text-xs"
                      />
                      <Button
                        onClick={() => copyEmbedCode(embedCode)}
                        className="w-full"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Embed Code
                      </Button>
                    </div>
                  </TabsContent>
                  {/* to preview the html */}
                  <TabsContent value="preview">
                    <div className="border rounded-lg p-4">
                      <div dangerouslySetInnerHTML={{ __html: embedCode }} />
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            <Button
              onClick={() => deleteMessage()}
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          className="text-foreground leading-relaxed message-content"
          dangerouslySetInnerHTML={{ __html: msg.content }}
        />
      </CardContent>
    </Card>
  );
}

export const weekObj: { [key: number]: string } = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

export const monthObj: { [key: number]: string } = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};
