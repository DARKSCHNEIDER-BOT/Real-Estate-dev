import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bed, Bath, Square } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PropertyCardProps {
  id?: string;
  title?: string;
  price?: number;
  location?: string;
  type?: "sale" | "rent";
  propertyType?: "apartment" | "house" | "villa" | "condo";
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  image?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onInquire?: (id: string) => void;
  onClick?: (id: string) => void;
}

const PropertyCard = ({
  id = "1",
  title = "Modern Apartment with City View",
  price = 250000,
  location = "Downtown, City",
  type = "sale",
  propertyType = "apartment",
  bedrooms = 2,
  bathrooms = 2,
  area = 1200,
  image = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  isFavorite = false,
  onFavoriteToggle = () => {},
  onInquire = () => {},
  onClick = () => {},
}: PropertyCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle(id);
  };

  const handleInquireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInquire(id);
  };

  const handleCardClick = () => {
    onClick(id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer bg-white dark:bg-gray-800"
      onClick={handleCardClick}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={
              image ||
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
            }
            alt={title}
            className="object-cover w-full h-full rounded-t-md"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
            }}
          />
        </AspectRatio>
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge variant={type === "sale" ? "default" : "secondary"}>
            For {type === "sale" ? "Sale" : "Rent"}
          </Badge>
          <Badge variant="outline" className="bg-white">
            {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${isFavorite ? "text-red-500" : "text-gray-500"}`}
          onClick={handleFavoriteClick}
        >
          <Heart className={isFavorite ? "fill-current" : ""} size={18} />
        </Button>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{location}</p>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="text-xl font-bold text-primary mb-2">
          {formatPrice(price)}
          {type === "rent" && (
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              /month
            </span>
          )}
        </div>
        <div className="flex justify-between text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span className="text-sm">
              {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span className="text-sm">
              {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={16} />
            <span className="text-sm">{area} sq ft</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleInquireClick}
        >
          <MessageCircle size={16} className="mr-2" />
          Inquire Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
