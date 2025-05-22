import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PropertyGrid from "./PropertyGrid";
import SearchFilters from "./SearchFilters";
import { getAllProperties, Property } from "@/lib/propertyApi";

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const results = await getAllProperties();
        setProperties(results);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = async (filters) => {
    setIsLoading(true);
    try {
      const results = await getAllProperties(filters);
      setProperties(results);
    } catch (error) {
      console.error("Error filtering properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">All Properties</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Browse our extensive collection of properties across Nigeria
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center bg-white rounded-lg shadow-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by location, ZIP code, or address"
                  className="pl-10 pr-4 py-6 text-base rounded-l-lg rounded-r-none border-r-0 border-none"
                />
              </div>
              <Button size="lg" className="rounded-l-none px-8 py-6">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <SearchFilters onSearch={handleFilterChange} className="mb-8" />

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">All Properties</h2>
          <p className="text-muted-foreground">
            {isLoading
              ? "Loading properties..."
              : `${properties.length} properties found`}
          </p>
        </div>

        <PropertyGrid properties={properties} loading={isLoading} />
      </div>
    </div>
  );
};

export default PropertiesPage;
