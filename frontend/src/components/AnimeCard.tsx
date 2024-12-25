// src/components/AnimeCard.tsx
import React from "react";
import { AnimeCardProps } from "../types/tvSeries";
import { Link } from "react-router-dom";

const AnimeCard: React.FC<AnimeCardProps> = ({
  title,
  imageUrl,
  genre,
  voteAverage,
}) => {
  return (
    <Link to={`/series/${title}`} aria-label={`View details of ${title}`}>
      <div className="w-80 h-96 rounded overflow-hidden shadow-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300">
        <img
          className="w-full h-56 object-cover"
          src={imageUrl}
          alt={`Image of ${title}`}
        />
        <div className="p-4">
          <h2 className="text-xl text-white font-semibold">{title}</h2>
          <p className="text-sm text-gray-400">{genre}</p>
          <p className="text-sm text-yellow-400">{voteAverage.toFixed(1)}</p>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
