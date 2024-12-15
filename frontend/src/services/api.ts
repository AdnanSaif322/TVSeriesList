import { TvSeries } from "../types/tvSeries";

const API_URL = "http://localhost:3000/series";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export const fetchTvSeries = async (): Promise<TvSeries[]> => {
  const res = await fetch(API_URL);
  const data = await res.json();

  if (!data || !Array.isArray(data.data)) {
    throw new Error("Invalid API response: Expected an array.");
  }

  // Validate each series object
  const validSeries = data.data.filter((series: TvSeries) => {
    return (
      series &&
      typeof series.id === "number" &&
      typeof series.name === "string" &&
      typeof series.genre === "string" &&
      typeof series.year === "number"
    );
  });

  return validSeries;
};

export const addTvSeries = async (
  series: Omit<TvSeries, "id">
): Promise<TvSeries> => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(series),
    });

    const response = await res.json();
    console.log("Raw API Response:", response);

    // Check if `data` is an object and contains valid series data
    if (response && response.data && typeof response.data === "object") {
      return response.data;
    }

    throw new Error("Response does not contain valid series data");
  } catch (error) {
    console.error("Error in addTvSeries:", error);
    throw error;
  }
};

export const updateTvSeries = async (
  id: number,
  updates: Partial<TvSeries>
): Promise<TvSeries> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      throw new Error(`Failed to update TV series. Status: ${res.status}`);
    }

    const response: ApiResponse<TvSeries> = await res.json();
    console.log("Raw API Response:", response);

    if (response && response.data && typeof response.data === "object") {
      return response.data;
    }

    throw new Error("Response does not contain valid series data");
  } catch (error) {
    console.error("Error in updateTvSeries:", error);
    throw error;
  }
};

export const deleteTvSeries = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      throw new Error(
        `Failed to delete TV series with ID: ${id}. Status: ${res.status}`
      );
    }

    console.log(`Successfully deleted TV series with ID: ${id}`);
  } catch (error) {
    console.error("Error in deleteTvSeries:", error);
    throw error;
  }
};
