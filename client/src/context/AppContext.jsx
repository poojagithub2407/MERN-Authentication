import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
     const backendUrl = import.meta.env.VITE_BACKEND_URL;
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [userData, setUserData] = useState(null);

     axios.defaults.withCredentials = true;

     const getUserData = async () => {
          try {
               const { data } = await axios.get(`${backendUrl}/api/user/data`);
               if (data.success) {
                    setUserData(data.userData);
               } else {
                    setUserData(null);
                    toast.error(data.message);
               }
          } catch (error) {
               setUserData(null);
               toast.error(error.response?.data?.message || "Failed to fetch user data");
          }
     };

     const getAuthState = async () => {
          try {
               const { data } = await axios.post(`${backendUrl}/api/auth/isAuth`);
               if (data.success) {
                    setIsLoggedIn(true);
                    getUserData();
               } else {
                    setIsLoggedIn(false);
               }
          } catch (error) {
               setIsLoggedIn(false);
               toast.error(error.response?.data?.message || "Authentication check failed");
          }
     };

     useEffect(() => {
          getAuthState();
     }, []);

     const value = {
          backendUrl,
          isLoggedIn,
          setIsLoggedIn,
          userData,
          setUserData,
          getUserData,
          getAuthState
     };

     return (
          <AppContext.Provider value={value}>
               {children}
          </AppContext.Provider>
     );
};
