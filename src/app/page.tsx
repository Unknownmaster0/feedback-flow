"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import useGetSession from "@/hooks/useGetSession";
import { ApiResonseInterface } from "@/types/ApiResponse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosError } from "axios";
import {
  ArrowRight,
  BarChart3,
  Globe,
  Loader2,
  MessageCircle,
  Shield,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  faTwitter,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

interface userPorotype {
  id: string;
  email: string;
  userName: string;
}

interface userWithProfileUrl extends userPorotype {
  profileUrl: string;
}

export default function Home() {
  const [users, setUsers] = useState<[userWithProfileUrl]>([
    { id: "", email: "", userName: "", profileUrl: "" },
  ]);
  const [loadingWhileGettingUser, setLoadingWhileGettingUser] = useState(true);
  const { session } = useGetSession();

  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const response = (
          await axios.get<ApiResonseInterface>(`/api/get-all-users`)
        ).data;
        if (response.success) {
          const users = response.data.users.map((user: userPorotype) => ({
            id: user.id,
            email: user.email,
            userName: user.userName,
            profileUrl: `/u/${user.userName}`,
          }));
          let finalUser = users;
          if (session && session.user) {
            finalUser = users.filter(
              (user: userPorotype) => user.userName !== session.user?.userName
            );
          }
          setUsers(finalUser);
        } else {
          toast({
            title: "Invalid response",
            description: response.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("error while getting user ", error);
        const axiosError = error as AxiosError<ApiResonseInterface>;
        const status = axiosError.status as number;
        toast({
          title: status < 500 ? "Request error" : "Server error",
          description: axiosError.response?.data?.message,
          variant: "destructive",
        });
      } finally {
        setLoadingWhileGettingUser(false);
      }
    })();
  }, [setUsers, toast]);

  // to avoid the hydration issue of the react and next.js. the content don't match with pre-rendered and server side content sent.
  if (typeof window === "undefined") {
    return (
      <>
        <Loader2 className="animate-spin" /> Please Wait
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium"
          >
            {`Trusted by 10,000+ professionals worldwide`}
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Collect Meaningful <span className="text-gradient">Feedback</span>{" "}
            from Anyone, Anywhere
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            {`Create your personalized feedback page and start receiving valuable
            insights from clients, colleagues, and customers in minutes.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="btn-hero text-lg px-8 py-4">
                {`Get Started - It's Free`}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {`No credit card required • Set up in 2 minutes`}
          </p>
        </div>

        {/* Mockup Visual  */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-card rounded-2xl border shadow-2xl p-8 animate-slide-up">
              <div className="bg-gradient-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Your Feedback Page
                    </h3>
                    <p className="text-muted-foreground">
                      feedback-message.com/u/yourname
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Recent feedback:
                    </p>
                    <p className="text-foreground">
                      {`Your leadership skills have really impressed our team...`}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      {` Anonymous feedback:`}
                    </p>
                    <p className="text-foreground">
                      {`Great collaboration on the project. Your insights were
                      valuable...`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* features section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Everything You Need to Collect Great Feedback
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you gather meaningful insights
              and build stronger relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-modern hover-lift group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Anonymous Collection
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  People can share honest feedback without fear. Create a safe
                  space for authentic conversations.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern hover-lift group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  AI-Powered Suggestions
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Help others write better feedback with smart prompts and
                  constructive language suggestions.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern hover-lift group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Embeddable Widgets
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Showcase testimonials on your website automatically with
                  beautiful, customizable widgets.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern hover-lift group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Real-time Notifications
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant alerts when new feedback arrives. Never miss
                  important insights from your network.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern hover-lift group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Custom Branding</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Match your brand colors and style. Create a consistent
                  experience that reflects your identity.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern hover-lift group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Analytics Dashboard
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track feedback trends and sentiment over time. Understand
                  patterns and measure improvement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section  */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who are building trust through
              authentic feedback.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="card-modern text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-gradient mb-2">
                  10,000+
                </div>
                <p className="text-xl text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            <Card className="card-modern text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-gradient mb-2">
                  50,000+
                </div>
                <p className="text-xl text-muted-foreground">
                  Feedback Messages Collected
                </p>
              </CardContent>
            </Card>
            <Card className="card-modern text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-gradient mb-2">95%</div>
                <p className="text-xl text-muted-foreground">
                  User Satisfaction Rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-modern">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  {`This platform has revolutionized how I collect feedback from
                  my team. The anonymous feature encourages honest
                  communication.`}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    S
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">
                      Product Manager at TechCorp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  {`The AI suggestions feature helps people give more
                  constructive feedback. It's been a game-changer for our
                  company culture.`}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    M
                  </div>
                  <div>
                    <p className="font-semibold">Mike Rodriguez</p>
                    <p className="text-sm text-muted-foreground">
                      HR Director at StartupXYZ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  {`Simple to set up, beautiful interface, and the analytics help
                  me understand my growth areas. Highly recommended!`}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    A
                  </div>
                  <div>
                    <p className="font-semibold">Alex Thompson</p>
                    <p className="text-sm text-muted-foreground">
                      Freelance Designer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              {`Ready to Start Collecting Feedback?`}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {`Join thousands of professionals who are already building trust
              through authentic feedback.`}
            </p>
            <Link href="/signup">
              <Button size="lg" className="btn-hero text-lg px-8 py-4 mb-4">
                {`Get Started - It's Free`}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              {`No credit card required • Set up in 2 minutes`}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">
                  Feedback Message
                </span>
              </div>
              <p className="text-muted-foreground">
                Building trust through authentic feedback, one conversation at a
                time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Feedback Message. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href={process.env.NEXT_PUBLIC_TWITTER_URI}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_LINKEDIN_URI}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_GITHUB_URI}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// function UserProfileUrl({ user }: { user: userWithProfileUrl }) {
//   // Use a conditional check to ensure window is defined (client-side only)
//   const fullUrl =
//     typeof window !== "undefined"
//       ? `${window.location.protocol}//${window.location.host}${user.profileUrl}`
//       : `${user.profileUrl}`;

//   return (
//     <div className="w-full flex items-center lg:space-x-4 pl-5 pb-4 space-x-2 md:space-x-3">
//       <span className="font-extralight text-sm shadow-md p-2 rounded-md text-center text-pretty cursor-not-allowed">
//         {user.userName}
//       </span>
//       <Input
//         value={fullUrl}
//         disabled
//         type="text"
//         className="p-1 sm:p-2 md:p-4 w-1/2"
//       />
//       <a href={`${user.profileUrl}`} target="_blank">
//         <FontAwesomeIcon icon={faArrowRight} />
//       </a>
//     </div>
//   );
// }
