import axios from "axios";
import {
  nigerianStates,
  lagosAreas,
  abujaAreas,
  propertyTypes,
} from "./nigerianLocations";

// This is a mock API service that simulates fetching properties from a backend
// In a real application, you would replace these functions with actual API calls

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  state: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: string;
  status: "For Sale" | "For Rent";
  imageUrl: string;
  description: string;
  amenities: string[];
  isFeatured: boolean;
  isFavorite?: boolean;
  createdAt: string;
  agent: {
    name: string;
    phone: string;
    email: string;
    photo: string;
  };
}

// Generate a large dataset of properties for testing
const generateMockProperties = (count: number): Property[] => {
  const properties: Property[] = [];

  for (let i = 1; i <= count; i++) {
    // Randomly select state and area
    const stateIndex = Math.floor(Math.random() * nigerianStates.length);
    const state = nigerianStates[stateIndex];

    let areas = [];
    if (state === "Lagos") {
      areas = lagosAreas;
    } else if (state === "Abuja") {
      areas = abujaAreas;
    } else {
      // For other states, just use a generic area name
      areas = ["Central", "North", "South", "East", "West"];
    }

    const areaIndex = Math.floor(Math.random() * areas.length);
    const area = areas[areaIndex];

    // Randomly select property type
    const propertyTypeIndex = Math.floor(Math.random() * propertyTypes.length);
    const propertyType = propertyTypes[propertyTypeIndex];

    // Randomly determine if it's for sale or rent
    const isForSale = Math.random() > 0.5;

    // Generate a price based on property type and whether it's for sale or rent
    let price;
    if (isForSale) {
      if (
        propertyType === "Apartment" ||
        propertyType === "Flat" ||
        propertyType === "Studio"
      ) {
        price = Math.floor(Math.random() * 50000000) + 20000000; // 20M to 70M Naira
      } else if (propertyType === "Land") {
        price = Math.floor(Math.random() * 100000000) + 10000000; // 10M to 110M Naira
      } else {
        price = Math.floor(Math.random() * 200000000) + 50000000; // 50M to 250M Naira
      }
    } else {
      if (
        propertyType === "Apartment" ||
        propertyType === "Flat" ||
        propertyType === "Studio"
      ) {
        price = Math.floor(Math.random() * 1500000) + 500000; // 500K to 2M Naira per year
      } else if (propertyType === "Land") {
        continue; // Skip land for rent
      } else {
        price = Math.floor(Math.random() * 5000000) + 2000000; // 2M to 7M Naira per year
      }
    }

    // Generate bedrooms and bathrooms based on property type
    let bedrooms = 0;
    let bathrooms = 0;

    if (
      propertyType !== "Land" &&
      propertyType !== "Commercial Property" &&
      propertyType !== "Office Space"
    ) {
      bedrooms = Math.floor(Math.random() * 5) + 1; // 1 to 6 bedrooms
      bathrooms = Math.floor(Math.random() * 4) + 1; // 1 to 5 bathrooms

      // Ensure bathrooms are not more than bedrooms + 1
      if (bathrooms > bedrooms + 1) {
        bathrooms = bedrooms + 1;
      }
    }

    // Generate square footage
    let squareFootage;
    if (propertyType === "Land") {
      squareFootage = Math.floor(Math.random() * 5000) + 500; // 500 to 5500 sq meters for land
    } else if (
      propertyType === "Commercial Property" ||
      propertyType === "Office Space"
    ) {
      squareFootage = Math.floor(Math.random() * 1000) + 200; // 200 to 1200 sq meters for commercial
    } else {
      squareFootage = Math.floor(Math.random() * 2000) + 500; // 500 to 2500 sq ft for residential
    }

    // Generate a title
    let title;
    if (propertyType === "Land") {
      title = `${squareFootage} sqm Land for Sale in ${area}, ${state}`;
    } else if (propertyType === "Commercial Property") {
      title = `Commercial ${propertyType} ${isForSale ? "for Sale" : "for Rent"} in ${area}, ${state}`;
    } else if (propertyType === "Office Space") {
      title = `${squareFootage} sqm Office Space ${isForSale ? "for Sale" : "for Rent"} in ${area}, ${state}`;
    } else {
      title = `${bedrooms} Bedroom ${propertyType} ${isForSale ? "for Sale" : "for Rent"} in ${area}, ${state}`;
    }

    // Generate random amenities
    const allAmenities = [
      "Swimming Pool",
      "Gym",
      "Security",
      "Parking",
      "Balcony",
      "Garden",
      "Air Conditioning",
      "Furnished",
      "Elevator",
      "CCTV",
      "Backup Generator",
      "Borehole",
      "Serviced",
      "Waterfront",
      "Gated Estate",
    ];

    const numAmenities = Math.floor(Math.random() * 8) + 1; // 1 to 8 amenities
    const shuffledAmenities = [...allAmenities].sort(() => 0.5 - Math.random());
    const selectedAmenities = shuffledAmenities.slice(0, numAmenities);

    // Generate a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    // Generate a random image URL from Unsplash
    const imageCategories = [
      "house",
      "apartment",
      "architecture",
      "interior",
      "building",
    ];
    const randomCategory =
      imageCategories[Math.floor(Math.random() * imageCategories.length)];
    const imageUrl = `https://source.unsplash.com/random/800x600/?${randomCategory}&sig=${i}`;

    // Create the property object
    properties.push({
      id: `prop-${i}`,
      title,
      price,
      location: `${area}, ${state}`,
      state,
      area,
      bedrooms,
      bathrooms,
      squareFootage,
      propertyType,
      status: isForSale ? "For Sale" : "For Rent",
      imageUrl,
      description: `Beautiful ${bedrooms} bedroom ${propertyType.toLowerCase()} located in ${area}, ${state}. This property features ${bathrooms} bathrooms and spans ${squareFootage} square ${propertyType === "Land" ? "meters" : "feet"}.`,
      amenities: selectedAmenities,
      isFeatured: Math.random() > 0.8, // 20% chance of being featured
      isFavorite: Math.random() > 0.8, // 20% chance of being favorited
      createdAt: date.toISOString(),
      agent: {
        name: [
          "John Doe",
          "Jane Smith",
          "Michael Johnson",
          "Sarah Williams",
          "David Brown",
        ][Math.floor(Math.random() * 5)],
        phone: `+234 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        email: `agent${i}@nigerianestate.com`,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=agent${i}`,
      },
    });
  }

  return properties;
};

