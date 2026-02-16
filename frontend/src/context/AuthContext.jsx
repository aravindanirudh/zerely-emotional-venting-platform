import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("zerely_token");
    if (token) {
      authService
        .getMe()
        .then((response) => {
          // API returns { success: true, data: user } for getMe
          // but login/register returns { success: true, data: { user, token } }
          // Adjust based on actual API response structure
          setUser(response.data || response);
        })
        .catch(() => localStorage.removeItem("zerely_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login function that calls the authService login method, handles the response, and updates the user state and localStorage with the token. It also includes robust handling for different API response structures to ensure compatibility with both successful and failed interceptor scenarios.
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      console.log("Login API Response:", response);

      // Robust handling for nested data structures
      // 1. If interceptor worked: response is Body { success: true, data: { ... } }
      // 2. If interceptor failed: response is AxiosObject { data: Body, ... }
      const responseBody =
        response.data && !response.success ? response.data : response;
      const authData = responseBody.data || responseBody;

      console.log("Parsed Auth Data:", authData);

      if (authData?.token) {
        localStorage.setItem("zerely_token", authData.token);
        setUser(authData.user);
        return responseBody;
      }
      return response;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  // Register function that calls the authService register method, handles the response, and updates the user state and localStorage with the token. Similar to login, it includes robust handling for different API response structures to ensure compatibility with both successful and failed interceptor scenarios. It automatically logs in the user upon successful registration by storing the token and user data. If registration fails, it throws an error to be handled by the calling component.
  const register = async (anonymousName, email, password) => {
    try {
      const response = await authService.register(
        anonymousName,
        email,
        password,
      );
      console.log("Register API Response:", response);

      const responseBody =
        response.data && !response.success ? response.data : response;
      const authData = responseBody.data || responseBody;

      console.log("Parsed Register Data:", authData);

      if (authData?.token) {
        localStorage.setItem("zerely_token", authData.token);
        setUser(authData.user);
        return responseBody;
      }
      return response;
    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    }
  };

  // Logout function that clears the authentication token from localStorage and resets the user state to null, effectively logging the user out of the application.
  const logout = () => {
    localStorage.removeItem("zerely_token");
    setUser(null);
  };

  // Function to update the user's token balance in the context. It takes the new balance as an argument and updates the user state with the new token balance while preserving other user information. This allows components that consume the AuthContext to reflect changes in the user's token balance in real-time without needing to refetch user data from the server.
  const updateTokens = (newBalance) => {
    setUser((prev) => (prev ? { ...prev, tokens: newBalance } : null));
  };

  // The AuthContext.Provider component wraps the children components and provides them with the authentication state and functions. It only renders the children when the loading state is false, ensuring that the authentication status is determined before any child components attempt to access it. The context value includes the user object, loading status, authentication functions (login, register, logout), a function to update tokens, and boolean flags for authentication and admin status.
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateTokens,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext. It checks if the context is available and throws an error if it's used outside of the AuthProvider. This ensures that components using this hook have access to the authentication context and can utilize the provided state and functions for managing user authentication throughout the application.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
