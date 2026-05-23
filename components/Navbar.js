"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { useNotifications } from "@/hooks/useNotifications";

import { useTheme } from "next-themes";

import { useAuthContext } from "@/contexts/AuthContext";

import {
  Menu,
  X,
  BookOpen,
  ChevronDown,
  User,
  Activity,
  LogOut,
  Settings,
  Sparkles,
  Home,
  Mail,
  Bell,
  UserCheck,
  Sun,
  Moon,
  Keyboard,
} from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  const [
    isNotificationOpen,
    setIsNotificationOpen,
  ] = useState(false);

  const [scrollProgress, setScrollProgress] =
    useState(0);

  const [mounted, setMounted] =
    useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const {
    user,
    userProfile,
    signOut,
    isAuthenticated,
  } = useAuthContext();

  const dropdownRef = useRef(null);

  const pathname = usePathname();

  const { theme, setTheme } =
    useTheme();

  // Mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(
        window.scrollY / 100,
        1
      );

      setScrollProgress(progress);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  // Outside click
  const handleClickOutside =
    useCallback((event) => {
      if (
        dropdownRef.current &&
        event.target &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setIsDropdownOpen(false);
        setIsNotificationOpen(false);
      }
    }, []);

  useEffect(() => {
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [handleClickOutside]);

  // Escape support
  useEffect(() => {
    const closeMenus = () => {
      setIsDropdownOpen(false);
      setIsNotificationOpen(false);
      setIsMenuOpen(false);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeMenus();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, []);

  // Prevent body scroll
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add(
        "overflow-hidden"
      );
    } else {
      document.body.classList.remove(
        "overflow-hidden"
      );
    }

    return () =>
      document.body.classList.remove(
        "overflow-hidden"
      );
  }, [isMenuOpen]);

  // Route change close
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsNotificationOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);

    await signOut();
  };

  const getUserInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (userProfile?.fullName)
      return userProfile.fullName;

    if (user?.displayName)
      return user.displayName;

    if (user?.email)
      return user.email.split("@")[0];

    return "User";
  };

  const getUserPhoto = () =>
    user?.photoURL || null;

  const getUserRole = () => {
    if (!userProfile?.role)
      return "User";

    return (
      userProfile.role.charAt(0).toUpperCase() +
      userProfile.role.slice(1)
    );
  };

  const getDashboardLink = () => {
    if (!userProfile?.role)
      return "/profile";

    switch (userProfile.role) {
      case "student":
        return "/student/dashboard";

      case "teacher":
        return "/teacher/dashboard";

      case "institute":
        return "/institute/dashboard";

      case "admin":
        return "/admin/dashboard";

      default:
        return "/profile";
    }
  };

  const navigationItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/productivity",
      label: "Focus",
      icon: Sparkles,
    },
    {
      href: "/activity",
      label: "Activities",
      icon: Activity,
    },
    {
      href: "/contact",
      label: "Contact",
      icon: Mail,
    },
  ];

  const userMenuItems = [
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      key: "profile",
    },
    {
      href: getDashboardLink(),
      icon: Activity,
      label: "Dashboard",
      key: "dashboard",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      key: "settings",
    },
  ].filter(
    (item) =>
      !(
        item.key === "dashboard" &&
        item.href === "/profile"
      )
  );

  const handleImageError = (e) => {
    const img = e.target;

    const fallback =
      img.parentElement?.querySelector(
        ".fallback-avatar"
      );

    if (img && fallback) {
      img.style.display = "none";
      fallback.style.display = "flex";
    }
  };

  const scrollProgressValue =
    Number.isFinite(scrollProgress)
      ? scrollProgress
      : 0;

  return (
    <>
      {/* Background Blur */}
      <div
        className="fixed w-full top-0 z-60 h-24 bg-linear-to-b from-black/60 via-black/10 to-transparent pointer-events-none transition-opacity duration-300"
        style={{
          opacity:
            1 -
            scrollProgressValue * 0.5,
        }}
      />

      {/* Navbar */}
      <nav
        className="fixed w-full top-0 left-0 right-0 z-70 transition-all duration-300 ease-out"
        style={{
          backgroundColor: !mounted
            ? "rgba(255,255,255,0.8)"
            : theme === "dark"
            ? scrollProgressValue > 0
              ? "rgba(15,23,42,0.85)"
              : "rgba(15,23,42,0.65)"
            : scrollProgressValue > 0
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.7)",

          backdropFilter:
            "blur(20px)",

          WebkitBackdropFilter:
            "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3"
            >
              <div className="bg-linear-to-br from-accent to-blue-500 p-2 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>

              <div className="flex flex-col justify-center">
                <span className="font-bold tracking-tight text-gray-950 dark:text-white text-xl leading-none">
                  Learnova
                </span>

                <span className="text-accent dark:text-blue-400 uppercase tracking-widest font-bold text-[10px] mt-1">
                  Premium
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2">

              <div className="flex items-center space-x-1 bg-gray-900/5 dark:bg-white/5 p-1.5 rounded-full border border-gray-200/50 dark:border-white/10 backdrop-blur-md">

                {navigationItems.map(
                  (item) => {
                    const isActive =
                      pathname ===
                      item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-5 py-1.5 rounded-full text-sm transition-all duration-300 ${
                          isActive
                            ? "bg-white dark:bg-gray-800 text-gray-950 dark:text-white font-semibold shadow-sm"
                            : "text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 font-medium"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  }
                )}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() =>
                    setTheme(
                      theme ===
                        "dark"
                        ? "light"
                        : "dark"
                    )
                  }
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 bg-gray-900/5 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 transition-colors"
                >
                  {theme ===
                  "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setIsMenuOpen(
                    !isMenuOpen
                  )
                }
                className="sm:hidden p-2 h-auto rounded-full text-gray-800 dark:text-gray-100 bg-gray-900/5 dark:bg-white/5 border border-gray-200/50 dark:border-white/10"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-49 md:hidden"
            onClick={() =>
              setIsMenuOpen(false)
            }
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background text-foreground z-52 md:hidden border-l border-border shadow-2xl flex flex-col">

            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between shrink-0">

              <h2 className="text-lg font-bold text-foreground">
                Menu
              </h2>

              <Button
                variant="ghost"
                size="sm"
                aria-label="Close menu"
                onClick={() =>
                  setIsMenuOpen(false)
                }
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain">

              {/* User */}
              {isAuthenticated && (
                <div className="p-5 pb-2">

                  <div className="flex items-center space-x-4 mb-5 p-4 rounded-3xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50">

                    <div className="relative w-12 h-12 shrink-0">

                      {getUserPhoto() ? (
                        <Image
                          src={getUserPhoto()}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                          onError={
                            handleImageError
                          }
                        />
                      ) : (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-base font-bold text-white">
                            {getUserInitials(
                              getUserDisplayName()
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">
                        {getUserDisplayName()}
                      </h3>

                      <p className="text-gray-500 dark:text-gray-400 text-xs truncate mb-1">
                        {user?.email || ""}
                      </p>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                        {getUserRole()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="px-5 py-4 space-y-6">

                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-3">
                    Navigation
                  </h4>

                  <div className="space-y-1">

                    {navigationItems.map(
                      (item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() =>
                            setIsMenuOpen(
                              false
                            )
                          }
                          className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl group transition-colors"
                        >
                          <item.icon className="h-5 w-5 mr-4 text-gray-400 dark:text-gray-500 group-hover:text-accent transition-colors" />

                          <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                            {item.label}
                          </span>
                        </Link>
                      )
                    )}
                  </div>
                </div>

                {/* Account */}
                {isAuthenticated && (
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-3">
                      Account
                    </h4>

                    <div className="space-y-1">

                      {userMenuItems.map(
                        (item) => (
                          <Link
                            key={item.key}
                            href={
                              item.href
                            }
                            onClick={() =>
                              setIsMenuOpen(
                                false
                              )
                            }
                            className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl group transition-colors"
                          >
                            <item.icon className="h-5 w-5 mr-4 text-gray-400 dark:text-gray-500 group-hover:text-accent transition-colors" />

                            <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                              {
                                item.label
                              }
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border space-y-4 shrink-0">

              {isAuthenticated ? (
                <Button
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={
                    handleLogout
                  }
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full bg-linear-to-r from-accent to-blue-500 hover:from-accent/90 hover:to-blue-600 text-white"
                >
                  <Link
                    href="/auth?mode=signup"
                    onClick={() =>
                      setIsMenuOpen(
                        false
                      )
                    }
                  >
                    <Sparkles className="h-4 w-4 mr-3" />
                    Get Started
                  </Link>
                </Button>
              )}

              <div className="text-center space-y-3">

                <button
                  onClick={() => {
                    setIsMenuOpen(
                      false
                    );

                    window.dispatchEvent(
                      new CustomEvent(
                        "learnova:open-shortcuts"
                      )
                    );
                  }}
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors text-xs font-medium"
                >
                  <Keyboard className="h-4 w-4 text-accent" />

                  <span>
                    Keyboard
                    Shortcuts
                  </span>
                </button>

                <p className="text-muted-foreground/60 text-[10px]">
                  ©{" "}
                  {new Date().getFullYear()}{" "}
                  Learnova. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
