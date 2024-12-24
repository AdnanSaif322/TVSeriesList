import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchAnimeDetailsByName } from "../services/api"; // API call
import { AnimeDetails } from "../types/tvSeries"; // Types

// export default function SeriesDetails() {
//   const params = useParams();
//   return <div>{params.name}</div>;
// }

const SeriesDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>(); // Get series name from route
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (name) {
      fetchAnimeDetailsByName(name)
        .then((data) => {
          setAnime(data);
          setError(null); // Clear any previous error
        })
        .catch((err) => {
          console.error("Error fetching anime details:", err);
          setError("Failed to fetch anime details. Please try again.");
        });
    }
  }, [name]);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!anime) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            className="rounded-lg shadow-lg"
            src={anime.imageUrl}
            alt={anime.title}
          />
        </div>
        <div className="md:w-2/3 md:ml-8">
          <h1 className="text-4xl font-bold">{anime.title}</h1>
          <p className="text-sm text-gray-400">{anime.year}</p>
          <p className="mt-2 text-lg text-yellow-400">
            {anime.vote_average}% User Score
          </p>
          <p className="text-sm text-gray-300">{anime.genre}</p>
          <p className="mt-4 text-gray-200">{anime.description}</p>
        </div>
      </div>
    </div>
  );
};

export default SeriesDetails;
