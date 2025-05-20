import React, { useState } from "react";
import { Search, X, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

interface SearchFiltersProps {
  onSearch?: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  location: string;
  propertyType: string;
  priceRange: [number, number];
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSearch = () => {},
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    propertyType: "",
    priceRange: [0, 1000000],
    bedrooms: "",
    bathrooms: "",
    amenities: [],
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const propertyTypes = [
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "villa", label: "Villa" },
  ];

  const bedroomOptions = ["Any", "1", "2", "3", "4", "5+"];
  const bathroomOptions = ["Any", "1", "2", "3", "4+"];

  const amenitiesList = [
    { id: "pool", label: "Swimming Pool" },
    { id: "gym", label: "Gym" },
    { id: "parking", label: "Parking" },
    { id: "security", label: "Security" },
    { id: "balcony", label: "Balcony" },
    { id: "garden", label: "Garden" },
  ];

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, location: e.target.value });
    updateActiveFilters("location", e.target.value);
  };

  const handlePropertyTypeChange = (value: string) => {
    setFilters({ ...filters, propertyType: value });
    updateActiveFilters("propertyType", value);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: [value[0], value[1]] });
    updateActiveFilters("priceRange", `$${value[0]} - $${value[1]}`);
  };

  const handleBedroomsChange = (value: string) => {
    setFilters({ ...filters, bedrooms: value });
    updateActiveFilters("bedrooms", value !== "Any" ? `${value} Beds` : "");
  };

  const handleBathroomsChange = (value: string) => {
    setFilters({ ...filters, bathrooms: value });
    updateActiveFilters("bathrooms", value !== "Any" ? `${value} Baths` : "");
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    const updatedAmenities = checked
      ? [...filters.amenities, amenityId]
      : filters.amenities.filter((id) => id !== amenityId);

    setFilters({ ...filters, amenities: updatedAmenities });
    updateActiveFilters(
      "amenities",
      updatedAmenities.length > 0 ? `${updatedAmenities.length} Amenities` : "",
    );
  };

  const updateActiveFilters = (
    filterType: string,
    value: string | string[],
  ) => {
    if (
      !value ||
      (Array.isArray(value) && value.length === 0) ||
      value === "Any"
    ) {
      setActiveFilters(
        activeFilters.filter((filter) => !filter.startsWith(filterType)),
      );
    } else {
      const newFilter = Array.isArray(value)
        ? `${filterType}:${value.length} selected`
        : `${filterType}:${value}`;

      setActiveFilters([
        ...activeFilters.filter((filter) => !filter.startsWith(filterType)),
        newFilter,
      ]);
    }
  };

  const handleRemoveFilter = (filterToRemove: string) => {
    const [filterType] = filterToRemove.split(":");

    switch (filterType) {
      case "location":
        setFilters({ ...filters, location: "" });
        break;
      case "propertyType":
        setFilters({ ...filters, propertyType: "" });
        break;
      case "priceRange":
        setFilters({ ...filters, priceRange: [0, 1000000] });
        break;
      case "bedrooms":
        setFilters({ ...filters, bedrooms: "" });
        break;
      case "bathrooms":
        setFilters({ ...filters, bathrooms: "" });
        break;
      case "amenities":
        setFilters({ ...filters, amenities: [] });
        break;
      default:
        break;
    }

    setActiveFilters(
      activeFilters.filter((filter) => filter !== filterToRemove),
    );
  };

  const handleReset = () => {
    setFilters({
      location: "",
      propertyType: "",
      priceRange: [0, 1000000],
      bedrooms: "",
      bathrooms: "",
      amenities: [],
    });
    setActiveFilters([]);
  };

  const handleApply = () => {
    // Convert filters to format expected by API
    const apiFilters = {
      location: filters.location,
      propertyType: filters.propertyType,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      bedrooms: filters.bedrooms !== "Any" ? filters.bedrooms : undefined,
      bathrooms: filters.bathrooms !== "Any" ? filters.bathrooms : undefined,
      amenities:
        filters.amenities.length > 0 ? filters.amenities.join(",") : undefined,
    };

    onSearch(apiFilters);
    console.log("Applying filters:", apiFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className={`w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}
    >
      <div className="flex flex-col space-y-4">
        {/* Main search bar and expand button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search by location, neighborhood, or address"
              value={filters.location}
              onChange={handleLocationChange}
              className="pl-10 pr-4 h-12 w-full"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-12 px-4 flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          <Button className="h-12 px-6" onClick={handleApply}>
            Search
          </Button>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => {
              const [type, value] = filter.split(":");
              return (
                <Badge
                  key={filter}
                  variant="outline"
                  className="px-3 py-1 flex items-center gap-1"
                >
                  <span>
                    {type}: {value}
                  </span>
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => handleRemoveFilter(filter)}
                  />
                </Badge>
              );
            })}
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Expanded filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            {/* Property Type */}
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select
                value={filters.propertyType}
                onValueChange={handlePropertyTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any type</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>Price Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formatPrice(filters.priceRange[0])} -{" "}
                    {formatPrice(filters.priceRange[1])}
                    <ChevronDown size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>{formatPrice(filters.priceRange[0])}</span>
                      <span>{formatPrice(filters.priceRange[1])}</span>
                    </div>
                    <Slider
                      defaultValue={[
                        filters.priceRange[0],
                        filters.priceRange[1],
                      ]}
                      max={500000000}
                      step={5000000}
                      onValueChange={handlePriceRangeChange}
                      className="mt-6"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Select
                value={filters.bedrooms}
                onValueChange={handleBedroomsChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {bedroomOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Select
                value={filters.bathrooms}
                onValueChange={handleBathroomsChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {bathroomOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amenities */}
            <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-4">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {amenitiesList.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity.id}
                      checked={filters.amenities.includes(amenity.id)}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(amenity.id, checked === true)
                      }
                    />
                    <Label htmlFor={amenity.id} className="text-sm font-normal">
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleApply}>Apply Filters</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
