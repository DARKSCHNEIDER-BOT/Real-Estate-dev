import { nigerianProperties, NigerianProperty } from "./nigerianPropertyData";

// This is a mock API service that simulates fetching properties from a backend
// In a real application, you would replace these functions with actual API calls

export interface Property extends NigerianProperty {}

// Filter properties based on search criteria
export const searchProperties = async (filters: any): Promise<Property[]> => {
  console.log("Searching with filters:", filters);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredProperties = [...nigerianProperties];

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
    console.log(`Filtering by location: ${searchTerm}`);

    // Special handling for specific locations
    const specialLocations = {
      ikoyi: "Ikoyi, Lagos",
      "banana island": "Banana Island, Lagos",
      "eko hotel": "Victoria Island, Lagos",
      "eko atlantic": "Eko Atlantic, Lagos",
    };

    if (specialLocations[searchTerm]) {
      const targetLocation = specialLocations[searchTerm].toLowerCase();
      filteredProperties = filteredProperties.filter((property) =>
        property.location.toLowerCase().includes(targetLocation),
      );
    } else {
      filteredProperties = filteredProperties.filter(
        (property) =>
          property.location.toLowerCase().includes(searchTerm) ||
          property.state.toLowerCase().includes(searchTerm) ||
          property.area.toLowerCase().includes(searchTerm) ||
          (property.title && property.title.toLowerCase().includes(searchTerm)),
      );
    }

    console.log(
      `After location filter: ${filteredProperties.length} properties`,
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
    const status = filters.status === "sale" ? "For Sale" : "For Rent";
    filteredProperties = filteredProperties.filter(
      (property) => property.status === status,
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
  if (filters.bedrooms && filters.bedrooms !== "Any") {
    const bedroomsValue =
      filters.bedrooms === "5+" ? 5 : parseInt(filters.bedrooms);
    filteredProperties = filteredProperties.filter(
      (property) => property.bedrooms >= bedroomsValue,
    );
  }

  // Filter by bathrooms
  if (filters.bathrooms && filters.bathrooms !== "Any") {
    const bathroomsValue =
      filters.bathrooms === "4+" ? 4 : parseInt(filters.bathrooms);
    filteredProperties = filteredProperties.filter(
      (property) => property.bathrooms >= bathroomsValue,
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

  console.log(`Found ${filteredProperties.length} properties matching filters`);
  return filteredProperties;
};

// Get featured properties
export const getFeaturedProperties = async (): Promise<Property[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return nigerianProperties
    .filter((property) => property.isFeatured)
    .slice(0, 6);
};

// Get all properties (with optional filters)
export const getAllProperties = async (filters = {}): Promise<Property[]> => {
  // If filters are provided, use the search function
  if (Object.keys(filters).length > 0) {
    return searchProperties(filters);
  }

  // Otherwise return all properties (with a delay to simulate API call)
  await new Promise((resolve) => setTimeout(resolve, 500));
  return nigerianProperties;
};

// Get recent properties
export const getRecentProperties = async (): Promise<Property[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [...nigerianProperties]
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

  const property = nigerianProperties.find((p) => p.id === id);
  return property || null;
};

// Get similar properties
export const getSimilarProperties = async (
  propertyId: string,
): Promise<Property[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const property = nigerianProperties.find((p) => p.id === propertyId);

  if (!property) return [];

  // Find properties in the same area with the same status
  return nigerianProperties
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

  const propertyIndex = nigerianProperties.findIndex(
    (p) => p.id === propertyId,
  );

  if (propertyIndex !== -1) {
    nigerianProperties[propertyIndex].isFavorite = isFavorite;
    return true;
  }

  return false;
};

// Get user's favorite properties
export const getFavoriteProperties = async (): Promise<Property[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return nigerianProperties.filter((property) => property.isFavorite);
};
