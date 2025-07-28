"use client";
import {
  Card,
  CardContent,
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
import {
  Badge,
  Copy,
  Filter,
  MessageSquare,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
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
    <Card
      key={msg.id}
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
          <Button
            onClick={() => deleteMessage()}
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-foreground leading-relaxed">{msg.content}</p>
      </CardContent>
    </Card>
  );
}

/* 
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
    // <CardDescription>{msg.content}</CardDescription> 
  </CardHeader>
  // <CardContent>{msg.content}</CardContent> 
  <CardFooter>{`${finalDate}`}</CardFooter>
</Card>
*/

/**
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
 */

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
