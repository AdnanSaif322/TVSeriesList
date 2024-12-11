import { TvSeries } from "../types/tvSeries";

const API_URL = "http://localhost:3000/series";

export const fetchTvSeries = async (): Promise<TvSeries[]> => {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data.data;
};

export const addTvSeries = async (
  series: Omit<TvSeries, "id">
): Promise<TvSeries> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(series),
  });

  const data = await res.json(); // Get the response data
  return data.data[0]; // Extract the first series from the data array
};

export const updateTvSeries = async (
  id: string,
  updates: Partial<TvSeries>
): Promise<TvSeries> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
};

export const deleteTvSeries = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
