// src/components/AnimeCard.tsx
import React from "react";
import { AnimeCardProps } from "../types/tvSeries";

const AnimeCard: React.FC<AnimeCardProps> = ({
  title,
  imageUrl,
  genre,
  vote_average,
}) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300">
      <img className="w-full h-56 object-cover" src={imageUrl} alt={title} />
      <div className="p-4">
        <h2 className="text-xl text-white font-semibold">{title}</h2>
        <p className="text-sm text-gray-400">{genre}</p>
        <p className="text-sm text-yellow-400">{vote_average}</p>
      </div>
    </div>
  );
};

export default AnimeCard;
