import { useEffect, useState } from "react";
import { PlantService } from "../services/PlantService";

interface Plant {
  id: number;
  name: string;
  scientificName: string;
  familyCommonName?: string;
  imageUrl?: string | null;
}
export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const plantData = await PlantService.getPlants();
        setPlants(plantData);
      } catch (error) {
        console.error("Error fetching plants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  return { plants, loading };
};
