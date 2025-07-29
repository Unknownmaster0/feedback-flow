"use client";

import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
// import ButtonComponent from "./ButtonComponent";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import useGetSession from "@/hooks/useGetSession";
import { useToast } from "@/hooks/use-toast";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import { Session } from "next-auth";
import { LogOut, Menu, MessageCircle, Settings, User, X } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const pathname = usePathname();
  const [isSendMessagePage, setIsSendMessagePage] = useState(false);
  const [serverSession, setServerSession] = useState<Session | null>(null);
  const [, setUserDropDownMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { session } = useGetSession();

  useEffect(() => {
    setIsSendMessagePage(pathname.startsWith("/u/"));
  }, [setIsSendMessagePage, pathname]);

  useEffect(() => {
    if (!session) {
      return;
    }
    if (session && session.user && session.user.id) {
      setServerSession(session); //todo: correct the type here.
    }
  }, [session, setServerSession]); //todo: correct the type error later.

  async function onClickHandler() {
    try {
      const data = await signOut({
        redirect: false,
        callbackUrl: "/signin",
      });
      setServerSession(null);
      toast({
        title: "Information",
        description: "You are logged out!",
        color: "red",
      });
      router.push(data.url);
    } catch (error) {
      console.log(`error while deleting cookie from server`, error);
    }
  }

  function showList() {
    setUserDropDownMenu((prev) => !prev);
  }

  // Special header for user message pages
  if (isSendMessagePage) {
    return (
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform">
                {process.env.NEXT_PUBLIC_SMTP_COMPANY}
              </span>
            </Link>
            <div className="text-lg md:text-xl font-semibold text-foreground">
              Public Profile URL
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-border/50 shadow-sm">
      {/* APP NAME BAR ON NAV-BAR */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform">
              {process.env.NEXT_PUBLIC_SMTP_COMPANY}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            {serverSession && serverSession.user && (
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-3">
            {serverSession && serverSession.user ? (
              <>
                <div className="space-x-10" onClick={showList}>
                  <MenuBar text={`Welcome ${serverSession.user.userName}`} />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-destructive/10 hover:text-destructive"
                  onClick={onClickHandler}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <Link href="/signin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-muted"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="btn-gradient" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu buttons */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu - positioned as overlay on right side */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed right-0 top-16 w-64 bg-white backdrop-blur-md border-l border-border/50 shadow-medium py-4 px-4 space-y-4 z-50 animate-slide-up rounded-bl-md">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              {serverSession && serverSession.user && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div className="border-t border-border/30 pt-4 flex flex-col space-y-3">
              {serverSession && serverSession.user ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="justify-start hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="justify-start hover:bg-destructive/10 hover:text-destructive"
                    onClick={onClickHandler}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start hover:bg-muted"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="btn-gradient w-full" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

function MenuBar({ text }: { text: string }) {
  const router = useRouter();
  const pathHandler = function (num: number) {
    router.push(num == 1 ? "/" : "/dashboard");
  };
  return (
    <Menubar className="bg-white/90 backdrop-blur-sm border border-border/50 shadow-medium rounded-xl transition-all duration-300 hover:shadow-glow">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer text-gradient font-medium">
          {text}
        </MenubarTrigger>
        <MenubarContent className="card-modern">

          <MenubarItem
            onClick={() => pathHandler(1)}
            className="hover:bg-gradient-secondary hover:text-primary font-medium transition-colors duration-300"
          >
            HOME
          </MenubarItem>
          <MenubarSeparator className="bg-border/30" />
          <MenubarItem
            onClick={() => pathHandler(2)}
            className="hover:bg-gradient-secondary hover:text-primary font-medium transition-colors duration-300"
          >
            DASHBOARD
          </MenubarItem>
          <MenubarSeparator className="bg-border/30" />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default Navbar;

/**
 **Original code**
 <nav className="bg-white dark:bg-gray-900 border-transparent">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <FontAwesomeIcon
            icon={faEnvelopeOpenText}
            className="text-2xl lg:text-3xl"
          />
          <span className="self-center sm:text-lg md:text-xl lg:text-2xl font-semibold whitespace-nowrap dark:text-white font-serif tracking-tight hidden sm:flex">
            {process.env.NEXT_PUBLIC_SMTP_COMPANY}
          </span>
        </Link>
        {isSendMessagePage ? (
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-900 sm:font-bold">
            Public Profile URL
          </div>
        ) : (
          <>
            <div className="flex items-center md:order-2 space-x-3 md:space-x-3">
              {serverSession && serverSession.user ? (
                <>
                  <div className="space-x-10" onClick={showList}>
                    <MenuBar text={`Welcome ${serverSession.user.userName}`} />
                  </div>
                  <ButtonComponent
                    text={"SIGN OUT"}
                    onClickHandler={onClickHandler}
                  />
                </>
              ) : (
                <>
                  <ButtonComponent
                    text={"SIGN IN"}
                    onClickHandler={() => router.push("/signin")}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
 */

/**
 import { Button } from "@/components/ui/button";
import { MessageCircle, User, Settings, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const isAuthPage = ["/signin", "/signup"].includes(location.pathname);
  const isDashboard = location.pathname === "/dashboard";
  const isUserMessagePage = location.pathname.startsWith("/u/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAuthPage) {
    return null; // Don't show navbar on auth pages
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          // Logo 
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform">
              {process.env.NEXT_PUBLIC_SMTP_COMPANY}
            </span>
          </Link>

          // Desktop Navigation Links 
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <a 
              href="#features" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#about" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            {isDashboard && (
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          // Desktop Actions 
          <div className="hidden md:flex items-center space-x-4">
            {isDashboard ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">Welcome back!</span>
                <Button size="sm" variant="ghost" className="hover:bg-muted">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button size="sm" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/signin">
                  <Button variant="ghost" size="sm" className="hover:bg-muted">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="btn-gradient" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          // Mobile Menu Button 
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

         // Mobile Menu 
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <a 
                href="#features" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#about" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              {isDashboard && (
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
            
            <div className="border-t border-border/50 pt-4 flex flex-col space-y-3">
              {isDashboard ? (
                <>
                  <Button size="sm" variant="ghost" className="justify-start hover:bg-muted">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button size="sm" variant="ghost" className="justify-start hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-muted">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="btn-gradient w-full" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
 */
