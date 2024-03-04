// Service.tsx
import axios from "axios";

const API_KEY = "5785a4ad5fcd252bda7cf597309e8ec7";
// eslint-disable-next-line react-refresh/only-export-components
const EXP = 15552000;
const API_BASE_URL = 'https://api.imgbb.com/1/upload';

// Function to handle user signup
export const convertImagetoURL = async (imagefile: null) => {
  try {
    const formData = new FormData();
    formData.append("key", API_KEY);
    formData.append("image", imagefile || "");

    const response = await axios.post(
      `${API_BASE_URL}?expiration=${EXP}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      return { status: true, url: response.data.data.url };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Error signing up user:", error);
    return { status: false, message: "An error occurred while signing up" };
  }
};
