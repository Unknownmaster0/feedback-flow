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
import { useToast } from "@/hooks/use-toast";
import signInZodSchema from "@/validationSchema/signinSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { TopBar } from "@/components/TopBar";

const Signinform = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signInZodSchema>>({
    resolver: zodResolver(signInZodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof signInZodSchema>) => {
    console.log("value in onSubmit: ", value);
    setLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      email: value.email,
      password: value.password,
    });

    if (response?.error) {
      toast({
        title: "Request invalid",
        description: response.error,
        variant: "destructive",
      });
    }

    if (response?.url) {
      // * success response.
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="max-h-screen">
      <div className="grid sm:pt-4 md:pt-10 grid-cols-2 sm:px-4 md:px-8 lg:px-10">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm p-4 bg-white border rounded-lg shadow-lg sm:p-6 md:p-8">
            <TopBar label="Sign in" to="signin" text="Enter the details to " />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Please Wait
                    </>
                  ) : (
                    "Sign-in"
                  )}
                </Button>
                <div style={{ marginLeft: "10px" }}>
                  <span className="text-lg font-normal text-slate-900 ">
                    Create an Account -
                  </span>
                  <Link
                    href="/signup"
                    className="cursor-pointer pl-1 text-blue-500 underline"
                  >
                    Sign-up
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

export default Signinform;
