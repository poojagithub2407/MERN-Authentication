import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const ResetPassword = () => {
     const [email, setEmail] = useState('');
     const [newPassword, setNewPassword] = useState('');
     const [isEmailSent, setIsEmailSent] = useState(false);
     const [isOtpSubmit, setOtpSubmit] = useState(false);
     const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Use state for OTP input
     const navigate = useNavigate();
     const { backendUrl } = useContext(AppContext);

     axios.defaults.withCredentials = true;

     // Handle OTP input change
     const handleOtpChange = (index, value) => {
          if (!/^\d?$/.test(value)) return; // Only allow numbers

          const newOtp = [...otp];
          newOtp[index] = value;
          setOtp(newOtp);

          // Move to next input field
          if (value && index < 5) {
               document.getElementById(`otp-${index + 1}`).focus();
          }
     };

     // Handle backspace for OTP inputs
     const handleKeyDown = (index, e) => {
          if (e.key === "Backspace" && !otp[index] && index > 0) {
               document.getElementById(`otp-${index - 1}`).focus();
          }
     };

     // Handle paste event for OTP
     const handlePaste = (e) => {
          e.preventDefault();
          const paste = e.clipboardData.getData("text").slice(0, 6);
          if (!/^\d{6}$/.test(paste)) return;

          setOtp(paste.split(""));
     };

     // Send reset OTP
     const onSubmitEmail = async (e) => {
          e.preventDefault();
          try {
               const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
               if (data.success) {
                    toast.success(data.message);
                    setIsEmailSent(true);
               } else {
                    toast.error(data.message);
               }
          } catch (error) {
               toast.error(error.response?.data?.message || "Something went wrong!");
          }
     };

     // Verify OTP
     const onSubmitOtp = (e) => {
          e.preventDefault();
          if (otp.includes("")) {
               toast.error("Please enter a complete OTP.");
               return;
          }
          setOtpSubmit(true);
     };

     // Reset password
     const onSubmitNewPassword = async (e) => {
          e.preventDefault();
          try {
               const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
                    otp,
                    newPassword,
                    email
               });

               if (data.success) {
                    toast.success(data.message);
                    navigate("/login");
               } else {
                    toast.error(data.message);
               }
          } catch (error) {
               toast.error(error.response?.data?.message || "Something went wrong!");
          }
     };

     return (
          <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
               <img
                    src={assets.logo}
                    alt="Company Logo"
                    onClick={() => navigate("/")}
                    className="absolute left-5 sm:left-20 top-5 sm:w-32 cursor-pointer"
               />

               {/* Email submission form */}
               {!isEmailSent && (
                    <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                         <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
                         <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>
                         <div className="mb-4 flex items-center gap-3 w-full px-3 py-2.5 rounded-full bg-[#333A5C]">
                              <img className="w-3 h-3 mt-1" src={assets.mail_icon} alt="Mail Icon" />
                              <input
                                   type="email"
                                   name="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   placeholder="Email Id"
                                   required
                                   className="bg-transparent outline-none text-white"
                              />
                         </div>
                         <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
                              Submit
                         </button>
                    </form>
               )}

               {/* OTP input form */}
               {!isOtpSubmit && isEmailSent && (
                    <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                         <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
                         <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email.</p>
                         <div className="flex justify-between mb-8">
                              {otp.map((digit, index) => (
                                   <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                                   />
                              ))}
                         </div>
                         <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
                              Submit
                         </button>
                    </form>
               )}

               {/* New password input form */}
               {isOtpSubmit && isEmailSent && (
                    <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                         <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>
                         <p className="text-center mb-6 text-indigo-300">Enter the new password below</p>
                         <div className="mb-4 flex items-center gap-3 w-full px-3 py-2.5 rounded-full bg-[#333A5C]">
                              <img className="w-3 h-3 mt-1" src={assets.lock_icon} alt="Lock Icon" />
                              <input
                                   type="password"
                                   name="password"
                                   value={newPassword}
                                   onChange={(e) => setNewPassword(e.target.value)}
                                   placeholder="Password"
                                   required
                                   className="bg-transparent outline-none text-white"
                              />
                         </div>
                         <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
                              Submit
                         </button>
                    </form>
               )}
          </div>
     );
};

export default ResetPassword;
