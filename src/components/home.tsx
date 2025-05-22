import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock } from "lucide-react";
import PropertyGrid from "./PropertyGrid";
import SearchFilters from "./SearchFilters";
import { searchProperties, getRecentProperties } from "@/lib/propertyApi";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  const [propertyAvailability, setPropertyAvailability] = useState({});

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchFilters({
        ...searchFilters,
        location: searchQuery,
        status: activeTab === "buy" ? "sale" : "rent",
      });
    }
  };

  const handleFilterChange = (filters) => {
    setSearchFilters(filters);
  };

  useEffect(() => {
    const fetchFilteredProperties = async () => {
      if (Object.keys(searchFilters).length === 0) return;

      setIsLoading(true);
      try {
        const results = await searchProperties(searchFilters);
        setProperties(results);

        // Initialize availability data
        const availabilityData = {};
        results.forEach((property) => {
          availabilityData[property.id] = {
            totalUnits:
              property.totalUnits || Math.floor(Math.random() * 10) + 1,
            availableUnits:
              property.availableUnits || Math.floor(Math.random() * 10) + 1,
            lastUpdated: new Date().toISOString(),
          };
        });
        setPropertyAvailability(availabilityData);

        // Simulate real-time updates
        const interval = setInterval(() => {
          const randomPropertyId =
            results[Math.floor(Math.random() * results.length)]?.id;
          if (randomPropertyId) {
            setPropertyAvailability((prev) => {
              const newAvailability = { ...prev };
              if (newAvailability[randomPropertyId]) {
                const currentAvailable =
                  newAvailability[randomPropertyId].availableUnits;
                const newAvailable = Math.max(0, currentAvailable - 1);

                newAvailability[randomPropertyId] = {
                  ...newAvailability[randomPropertyId],
                  availableUnits: newAvailable,
                  lastUpdated: new Date().toISOString(),
                };

                // Show notification for low availability
                if (newAvailable <= 2 && newAvailable > 0) {
                  const property = results.find(
                    (p) => p.id === randomPropertyId,
                  );
                  toast({
                    title: "Limited Availability!",
                    description: `Only ${newAvailable} units left for property ${property?.title || "this property"}`,
                    variant: "warning",
                  });
                } else if (newAvailable === 0) {
                  const property = results.find(
                    (p) => p.id === randomPropertyId,
                  );
                  toast({
                    title: "Property Unavailable",
                    description: `${property?.title || "This property"} is now fully booked!`,
                    variant: "destructive",
                  });
                }
              }
              return newAvailability;
            });
          }
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [searchFilters]);

  useEffect(() => {
    const fetchRecentProperties = async () => {
      try {
        const recent = await getRecentProperties();
        setRecentProperties(recent);

        // Initialize availability data for recent properties
        const availabilityData = {};
        recent.forEach((property) => {
          availabilityData[property.id] = {
            totalUnits:
              property.totalUnits || Math.floor(Math.random() * 10) + 1,
            availableUnits:
              property.availableUnits || Math.floor(Math.random() * 10) + 1,
            lastUpdated: new Date().toISOString(),
          };
        });

        setPropertyAvailability((prev) => ({
          ...prev,
          ...availabilityData,
        }));
      } catch (error) {
        console.error("Error fetching recent properties:", error);
      }
    };

    fetchRecentProperties();
  }, []);

  // Function to render availability badge
  const renderAvailabilityBadge = (propertyId) => {
    const availability = propertyAvailability[propertyId];
    if (!availability) return null;

    const { availableUnits, totalUnits, lastUpdated } = availability;
    const percentAvailable = (availableUnits / totalUnits) * 100;

    let variant = "default";
    let text = `${availableUnits} of ${totalUnits} available`;

    if (availableUnits === 0) {
      variant = "destructive";
      text = "Fully Booked";
    } else if (percentAvailable <= 20) {
      variant = "destructive";
      text = `Only ${availableUnits} left!`;
    } else if (percentAvailable <= 50) {
      variant = "warning";
      text = `${availableUnits} units available`;
    }

    const timeAgo = new Date(lastUpdated);
    const timeAgoStr = timeAgo.toLocaleTimeString();

    return (
      <div className="flex flex-col gap-1">
        <Badge variant={variant} className="self-start">
          {text}
        </Badge>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Updated at {timeAgoStr}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Dream Home
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the perfect property from thousands of listings across the
            country.
          </p>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4">
            <Tabs
              defaultValue="buy"
              className="w-full"
              onValueChange={setActiveTab}
              value={activeTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
              </TabsList>
              <TabsContent value="buy" className="space-y-4">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by location, ZIP code, or address"
                      className="pl-10 pr-4 py-6 text-base rounded-l-lg rounded-r-none border-r-0"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                    />
                  </div>
                  <Button
                    size="lg"
                    className="rounded-l-none px-8 py-6"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="rent" className="space-y-4">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search rental properties"
                      className="pl-10 pr-4 py-6 text-base rounded-l-lg rounded-r-none border-r-0"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                    />
                  </div>
                  <Button
                    size="lg"
                    className="rounded-l-none px-8 py-6"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Search Filters */}
        <SearchFilters onSearch={handleFilterChange} />

        {/* Featured Properties Section */}
        <section className="my-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Featured Properties</h2>
              <p className="text-muted-foreground">
                Real-time availability updates
              </p>
            </div>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 6).map((property) => (
              <div key={property.id} className="relative">
                <PropertyGrid.Card
                  id={property.id}
                  title={property.title}
                  price={property.price}
                  location={property.location}
                  type={property.status === "For Sale" ? "sale" : "rent"}
                  propertyType={property.type?.toLowerCase() || "property"}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.squareFootage || property.area}
                  image={property.imageUrl}
                  isFavorite={property.isFavorite}
                />
                <div className="absolute top-2 right-2">
                  {renderAvailabilityBadge(property.id)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Properties Section */}
        <section className="py-12 container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Recent Properties</h2>
              <p className="text-muted-foreground">
                Browse our latest listings
              </p>
            </div>
            <Button variant="outline">View All</Button>
          </div>
          <PropertyGrid properties={recentProperties} loading={false} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">RealEstateHub</h3>
              <p className="text-gray-400">
                Find your perfect property with our comprehensive real estate
                platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Properties
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Agents
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Property Types</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Apartments
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Houses
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Commercial
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Land
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                <p>123 Real Estate Avenue</p>
                <p>Property City, PC 12345</p>
                <p className="mt-2">Email: info@realestatehub.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} NigerianEstates. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
