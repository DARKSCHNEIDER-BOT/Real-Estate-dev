import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, User, LogOut, Bell } from "lucide-react";
import PropertyGrid from "./PropertyGrid";
import SearchFilters from "./SearchFilters";
import AuthModal from "./AuthModal";
import { searchProperties, getRecentProperties } from "@/lib/propertyApi";

const Home = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchFilters({
        ...searchFilters,
        location: searchQuery,
        status:
          activeTab === "buy"
            ? "sale"
            : activeTab === "rent"
              ? "rent"
              : undefined,
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
      } catch (error) {
        console.error("Error fetching recent properties:", error);
      }
    };

    fetchRecentProperties();
  }, []);

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
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
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
              <TabsContent value="sell" className="space-y-4">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter your property address"
                      className="pl-10 pr-4 py-6 text-base rounded-l-lg rounded-r-none border-r-0"
                    />
                  </div>
                  <Button size="lg" className="rounded-l-none px-8 py-6">
                    Get Estimate
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
            <h2 className="text-2xl font-bold">Featured Properties</h2>
            <Button variant="outline">View All</Button>
          </div>
          <PropertyGrid properties={properties} loading={isLoading} />
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