// Generate 200 mock properties
const mockProperties = generateMockProperties(200);

// Filter properties based on search criteria
export const searchProperties = async (filters: any): Promise<Property[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredProperties = [...mockProperties];

  // Filter by state
  if (filters.state) {
    filteredProperties = filteredProperties.filter(
      (property) =>
        property.state.toLowerCase() === filters.state.toLowerCase(),
    );
  }

  // Filter by area
  if (filters.area) {
    filteredProperties = filteredProperties.filter(
      (property) => property.area.toLowerCase() === filters.area.toLowerCase(),
    );
  }

  // Filter by location (general search term)
  if (filters.location) {
    const searchTerm = filters.location.toLowerCase();
    filteredProperties = filteredProperties.filter(
      (property) =>
        property.location.toLowerCase().includes(searchTerm) ||
        property.state.toLowerCase().includes(searchTerm) ||
        property.area.toLowerCase().includes(searchTerm),
    );
  }

  // Filter by property type
  if (filters.propertyType) {
    filteredProperties = filteredProperties.filter(
      (property) =>
        property.propertyType.toLowerCase() ===
        filters.propertyType.toLowerCase(),
    );
  }

  // Filter by status (For Sale or For Rent)
  if (filters.status) {
    filteredProperties = filteredProperties.filter(
      (property) => property.status === filters.status,
    );
  }

  // Filter by price range
  if (filters.minPrice) {
    filteredProperties = filteredProperties.filter(
      (property) => property.price >= filters.minPrice,
    );
  }

  if (filters.maxPrice) {
    filteredProperties = filteredProperties.filter(
      (property) => property.price <= filters.maxPrice,
    );
  }

  // Filter by bedrooms
  if (filters.bedrooms) {
    filteredProperties = filteredProperties.filter(
      (property) => property.bedrooms >= parseInt(filters.bedrooms),
    );
  }

  // Filter by bathrooms
  if (filters.bathrooms) {
    filteredProperties = filteredProperties.filter(
      (property) => property.bathrooms >= parseInt(filters.bathrooms),
    );
  }

  // Filter by amenities
  if (filters.amenities && filters.amenities.length > 0) {
    const amenitiesList = Array.isArray(filters.amenities)
      ? filters.amenities
      : filters.amenities.split(",");

    filteredProperties = filteredProperties.filter((property) =>
      amenitiesList.every((amenity) => property.amenities.includes(amenity)),
    );
  }

  return filteredProperties;
};

// Get featured properties
export const getFeaturedProperties = async (): Promise<Property[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockProperties.filter((property) => property.isFeatured).slice(0, 6);
};

// Get recent properties
export const getRecentProperties = async (): Promise<Property[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [...mockProperties]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 9);
};

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const property = mockProperties.find((p) => p.id === id);
  return property || null;
};

// Get similar properties
export const getSimilarProperties = async (
  propertyId: string,
): Promise<Property[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const property = mockProperties.find((p) => p.id === propertyId);

  if (!property) return [];

  // Find properties in the same area with the same status
  return mockProperties
    .filter(
      (p) =>
        p.id !== propertyId &&
        p.area === property.area &&
        p.status === property.status,
    )
    .slice(0, 3);
};

// Toggle favorite status
export const toggleFavorite = async (
  propertyId: string,
  isFavorite: boolean,
): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const propertyIndex = mockProperties.findIndex((p) => p.id === propertyId);

  if (propertyIndex !== -1) {
    mockProperties[propertyIndex].isFavorite = isFavorite;
    return true;
  }

  return false;
};

// Get user's favorite properties
export const getFavoriteProperties = async (): Promise<Property[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockProperties.filter((property) => property.isFavorite);
};
