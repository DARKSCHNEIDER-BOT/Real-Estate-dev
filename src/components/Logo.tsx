import React from "react";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary rounded-md p-1 text-primary-foreground">
        <Home className="h-5 w-5" />
      </div>
      <h1 className={cn("font-bold tracking-tight", sizeClasses[size])}>
        <span>Nigerian</span>
        <span className="text-primary">Estates</span>
      </h1>
    </div>
  );
};

export default Logo;
