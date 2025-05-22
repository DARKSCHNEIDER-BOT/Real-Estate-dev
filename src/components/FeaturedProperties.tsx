import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Home, Building, MapPin } from "lucide-react";
import { getFeaturedProperties, Property } from "@/lib/propertyApi";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setLoading(true);
      try {
        const data = await getFeaturedProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(
        properties.filter((property) => {
          if (activeTab === "sale") return property.status === "For Sale";
          if (activeTab === "rent") return property.status === "For Rent";
          return true;
        }),
      );
    }
  }, [activeTab, properties]);

  const formatPrice = (price: number, status: string) => {
    return (
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(price) + (status === "For Rent" ? "/year" : "")
    );
  };

  return (
    <section className="py-12 bg-muted/30 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
            <p className="text-muted-foreground">
              Handpicked properties for you
            </p>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-[400px]"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sale">For Sale</TabsTrigger>
              <TabsTrigger value="rent">For Rent</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading state
            [...Array(3)].map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 animate-pulse mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse mb-4"></div>
                  <div className="h-10 bg-gray-200 animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredProperties.length === 0 ? (
            // No properties found
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-semibold mb-2">
                No featured properties found
              </h3>
              <p className="text-muted-foreground">
                Check back later for new listings
              </p>
            </div>
          ) : (
            // Display properties
            filteredProperties.slice(0, 3).map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={
                      property.imageUrl ||
                      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
                    }
                    alt={property.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
                    }}
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-white">
                    Featured
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white text-xl font-bold line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-white/90">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(property.price, property.status)}
                    </span>
                    <Badge variant="outline">{property.status}</Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    {property.propertyType !== "Land" && (
                      <>
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-1" />
                          <span>
                            {property.bedrooms}{" "}
                            {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          <span>
                            {property.bathrooms}{" "}
                            {property.bathrooms === 1
                              ? "Bathroom"
                              : "Bathrooms"}
                          </span>
                        </div>
                      </>
                    )}
                    <div>
                      <span>
                        {property.squareFootage} sq{" "}
                        {property.propertyType === "Land" ? "m" : "ft"}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" size="lg">
            View All Properties <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
