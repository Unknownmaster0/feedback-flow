"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/validationSchema/signUpSchema";
import { useDebounceValue } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResonseInterface } from "@/types/ApiResponse";
import { ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Signupform = () => {
  const [userName, setUserName] = useState("");
  const [loadingVerifyingUsername, setLoadingVerifyingUsername] =
    useState(false);
  const [userNameMessage, setUserNameMessage] = useState("");
  const [loadingSubmit, setloadingSubmit] = useState(false);

  const [debounceUserName] = useDebounceValue(userName, 1000);

  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (debounceUserName) {
        setLoadingVerifyingUsername(true);
        setUserNameMessage("");
        try {
          const response = (
            await axios.get<ApiResonseInterface>(
              `/api/validating-username?userName=${debounceUserName}`
            )
          ).data;
          // todo: may check the response.success here
          setUserNameMessage(response.message);
        } catch (error) {
          //   console.log("came in the catch part", error);
          const axiosError = error as AxiosError<ApiResonseInterface>;
          setUserNameMessage(
            axiosError.response?.data.message ?? "error with username"
          );
        } finally {
          setLoadingVerifyingUsername(false);
        }
      }
    })();
  }, [debounceUserName]);

  const onSubmit = async (value: z.infer<typeof signUpSchema>) => {
    // console.log("value in onSubmit: ", value);
    setloadingSubmit(true);
    try {
      const response = (await axios.post("/api/signUp", value)).data;
      // console.log(response);
      if (!response.success) {
        // todo: check when the signup response is not success.
        toast({
          title: "Registration error",
          description: response.message,
        });
      }

      toast({
        title: "Successfully registered 🎉🎉🎉",
        description: response.message,
        variant: "default",
        color: "yellow",
      });

      router.replace(`/verify-otp?userName=${userName}`);
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
      setloadingSubmit(false);
    }
  };

  const labelStyle = "text-sm font-medium";

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side form */}
        <div className="flex justify-center">
          <Card className="card-modern w-full max-w-md animate-fade-in">
            <CardHeader className="text-center pb-8">
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Join Our Community
              </h1>
              <p className="text-muted-foreground">
                Create your account to get started
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    name="userName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                            <Input
                              placeholder="user_name01"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setUserName(e.target.value);
                              }}
                              className="input-modern pl-10 pr-10"
                            />
                          </div>
                        </FormControl>
                        {loadingVerifyingUsername && (
                          <Loader2 className="animate-spin" />
                        )}
                        <p
                          className={`${userNameMessage === "Valid userName" ? "text-green-700" : "text-red-700"}`}
                        >
                          {userNameMessage}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                            <Input
                              type="email"
                              placeholder="user@gmail.com"
                              {...field}
                              className="input-modern pl-10 pr-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                            <Input
                              placeholder="*********"
                              {...field}
                              className="input-modern pl-10 pr-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loadingSubmit}>
                    {loadingSubmit ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Button
                        className="text-primary font-medium"
                        variant={"outline"}
                        onClick={() => router.push("/signin")}
                      >
                        Sign In
                      </Button>
                    </span>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right side content */}
        <div className="lg:pl-12 animate-slide-up">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-gradient">Connect authentically</span>
              <br />
              <span className="text-slate-800 dark:text-slate-200">
                and anonymously
              </span>
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Your feedback can inspire growth without the fear of judgment.
              Join our community of authentic communicators.
            </p>

            <div className="grid gap-4 mt-8">
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-foreground font-medium">
                  Create your anonymous profile
                </span>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-foreground font-medium">
                  Receive honest, constructive feedback
                </span>
              </div>

              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-foreground font-medium">
                  Grow and improve with confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signupform;
