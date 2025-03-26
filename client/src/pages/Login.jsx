import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
const Login = () => {
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [state, setState] = useState("Sign Up");

     const navigate = useNavigate();
     const { backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext);

     const handleSubmit = async (e) => {
          e.preventDefault(); // Prevent default form submission
          axios.defaults.withCredentials = true; // Ensure credentials are sent
      
          try {
              let response;
              if (state === "Sign Up") {
                  response = await axios.post(`${backendUrl}/api/auth/register`, {
                      name,
                      email,
                      password,
                  });
              } else {
                  response = await axios.post(`${backendUrl}/api/auth/login`, {
                      email,
                      password,
                  });
              }
      
              // Extract response data
              const { data } = response;
      
              if (data.success) {
               setIsLoggedIn(true);
                  getUserData()
                  navigate("/");
                  toast.success(data.message || "Login successful!");
              } else {
                  toast.error(data.message || "Something went wrong.");
              }
      
          } catch (error) {
              // Handle different error scenarios
              if (error.response) {
                  // Backend responded with an error status (4xx, 5xx)
                  toast.error(error.response.data.message || "Server error occurred.");
              } else if (error.request) {
                  // Request was made but no response received
                  toast.error("No response from server. Please try again later.");
              } else {
                  // Something went wrong while setting up the request
                  toast.error(error.message || "An error occurred.");
              }
          }
      };
      

     return (
          <div
               className="flex items-center justify-center min-h-screen px-6 sm:px-0
          bg-gradient-to-br from-blue-200 to bg-purple-400"
          >
               <img
                    src={assets.logo}
                    onClick={() => navigate("/")}
                    className="absolute left-5sm:left-20 top-5 sm:w-32 cursor-pointer"
               />
               <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
                    <h2 className="text-3xl font-semibold text-white text-center mb-3">
                         {state === "Sign Up" ? "Create  account" : "Login"}
                    </h2>
                    <p className="text-center text-sm mb-6">
                         {state === "Sign Up" ? "Create your account" : "Login to Your"}
                    </p>
                    <form onSubmit={handleSubmit}>
                         {state === "Sign Up" && (
                              <div className="mb-4 flex item-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                                   <img src={assets.person_icon} />
                                   <input
                                        className="bg-transparent outline-none"
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                   />
                              </div>
                         )}

                         <div className="mb-4 flex item-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                              <img src={assets.mail_icon} />
                              <input
                                   className="bg-transparent outline-none"
                                   type="email"
                                   placeholder="Email Id"
                                   name="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   required
                              />
                         </div>
                         <div className="mb-4 flex item-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                              <img src={assets.lock_icon} />
                              <input
                                   className="bg-transparent outline-none"
                                   type="password"
                                   placeholder="Password"
                                   name="password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   required
                              />
                         </div>
                         <p
                              className="mb-4 text-indigo-500 cursor-pointer"
                              onClick={() => navigate("/reset-password")}
                         >
                              Forgot Password?
                         </p>
                         <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
                              {state}
                         </button>
                    </form>
                    {state === "Sign Up" ? (
                         <p className="text-gray-400 text-center text-xs mt-4">
                              Already have an account?{" "}
                              <span
                                   onClick={() => setState("Login")}
                                   className="text-blue-400 cursor-pointer underline"
                              >
                                   Login Here
                              </span>
                         </p>
                    ) : (
                         <p className="text-gray-400 text-center text-xs mt-4">
                              Dont have an account{" "}
                              <span
                                   onClick={() => setState("Sign Up")}
                                   className="text-blue-400 cursor-pointer underline"
                              >
                                   Sign Up
                              </span>
                         </p>
                    )}
               </div>
          </div>
     );
};

export default Login;
