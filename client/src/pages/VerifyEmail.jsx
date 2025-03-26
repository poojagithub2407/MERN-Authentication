import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const VerifyEmail = () => {
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { backendUrl, getUserData, } = useContext(AppContext);

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").slice(0, 6); // Ensure only 6 characters
        paste.split("").forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
                if (index < inputRefs.current.length - 1) {
                    inputRefs.current[index + 1].focus();
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        try {
            const otpArray = inputRefs.current.map((e) => e.value);
            const otp = otpArray.join("");

            const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

            if (data.success) {
                toast.success(data.message);
                getUserData();
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(()=>{

    },[])

    return (
        <div
            className="flex items-center justify-center min-h-screen px-6 sm:px-0 
            bg-gradient-to-br from-blue-200 to-purple-400"
        >
            <img
                src={assets.logo}
                alt="Company Logo"
                onClick={() => navigate("/")}
                className="absolute left-5 sm:left-20 top-5 sm:w-32 cursor-pointer"
            />
            <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                <h1 className="text-white text-2xl font-semibold text-center mb-4">
                    Email Verify OTP
                </h1>
                <p className="text-center mb-6 text-indigo-300">
                    Enter the 6-digit code sent to your email.
                </p>
                <div className="flex justify-between mb-8">
                    {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <input
                                type="text"
                                maxLength="1"
                                key={index}
                                required
                                ref={(e) => (inputRefs.current[index] = e)}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                            />
                        ))}
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
                    Verify Email
                </button>
            </form>
        </div>
    );
};

export default VerifyEmail;
