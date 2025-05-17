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
