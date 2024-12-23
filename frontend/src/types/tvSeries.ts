import { FormEvent } from "react";

export interface TvSeries {
  id: number;
  name: string;
  genre: string;
  year: number;
  vote_average: number;
  imageUrl: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface TvSeriesSearchResult {
  name: string;
  genre: string;
  year: number;
  vote_average: number;
  imageUrl: string;
}

export interface Props {
  name: string;
  genre: string;
  year: number | null;
  vote_average: number | null;
  editingId: number | null;
  imageUrl: { [key: number]: string };
  setName: (name: string) => void;
  setGenre: (genre: string) => void;
  setYear: (year: number | null) => void;
  setVote_average: (vote_average: number | null) => void;
  setImageUrl: (imgaeUrl: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export interface TvSeriesApiResult {
  id: number;
  name: string;
  genre_ids: number[];
  first_air_date: string;
  vote_average: number;
  imageUrl: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface AnimeCardProps {
  title: string;
  imageUrl: string;
  genre: string;
  vote_average: number;
}
