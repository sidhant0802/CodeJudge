import React, { createContext, useContext, useState,useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import  Cookies  from 'universal-cookie';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("user");
  const cookies = new Cookies();
  useEffect(() => {
    const token = cookies.get('token');

    // if (token) {
      const decodedToken = jwtDecode(token);
      // Extract user role from decoded token
      setUserRole(decodedToken.role);
    // }
  }, []);

  return (
    <AuthContext.Provider value={{ userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);