import {
  nigerianStates,
  lagosAreas,
  abujaAreas,
  propertyTypes,
} from "./nigerianLocations";

export interface NigerianProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  state: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  type: string;
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

// Generate a large dataset of Nigerian properties
export const generateNigerianProperties = (
  count: number,
): NigerianProperty[] => {
  const properties: NigerianProperty[] = [];

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

    // Generate a reliable image URL from Unsplash
    const imageCategories = [
      "house",
      "apartment",
      "architecture",
      "interior",
      "building",
    ];
    const randomCategory =
      imageCategories[Math.floor(Math.random() * imageCategories.length)];
    // Use fixed image URLs that are known to work
    const imageUrls = [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
    ];
    const imageUrl = imageUrls[i % imageUrls.length];

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
      type: propertyType.toLowerCase(),
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
          "Chioma Okafor",
          "Emeka Eze",
          "Ngozi Okonkwo",
          "Oluwaseun Adeyemi",
          "Chinedu Nnamdi",
        ][Math.floor(Math.random() * 10)],
        phone: `+234 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        email: `agent${i}@nigerianestate.com`,
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=agent${i}`,
      },
    });
  }

  return properties;
};

// Generate 500 Nigerian properties
export const nigerianProperties = generateNigerianProperties(500);
