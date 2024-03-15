// Service.tsx
import axios from "axios";

const API_KEY = "5785a4ad5fcd252bda7cf597309e8ec7";
// eslint-disable-next-line react-refresh/only-export-components
const EXP = 15552000;
const API_BASE_URL = "https://api.imgbb.com/1/upload";


const API_BASE_URLHost = "http://localhost:4000";
// const API_BASE_URLHost = "http://45.144.165.90:5200"

// Function to handle user signup
export const convertImagetoURL = async (imagefile: File | null) => {
  try {
    if (imagefile === null) {
      throw new Error("No file provided");
    }

    const formData = new FormData();
    formData.append("key", API_KEY);
    formData.append("image", imagefile);

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
    console.error("Error uploading image:", error);
    // Make sure to return an appropriate error message from the actual error object
    return {
      status: false,
      message:
        (error as Error).message ||
        "An error occurred while uploading the image",
    };
  }
};

export const updateImage = async (
  imgage_url: string,
  image_id: number,
  user_id: number
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URLHost}/delete_update/updateimage`,
      {
        user_id: user_id,
        image_id: image_id,
        image_url: imgage_url,
      }
    );
    if (response.status === 200) {
      return { status: true, message: "Image updated successfully" };
    } else {
      return { status: false, message: "Image update failed" };
    }
  } catch (error) {
    console.error("Error updating image:", error);
    return {
      status: false,
      message:
        (error as Error).message ||
        "An error occurred while updating the image",
    };
  }
};

export const addimage = async (imgage_url: string, user_id: number) => {
  try {
    const response = await axios.post(`${API_BASE_URLHost}/post/insertimage`, {
      user_id: user_id,
      image_url: imgage_url,
    });
    if (response.status === 200) {
      return { status: true, message: "Image added successfully" };
    } else {
      return { status: false, message: "Image add failed" };
    }
  } catch (error) {
    console.error("Error adding image:", error);
    return {
      status: false,
      message:
        (error as Error).message || "An error occurred while adding the image",
    };
  }
};

export const deleteimageByuser = async (image_id: number, user_id: number) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URLHost}/delete_update/deleteimageByuser`,
      {
        data: {
          user_id: user_id,
          image_id: image_id,
        },
      }
    );
    if (response.status === 200) {
      return { status: true, message: "Image deleted successfully" };
    } else {
      return { status: false, message: "Image delete failed" };
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      status: false,
      message:
        (error as Error).message ||
        "An error occurred while deleting the image",
    };
  }
};

export const updatevoteImage = async (
  user_id: number,
  image_id: number,
  votes: number
) => {
  try {
    console.log(user_id, image_id, votes);

    const response = await axios.post(
      `${API_BASE_URLHost}/post/updatevoteImage`,
      {
        user_id: user_id,
        image_id: image_id,
        vote_value: votes,
      }
    );
    if (response.status === 200) {
      return { status: true, message: "Image updated successfully" };
    } else {
      return { status: false, message: "Image update failed" };
    }
  } catch (error) {
    console.error("Error updating image:", error);
    return {
      status: false,
      message:
        (error as Error).message ||
        "An error occurred while updating the image",
    };
  }
};
