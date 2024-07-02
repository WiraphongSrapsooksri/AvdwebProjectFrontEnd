// Service.tsx
import axios from "axios";
import { registerModel } from "../model/registerModel";

const API_BASE_URL = "http://localhost:4000"; // Change this to your actual API base URL
// const API_BASE_URL =  "http://45.144.165.90:5200"

// Function to handle user signup
export const signUp = async (userData: registerModel) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);

    if (response.data.success) {
      return { status: true, message: "User signed up successfully" };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error signing up user:", error);
    return { status: false, message: "An error occurred while signing up" };
  }
};
export const login = async (userData: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);

    // console.log("Response Data:", response.data); // Log the entire response data

    if (response) {
      const token = response.data; // Assuming the token is directly in response.data
      return {
        status: true,
        message: "User logged in successfully",
        token:token,
      };
    } else {
      return { status: false, message: response };
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return { status: false, message: "An error occurred while logging in" };
  }
};
