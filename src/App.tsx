import { Suspense, useState } from "react";
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
import { Menu, User, LogOut, Bell } from "lucide-react";
import AuthModal from "./components/AuthModal";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");

  // Mock user data - in a real app this would come from authentication state
  const user = isLoggedIn
    ? {
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      }
    : null;

  const handleLogin = () => {
    // This would be replaced with actual authentication logic
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <h1 className="text-xl font-bold">
                  RealEstate<span className="text-primary">Hub</span>
                </h1>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <div className="flex items-center space-x-6">
                <Link to="/" className="font-medium hover:text-primary">
                  Home
                </Link>
                <Link
                  to="/properties"
                  className="font-medium hover:text-primary"
                >
                  Properties
                </Link>
                <Link to="/about" className="font-medium hover:text-primary">
                  About
                </Link>
                <Link to="/contact" className="font-medium hover:text-primary">
                  Contact
                </Link>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-[400px] ml-6"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="rent">Rent</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
              </Tabs>
            </nav>

            {/* User actions */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        size="sm"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>
                            {user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline-block">
                          {user?.name}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
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
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => setIsAuthModalOpen(true)}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
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
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />
      </div>
    </Suspense>
  );
}

export default App;
