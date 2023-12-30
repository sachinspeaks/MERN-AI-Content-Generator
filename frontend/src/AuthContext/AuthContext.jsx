import { createContext, useContext, useEffect, useState } from "react";
import { checkUserAuthStatusAPI } from "../api's/user/usersAPI";
import { useQuery } from "react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isError, isLoading, data, isSuccess } = useQuery({
    queryFn: checkUserAuthStatusAPI,
    queryKey: ["checkAuth"],
  });
  useEffect(() => {
    if (isSuccess) setIsAuthenticated(data);
  }, [data, isSuccess]);

  const login = () => {
    setIsAuthenticated(true);
  };
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isError,
        isLoading,
        isSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
