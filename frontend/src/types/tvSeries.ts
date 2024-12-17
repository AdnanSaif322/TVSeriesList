import { FormEvent } from "react";

export interface TvSeries {
  id: number;
  name: string;
  genre: string;
  year: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface TvSeriesSearchResult {
  name: string;
  genre: string;
  year: number;
}

export interface Props {
  name: string;
  genre: string;
  year: number | null;
  editingId: number | null;
  setName: (name: string) => void;
  setGenre: (genre: string) => void;
  setYear: (year: number | null) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export interface TvSeriesApiResult {
  name: string;
  genre_ids?: number[]; // Assuming genre_ids is an array of numbers
  first_air_date?: string; // A date string in the format "YYYY-MM-DD"
  id: number;
}
