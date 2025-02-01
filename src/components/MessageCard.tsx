"use client";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MessageInterface } from "@/models/models";
import axios, { AxiosError } from "axios";
import { ApiResonseInterface } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";

export type MessageCardProps = {
  msg: MessageInterface;
  onDeleteMessage: (msgId: string) => void;
};

export default function MessageCard({
  msg,
  onDeleteMessage,
}: MessageCardProps) {
  const { toast } = useToast();

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

  const date = new Date(msg.createdAt);
  const finalDate = `${weekObj[date.getDay()]} ${monthObj[date.getMonth()]}-${date.getDate()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          <div className="text-pretty flex-grow">{msg.content}</div>
          <div className="">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your message from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteMessage}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
        {/* <CardDescription>{msg.content}</CardDescription> */}
      </CardHeader>
      {/* <CardContent>{msg.content}</CardContent> */}
      <CardFooter>{`${finalDate}`}</CardFooter>
    </Card>
  );
}

const weekObj: { [key: number]: string } = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

const monthObj: { [key: number]: string } = {
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
