const API_URL = "http://localhost:5000/api";

export async function fetchProperties(filters = {}) {
  const queryParams = new URLSearchParams();

  // Add filters to query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, String(value));
  });

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  const response = await fetch(`${API_URL}/properties${queryString}`);

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  return response.json();
}

export async function fetchPropertyById(id: string) {
  const response = await fetch(`${API_URL}/properties/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch property");
  }

  return response.json();
}

export async function getPropertyAvailability(propertyId: string) {
  const response = await fetch(
    `${API_URL}/properties/${propertyId}/availability`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch property availability");
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

export async function register(userData: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
}

export async function socialLogin(provider: string) {
  // In a real implementation, this would redirect to the OAuth provider
  // For now, we'll simulate a successful login

  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          name: `${provider} User`,
          email: `user-${Math.random().toString(36).substr(2, 9)}@example.com`,
          role: "user",
          provider,
          providerId: `${provider.toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`,
        },
        token: `simulated-token-${Math.random().toString(36).substr(2, 9)}`,
      });
    }, 1000);
  });
}

export async function getUserProfile(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

export async function toggleFavoriteProperty(
  userId: string,
  propertyId: string,
  isFavorite: boolean,
  token: string,
) {
  if (isFavorite) {
    // Remove from favorites
    const response = await fetch(
      `${API_URL}/users/${userId}/favorites/${propertyId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to remove property from favorites");
    }

    return response.json();
  } else {
    // Add to favorites
    const response = await fetch(`${API_URL}/users/${userId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ propertyId }),
    });

    if (!response.ok) {
      throw new Error("Failed to add property to favorites");
    }

    return response.json();
  }
}

export async function getUserFavorites(userId: string, token: string) {
  const response = await fetch(`${API_URL}/users/${userId}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user favorites");
  }

  return response.json();
}

export async function submitInquiry(
  propertyId: string,
  message: string,
  token: string,
) {
  // This would need a corresponding endpoint on the backend
  const response = await fetch(`${API_URL}/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ propertyId, message }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit inquiry");
  }

  return response.json();
}

export async function subscribeToPropertyUpdates(
  propertyId: string,
  callback: (data: any) => void,
) {
  // In a real implementation, this would use WebSockets or Server-Sent Events
  // For now, we'll simulate real-time updates with polling

  const intervalId = setInterval(async () => {
    try {
      const data = await getPropertyAvailability(propertyId);
      callback(data);
    } catch (error) {
      console.error("Error fetching property updates:", error);
    }
  }, 5000); // Poll every 5 seconds

  // Return a function to unsubscribe
  return () => clearInterval(intervalId);
}
