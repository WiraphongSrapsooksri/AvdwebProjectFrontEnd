import axios from "axios";
import { ChartModel } from "../model/ChartModel";
import { ImageVoteModel } from "../model/ImageVoteModel";
import { ListImageByID } from "../model/ListImageByID";
import { ListRankImage } from "../model/ListRankImage";

// const BASE_URL = "http://localhost:4000";
const BASE_URL =  "http://45.144.165.90:5200"



export const getRankImageall = async (): Promise<ListRankImage[]> => {
  try {
    const response = await axios.get<ListRankImage[]>(
      `${BASE_URL}/get/rangimage`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching rank image:", error);
    throw error;
  }
};

// export const getusernamebyIdService = async (id: number): Promise<string> => {
//   try {
//     const response = await axios.get<string>(`${BASE_URL}/get/getusernamebyid/${id}`);

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching username:", error);
//     throw error;
//   }
// };

export const getListimageById = async (id: number): Promise<ListImageByID[]> => {
  try {
    const response = await axios.get<ListImageByID[]>(
      `${BASE_URL}/get/getListimagebyid/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching rank image:", error);
    throw error;
  }
};

export const getdaily_statsByIdImage = async (
  id: number
): Promise<ChartModel[]> => {
  try {
    const response = await axios.get<ChartModel[]>(
      `${BASE_URL}/get/getdaily_statsByIdImage/${id}`
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching daily stats by image ID:", error);
    throw error;
  }
};

export const getListDaily_statsByIduser = async (
  id: number
): Promise<ChartModel[]> => {
  try {
    const response = await axios.get<ChartModel[]>(
      `${BASE_URL}/get/getListDaily_statsByIduser/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching daily stats by user ID:", error);
    throw error;
  }
};

export const getRandomImage = async (): Promise<ImageVoteModel[]> => {
  try {
    const response = await axios.get<ImageVoteModel[]>(
      `${BASE_URL}/get/getRandomImage`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching random image:", error);
    throw error;
  }
};
