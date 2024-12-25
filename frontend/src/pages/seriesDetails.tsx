import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchAnimeDetailsByName } from "../services/api"; // API call
import { AnimeDetails, CastMember } from "../types/tvSeries"; // Types

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
    <div className="text-white">
      {/* Header Section */}
      <div
        className="relative w-full h-auto bg-auto bg-center"
        style={{
          backgroundImage: `url(${anime.backgroundImageUrl})`,
          backgroundSize: "cover", // Ensures background image covers the area
          backgroundPosition: "center", // Keeps the image centere
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 anime-background-overlay"></div>

        <div className="relative z-10 w-full px-4 py-12 flex flex-col md:flex-row items-center">
          {/* Anime Poster */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <img
              className="rounded-lg shadow-lg max-w-full h-auto"
              src={anime.imageUrl}
              alt={anime.title}
            />
          </div>
          {/* Anime Info */}
          <div className="w-full md:w-2/3 md:ml-8 text-center md:text-left mt-4 md:mt-0">
            <h1 className="text-2xl md:text-4xl font-bold">{anime.title}</h1>
            <p className="text-sm text-gray-400 mt-1">{anime.year}</p>
            <p className="mt-2 text-lg text-yellow-400">
              {anime.voteAverage}% User Score
            </p>
            <p className="text-sm text-gray-300 mt-1">{anime.genre}</p>
            <p className="mt-4 text-gray-200">{anime.description}</p>
            <p className="mt-4 text-gray-200">{anime.episodeCount} Episodes!</p>
            <p className="mt-4 text-gray-200">Find More on</p>
            <div className="flex flex-wrap gap-4 mt-4">
              {/* Fandom Wiki Button */}
              <a
                href={`https://www.community.fandom.com/wiki/${encodeURIComponent(
                  anime.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="custom-button px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-green-600"
              >
                Fandom Wiki
              </a>

              {/* MyAnimeList Button */}
              <a
                href={`https://myanimelist.net/search/all?q=${encodeURIComponent(
                  anime.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="custom-button px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                My AnimeList
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="w-full px-4 py-8">
        <h2 className="text-xl md:text-2xl font-semibold text-center md:text-left">
          Series Cast
        </h2>
        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
          {anime.cast.map((actor: CastMember) => (
            <div
              key={actor.id}
              className="bg-gray-700 rounded-lg shadow-lg overflow-hidden max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg"
            >
              <img
                src={actor.imageUrl}
                alt={actor.name}
                className="h-48 sm:h-64 md:h-60 lg:h-72 xl:h-80 max-h-96 w-full object-cover "
              />
              <div className="p-4">
                <h3 className="text-md font-semibold">{actor.name}</h3>
                <p className="text-sm text-gray-400">{actor.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetails;
