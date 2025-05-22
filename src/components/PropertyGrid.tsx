import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { Button } from "./ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { fetchProperties } from "@/lib/api";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: "For Sale" | "For Rent";
  imageUrl: string;
  isFavorite?: boolean;
}

interface PropertyGridProps {
  properties?: Property[];
  loading?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
  onInquire?: (propertyId: string) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties: propProperties,
  loading: propLoading = false,
  onFavoriteToggle = () => {},
  onInquire = () => {},
}) => {
  const [properties, setProperties] = useState(
    propProperties || defaultProperties,
  );
  const [loading, setLoading] = useState(propLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propProperties && propProperties.length > 0) {
      setProperties(propProperties);
    } else {
      // In a real app, this would fetch from API
      // For now, we'll just use the default properties
      setProperties(defaultProperties);
    }
  }, [propProperties]);

  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  // Calculate pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty,
  );
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="w-full bg-background p-6 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-96 bg-muted animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="w-full bg-background p-6 flex flex-col items-center">
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold mb-4">No properties found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search filters to find more properties.
          </p>
          <Button>Clear Filters</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background p-6 flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            price={property.price}
            location={property.location}
            type={property.status === "For Sale" ? "sale" : "rent"}
            propertyType={
              property.type ? property.type.toLowerCase() : "property"
            }
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            area={property.squareFootage || property.area}
            image={property.imageUrl}
            isFavorite={property.isFavorite}
            onFavoriteToggle={() => onFavoriteToggle(property.id)}
            onInquire={() => onInquire(property.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

// Default properties for development and when no properties are provided
const defaultProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Apartment in Ikoyi",
    price: 120000000,
    location: "Ikoyi, Lagos",
    bedrooms: 3,
    bathrooms: 3,
    area: 1500,
    type: "Apartment",
    status: "For Sale",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Waterfront Villa in Banana Island",
    price: 450000000,
    location: "Banana Island, Lagos",
    bedrooms: 6,
    bathrooms: 7,
    area: 5000,
    type: "Villa",
    status: "For Sale",
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Modern Studio in Lekki Phase 1",
    price: 1500000,
    location: "Lekki Phase 1, Lagos",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    type: "Studio",
    status: "For Rent",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    isFavorite: false,
  },
  {
    id: "4",
    title: "Elegant Condo with Victoria Island View",
    price: 85000000,
    location: "Victoria Island, Lagos",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: "Condo",
    status: "For Sale",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    isFavorite: false,
  },
  {
    id: "5",
    title: "Spacious Family Home in Ajah",
    price: 2500000,
    location: "Ajah, Lagos",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    type: "House",
    status: "For Rent",
    imageUrl:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    isFavorite: true,
  },
  {
    id: "6",
    title: "Luxury Penthouse in Eko Atlantic",
    price: 350000000,
    location: "Eko Atlantic, Lagos",
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    type: "Penthouse",
    status: "For Sale",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    isFavorite: false,
  },
  {
    id: "7",
    title: "Traditional Home in Awka",
    price: 1800000,
    location: "Awka, Anambra",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    type: "House",
    status: "For Rent",
    imageUrl:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
    isFavorite: false,
  },
  {
    id: "8",
    title: "Elegant Estate Home in Onitsha",
    price: 75000000,
    location: "Onitsha, Anambra",
    bedrooms: 5,
    bathrooms: 4,
    area: 3200,
    type: "Estate",
    status: "For Sale",
    imageUrl:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80",
    isFavorite: true,
  },
  {
    id: "9",
    title: "Riverside Bungalow in Nnewi",
    price: 1200000,
    location: "Nnewi, Anambra",
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    type: "Bungalow",
    status: "For Rent",
    imageUrl:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    isFavorite: false,
  },
];

export default PropertyGrid;
