import axios from "axios";
import { config } from "../config";

export const PlantService = {
  getPlants: async () => {
    try {
      const response = await axios.get(config.PLANTS);
      return response.data; 
    } catch (error) {
      console.error("Error fetching plants:", error);
      throw error;
    }
  },
};
