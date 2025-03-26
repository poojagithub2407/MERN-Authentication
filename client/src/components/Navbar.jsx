import { useNavigate } from "react-router-dom";
import { assets } from "./../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
     const navigate = useNavigate();
     const { userData, backendUrl, setUserData, setIsLoggedIn } =
          useContext(AppContext);

     const logout = async () => {
          try {
               axios.defaults.withCredentials = true;
               const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
               data.success && setIsLoggedIn(false);
               data.success && setUserData(false);
               navigate('/')
          } catch (error) {
               toast.error(error.message)
          }
     }

     const sendVerificationOtp = async () => {
          try {
               axios.defaults.withCredentials = true;
               const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
               if (data.success) {
                    navigate('/verify-email');
                    toast.success(data.message);
               } else {
                    toast.error(data.message);
               }
          } catch (error) {
               toast.error(error)
          }
     }

     return (
          <div className="w-full flex justify-between p-4 sm:p-6 sm:px-24 absolute top-0">
               <img src={assets.logo} className="w-28 sm:w-32" />

               {userData ? (
                    <div className="relative group">
                         <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white text-center leading-8 cursor-pointer">
                              {userData.name[0].toUpperCase()}
                         </div>

                         {/* Dropdown Menu */}
                         <div className="absolute top-10 right-0 w-40 bg-white shadow-md rounded-md p-2 invisible group-hover:visible transition-all duration-200">
                              <ul className="text-black text-sm">
                                   {!userData.isAccountVerified &&
                                        <li className="px-3 py-2 border-b"
                                             onClick={sendVerificationOtp}
                                        >Verify Email</li>}
                                   <li
                                        className="px-3 py-2 text-red-500 cursor-pointer hover:bg-gray-100 rounded-md"
                                        onClick={logout}
                                   >
                                        Log Out
                                   </li>
                              </ul>
                         </div>
                    </div>
               ) : (
                    <button
                         className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
                         onClick={() => navigate("/login")}
                    >
                         Login
                         <img src={assets.arrow_icon} />
                    </button>
               )}
          </div>
     );
};

export default Navbar;
