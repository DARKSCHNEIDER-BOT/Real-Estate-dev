import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertCircle,
  Loader2,
  Apple,
  Facebook,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  onClose?: () => void;
}

const AuthModal = ({
  isOpen = true,
  onOpenChange,
  onSuccess,
  onClose,
}: AuthModalProps) => {
  const {
    login,
    register,
    error: authError,
    isLoading: authLoading,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");

  // Clear success message when tab changes
  useEffect(() => {
    setSuccess(null);
    setError(null);
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await login(email, password);
      setSuccess("Login successful! Welcome back to RealEstateHub!");
      toast({
        title: "Login successful",
        description: "Welcome back to RealEstateHub!",
        className: "bg-green-50 border-green-200",
      });

      // Delay closing the modal to show success message
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await register(name, email, password, role);
      setSuccess("Registration successful! Your account has been created.");
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
        className: "bg-green-50 border-green-200",
      });

      // Delay closing the modal to show success message
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // In a real implementation, this would redirect to the OAuth provider
    // For now, we'll simulate a successful login after a delay
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(`Successfully logged in with ${provider}!`);

      // Create a mock user for the social login
      const mockUser = {
        id: `${provider.toLowerCase()}-user-${Date.now()}`,
        name:
          provider === "Google"
            ? "Google User"
            : provider === "Apple"
              ? "Apple User"
              : "Facebook User",
        email: `${provider.toLowerCase()}user@example.com`,
        role: "user",
        provider: provider,
        providerId: `${provider.toLowerCase()}-${Date.now()}`,
        avatar:
          provider === "Google"
            ? "https://api.dicebear.com/7.x/avataaars/svg?seed=google"
            : provider === "Apple"
              ? "https://api.dicebear.com/7.x/avataaars/svg?seed=apple"
              : "https://api.dicebear.com/7.x/avataaars/svg?seed=facebook",
      };

      // Store the mock user in localStorage to simulate persistence
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", `mock-token-${Date.now()}`);

      toast({
        title: "Social login successful",
        description: `You've successfully logged in with ${provider}!`,
        className: "bg-green-50 border-green-200",
      });

      // Delay closing the modal to show success message
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center animate-in slide-in-from-top-5">
            Welcome to RealEstate<span className="text-primary">Hub</span>
          </DialogTitle>
          <DialogDescription className="text-center animate-in slide-in-from-top-3 duration-500">
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="login"
              className="data-[state=active]:animate-pulse"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:animate-pulse"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="login"
            className="animate-in fade-in-50 duration-500"
          >
            <Card>
              <CardContent className="pt-6">
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-4 animate-in shake-x-3"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 animate-in slide-in-from-top-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          type="button"
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full transition-all duration-300 hover:shadow-md hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("Google")}
                        className="transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                          className="mr-2 h-4 w-4"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <span className="sm:hidden md:inline">Google</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("Apple")}
                        className="transition-all duration-200 hover:bg-gray-900 hover:text-white"
                      >
                        <Apple className="mr-2 h-4 w-4" />
                        <span className="sm:hidden md:inline">Apple</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("Facebook")}
                        className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      >
                        <Facebook className="mr-2 h-4 w-4" />
                        <span className="sm:hidden md:inline">Facebook</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t p-4">
                <Button
                  variant="link"
                  onClick={() => setActiveTab("signup")}
                  className="transition-colors hover:text-primary"
                >
                  Don&apos;t have an account? Sign up
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent
            value="signup"
            className="animate-in fade-in-50 duration-500"
          >
            <Card>
              <CardContent className="pt-6">
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-4 animate-in shake-x-3"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 animate-in slide-in-from-top-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignup}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Account Type</Label>
                      <RadioGroup
                        value={role}
                        onValueChange={setRole}
                        className="gap-2"
                      >
                        <div className="flex items-center space-x-2 rounded-md border p-2 transition-all hover:bg-accent">
                          <RadioGroupItem value="user" id="user" />
                          <Label
                            htmlFor="user"
                            className="flex-1 cursor-pointer"
                          >
                            Regular User
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2 transition-all hover:bg-accent">
                          <RadioGroupItem value="agent" id="agent" />
                          <Label
                            htmlFor="agent"
                            className="flex-1 cursor-pointer"
                          >
                            Real Estate Agent
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button
                      type="submit"
                      className="w-full transition-all duration-300 hover:shadow-md hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">
                          Or sign up with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("Google")}
                        className="transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                          className="mr-2 h-4 w-4"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <span className="sm:hidden md:inline">Google</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("Apple")}
                        className="transition-all duration-200 hover:bg-gray-900 hover:text-white"
                      >
                        <Apple className="mr-2 h-4 w-4" />
                        <span className="sm:hidden md:inline">Apple</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSocialLogin("Facebook")}
                        className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      >
                        <Facebook className="mr-2 h-4 w-4" />
                        <span className="sm:hidden md:inline">Facebook</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t p-4">
                <Button
                  variant="link"
                  onClick={() => setActiveTab("login")}
                  className="transition-colors hover:text-primary"
                >
                  Already have an account? Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
