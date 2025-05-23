import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";
import PropertiesPage from "./components/PropertiesPage";
import routes from "tempo-routes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Bell, X, Home as HomeIcon } from "lucide-react";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";
import { cn } from "./lib/utils";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();

  // Simulate loading for preloader demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Close mobile menu when clicking a link
  const handleMobileNavClick = () => {
    setIsMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <HomeIcon className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-lg font-medium animate-pulse">
            Loading RealEstateHub...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 transition-transform hover:scale-105"
              >
                <div className="bg-primary rounded-md p-1 text-primary-foreground">
                  <HomeIcon className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold">
                  RealEstate<span className="text-primary">Hub</span>
                </h1>
              </Link>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden ml-2 transition-transform hover:scale-110"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <div className="flex items-center space-x-6">
                <Link
                  to="/"
                  className="font-medium hover:text-primary transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="font-medium hover:text-primary transition-colors duration-200"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="font-medium hover:text-primary transition-colors duration-200"
                >
                  Contact
                </Link>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-[400px] ml-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="buy"
                    className="data-[state=active]:animate-pulse"
                  >
                    Buy
                  </TabsTrigger>
                  <TabsTrigger
                    value="rent"
                    className="data-[state=active]:animate-pulse"
                  >
                    Rent
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </nav>

            {/* User actions */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:animate-pulse"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary animate-ping"></span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 transition-all hover:bg-accent"
                        size="sm"
                      >
                        <Avatar className="h-8 w-8 ring-2 ring-primary ring-offset-2 ring-offset-background">
                          <AvatarImage
                            src={
                              user?.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
                            }
                            alt={user?.name}
                          />
                          <AvatarFallback>
                            {user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline-block">
                          {user?.name}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="animate-in slide-in-from-top-5"
                    >
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="transition-colors hover:text-primary"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="animate-in slide-in-from-right-5 duration-300 hover:animate-pulse"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={cn(
              "md:hidden fixed inset-x-0 top-16 bg-background border-b z-30 transition-all duration-300 transform",
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0 pointer-events-none",
            )}
          >
            <div className="container py-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
              <Link
                to="/"
                className="font-medium p-2 hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                onClick={handleMobileNavClick}
              >
                <HomeIcon className="h-4 w-4" /> Home
              </Link>
              <Link
                to="/about"
                className="font-medium p-2 hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                onClick={handleMobileNavClick}
              >
                <User className="h-4 w-4" /> About
              </Link>
              <Link
                to="/contact"
                className="font-medium p-2 hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                onClick={handleMobileNavClick}
              >
                <Bell className="h-4 w-4" /> Contact
              </Link>

              <div className="border-t pt-4 mt-2">
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value);
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy">Buy</TabsTrigger>
                    <TabsTrigger value="rent">Rent</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            user?.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
                          }
                          alt={user?.name}
                        />
                        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 animate-in fade-in-50 duration-500">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </main>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onOpenChange={setIsAuthModalOpen}
          onSuccess={handleLogin}
        />
      </div>
    </Suspense>
  );
}

export default App;
