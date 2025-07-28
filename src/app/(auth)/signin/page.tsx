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
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Form */}
        <div className="flex justify-center">
          <Card className="card-modern w-full max-w-md animate-fade-in">
            <CardHeader className="text-center pb-8">
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Enter your details to sign in
              </p>
            </CardHeader>
            <CardContent>
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
                  <Button type="submit" disabled={loading} className="btn-hero w-1/2 group">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" /> Please Wait
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      Don&apos;t have an account?{" "}
                      <Button
                        className="text-primary font-medium"
                        variant={"outline"}
                        onClick={() => router.push("/signup")}
                      >
                        Sign up
                      </Button>
                    </span>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Image */}
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

export default Signinform;
