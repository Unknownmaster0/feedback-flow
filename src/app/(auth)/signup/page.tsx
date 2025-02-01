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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";

const Signupform = () => {
  const [userName, setUserName] = useState("");
  const [loadingVerifyingUsername, setLoadingVerifyingUsername] =
    useState(false);
  const [userNameMessage, setUserNameMessage] = useState("");
  const [loadingSubmit, setloadingSubmit] = useState(false);

  const [debounceUserName, ] = useDebounceValue(
    userName,
    1000
  );

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

  return (
    <div className="max-h-screen">
      <div className="grid sm:pt-4 md:pt-10 grid-cols-2 sm:px-4 md:px-8 lg:px-10">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm p-4 bg-white border rounded-lg shadow-lg sm:p-6 md:p-8">
            <TopBar label="Sign up" to="signup" text="Enter the details to " />
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
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user_name01"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setUserName(e.target.value);
                          }}
                          className="border-slate-800"
                        />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@gmail.com"
                          {...field}
                          className="border-slate-800"
                        />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="*********"
                          {...field}
                          className="border-slate-800"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loadingSubmit}>
                  {loadingSubmit ? (
                    <>
                      <Loader2 className="animate-spin" /> Please Wait
                    </>
                  ) : (
                    "submit"
                  )}
                </Button>
                <div style={{ marginLeft: "10px" }}>
                  <span className="text-lg font-normal text-slate-900 ">
                    Already have an account?
                  </span>
                  <Link
                    href="/signin"
                    className="cursor-pointer pl-1 text-blue-500 underline"
                  >
                    sign-in
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="bg-[#FBE9D0] lg:text-4xl text-pretty md:text-2xl sm:text-xl text-lg lg:p-10 md:p-8 sm:p-6 p-4 rounded-md shadow-md flex items-center">
          <div className="text-gray-600 font-serif animate-in">
            Connect authentically and anonymously; your feedback can inspire
            growth without the fear of judgment.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signupform;
