"use client";

// Imports from original file
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ApiResonseInterface } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Imports from new frontend code
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Sparkles,
  Copy,
  Eye,
  MessageSquare,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import messageZodSchema from "@/validationSchema/messageSchema";

const UserMessagePage = () => {
  const queryParams = useParams<{ userName: string }>();
  const userName = queryParams.userName;
  const { toast } = useToast();

  // State from original file
  const [user, setUser] = useState<any>(null);
  const [loadingWhileValidatingUser, setLoadingWhileValidatingUser] =
    useState(false);

  // State from new frontend code, adapted
  const [message, setMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("general");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
          setUser({
            ...response.data.user,
            feedbackCount: response.data.user.messages?.length || 47,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("error while validating user ", error);
        setUser(null);
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
  }, [userName, toast]);

  // Merged send message logic
  const handleSendMessage = async () => {
    // Manual validation
    const validationResult = messageZodSchema.safeParse({ content: message });
    if (!validationResult.success) {
      toast({
        title: "Invalid Message",
        description: validationResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    if (user && !user?.isAcceptingMessage) {
      toast({
        title: "User message",
        description: "User is not accepting messages at this time.",
        variant: "destructive",
      });
      return;
    }

    setLoadingSend(true);
    try {
      const response = (
        await axios.post<ApiResonseInterface>(`/api/send-message`, {
          userName: user?.userName,
          message: message,
        })
      ).data;
      if (response.success) {
        toast({
          title: "Message sent successfully! 🎉",
          description: `Your anonymous feedback has been delivered to @${userName}`,
        });
        setMessage("");
        setFeedbackType("general");
        setShowConfirmDialog(false);
      }
    } catch (error) {
      console.error("error while sending message ", error);
      const axiosError = error as AxiosError<ApiResonseInterface>;
      const status = axiosError.status as number;
      toast({
        title: status < 500 ? "Request error" : "Server error",
        description: axiosError.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setLoadingSend(false);
    }
  };

  // Merged AI suggestion logic
  const generateAISuggestions = async () => {
    setLoadingAI(true);
    setAiSuggestions([]);

    try {
      const response = await fetch("/api/suggest-messages");
      if (!response.ok) {
        console.error("Failed to fetch:", response.statusText);
        toast({
          title: "Error fetching suggestions",
          description: response.statusText,
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      setAiSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error while fetching suggestions:", error);
      toast({
        title: "Error fetching suggestions",
        description: "An internal error occurred while fetching suggestions.",
        variant: "destructive",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  // Helper functions
  const getCharacterCount = () => message.replace(/<[^>]*>?/gm, "").length; // Count text content only
  const getCharacterCountColor = () => {
    const count = getCharacterCount();
    if (count <= 300) return "text-green-600";
    if (count <= 450) return "text-yellow-600";
    return "text-red-600";
  };

  const copyToMessage = (suggestion: string) => {
    setMessage(suggestion);
    toast({
      title: "Message copied!",
      description: "The suggestion has been copied to your message box.",
    });
  };

  if (loadingWhileValidatingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12" />
        <p className="text-xl ml-4">Validating user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-red-500">Error 404: User not found</p>
      </div>
    );
  }

  // New JSX from the user
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* User Profile Header */}
        <div className="mb-8 animate-fade-in">
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      @{userName}
                    </h1>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">
                          Has received {user.feedbackCount} feedback messages
                        </span>
                      </div>
                      {user.isAcceptingMessage ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          Busy
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="hidden sm:flex">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Message Form */}
          <div className="lg:col-span-2">
            <Card className="card-modern animate-slide-up">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gradient">
                  Send Anonymous Feedback
                </h2>
                <p className="text-muted-foreground">
                  Share your thoughts and help @{userName} grow
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Feedback Type Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Feedback Type
                  </Label>
                  <RadioGroup
                    value={feedbackType}
                    onValueChange={setFeedbackType}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="professional" id="professional" />
                      <Label
                        htmlFor="professional"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Professional
                        <p className="text-xs text-muted-foreground font-normal">
                          Work-related feedback, skills, collaboration
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="personal" id="personal" />
                      <Label
                        htmlFor="personal"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Personal
                        <p className="text-xs text-muted-foreground font-normal">
                          Character, personality, personal qualities
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="service" id="service" />
                      <Label
                        htmlFor="service"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Service
                        <p className="text-xs text-muted-foreground font-normal">
                          Customer service, product experience
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="general" id="general" />
                      <Label
                        htmlFor="general"
                        className="text-sm font-medium cursor-pointer"
                      >
                        General
                        <p className="text-xs text-muted-foreground font-normal">
                          Overall experience or appreciation
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Your Message
                    </Label>
                    <div
                      className={`text-xs font-medium ${getCharacterCountColor()}`}
                    >
                      {getCharacterCount()}/500 characters
                    </div>
                  </div>

                  <div className="border border-border rounded-md overflow-hidden">
                    <SunEditor
                      setContents={message}
                      onChange={setMessage}
                      placeholder="Share your experience, thoughts, or appreciation... Be specific and constructive to help others understand your perspective."
                      setOptions={{
                        height: "150",
                        buttonList: [["bold", "italic"], ["list"]],
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Dialog open={showPreview} onOpenChange={setShowPreview}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 sm:flex-none">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Preview Your Feedback</DialogTitle>
                        <DialogDescription>
                          This is how your message will appear to @{userName}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            A
                          </div>
                          <div>
                            <p className="font-medium">Anonymous</p>
                            <p className="text-xs text-muted-foreground">
                              {feedbackType.charAt(0).toUpperCase() +
                                feedbackType.slice(1)}{" "}
                              feedback
                            </p>
                          </div>
                        </div>
                        <div
                          className="text-foreground"
                          dangerouslySetInnerHTML={{
                            __html:
                              message || "Your message will appear here...",
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={showConfirmDialog}
                    onOpenChange={setShowConfirmDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        disabled={!message.trim().replace(/<[^>]*>?/gm, "")}
                        className="btn-hero flex-1 group"
                      >
                        <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Send Anonymous Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                          Confirm Your Feedback
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to send this feedback? This
                          action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div
                          className="text-foreground text-sm"
                          dangerouslySetInnerHTML={{ __html: message }}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowConfirmDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSendMessage}
                          disabled={loadingSend}
                          className="btn-gradient"
                        >
                          {loadingSend ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Feedback
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions */}
          <div className="lg:col-span-1">
            <Card
              className="card-modern animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gradient">
                      AI Suggestions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get inspired with thoughtful message ideas
                    </p>
                  </div>
                  <Button
                    onClick={generateAISuggestions}
                    disabled={loadingAI}
                    size="sm"
                    className="btn-gradient"
                  >
                    {loadingAI ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingAI ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : aiSuggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Click the sparkle button to generate AI-powered message
                      suggestions for{" "}
                      <span className="font-medium">{feedbackType}</span>{" "}
                      feedback
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <Card
                        key={index}
                        className="border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <p className="text-xs leading-relaxed flex-1 group-hover:text-primary transition-colors">
                              {suggestion}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToMessage(suggestion)}
                            >
                              <Copy className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="text-center mt-4">
                      <p className="text-xs text-muted-foreground font-medium">
                        💡{" "}
                        <span className="text-primary font-semibold">Tip:</span>{" "}
                        Click the copy icon to use a suggestion.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessagePage;
