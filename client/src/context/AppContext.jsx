import axios from "axios";
import { createContext, useState,useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()
axios.defaults.withCredentials = true;

export const AppContextProvider = (props) =>{
   const backendUrl = import.meta.env.VITE_BACKEND_URL
   const [isLoggedin,setIsLoggedin] = useState(false)
   const [userData,setUserData] = useState(false)

   const getAuthState = async () => {
      try {
        const {data} = await axios.get( backendUrl + '/api/auth/is-auth',{ withCredentials: true })
        if(data.success){
          setIsLoggedin(true)
          getUserData()
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
                setIsLoggedin(false);
                setUserData(false);
            } else {
                toast.error("Error checking auth state");
            }
      }
   }

   const getUserData = async () => {
     try {
        const {data} = await axios.get(backendUrl + '/api/user/data',  { withCredentials: true })
        data.success ? setUserData(data.userData) : toast.error(data.message)
     } catch (error) {
         if (!(error.response && error.response.status === 401)) {
                toast.error("Failed to load user data");
            }
     }
   }
     useEffect(() => {
    getAuthState()
  }, []);
    const value = {
        backendUrl,isLoggedin,setIsLoggedin,userData,setUserData,getUserData
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}