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
import { ApiResonseInterface } from "@/types/ApiResponse";
import { verificationCodeZodSchema } from "@/validationSchema/verificationCodeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const page = () => {
  const [loadingSubmit, setloadingSubmit] = useState(false);
  const queryParams = useSearchParams();
  const userName = queryParams.get("userName");

  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(verificationCodeZodSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof verificationCodeZodSchema>) => {
    setloadingSubmit(true);
    try {
      const response = (
        await axios.post(`/api/verify-otp?userName=${userName}`, {
          otp: value.verificationCode,
        })
      ).data;
      if (!response.success) {
        toast({
          title: "verification error",
          description: response.message,
          variant: "destructive",
        });
      }

      router.push(`/dashboard`);
      toast({
        title: "Response",
        description: response.message,
      });
    } catch (error) {
      console.error("error while verifying user ", error);
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
      <div className="flex items-center justify-center pt-10">
        <div className="w-full max-w-sm p-4 bg-white border border-slate-800 rounded-lg shadow sm:p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        {...field}
                        className="border-slate-900"
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
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default page;
