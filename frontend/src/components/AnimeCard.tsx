import React, { useCallback } from "react";
import { AnimeCardProps } from "../types/tvSeries";
import { Link } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/outline";

const AnimeCard: React.FC<AnimeCardProps> = ({
  id,
  title,
  imageUrl,
  genre,
  voteAverage,
  handleDelete,
}) => {
  const handleDeleteClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      handleDelete(id);
    },
    [handleDelete, id]
  );

  return (
    <div className="w-80 h-96 rounded overflow-hidden shadow-lg bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-300 relative">
      {/* Delete button positioned on top of the image */}
      <button
        onClick={handleDeleteClick} // Custom delete handler
        className="absolute top-2 right-2 p-2 bg-gray-500 text-white rounded-full opacity-75 hover:bg-red-600 hover:opacity-100 transition-opacity duration-200"
      >
        <TrashIcon className="w-6 h-6" />
      </button>

      {/* Link to series details */}
      <Link to={`/series/${title}`} aria-label={`View details of ${title}`}>
        <img
          className="w-full h-56 object-cover"
          src={imageUrl}
          alt={`Image of ${title}`}
        />
        <div className="p-4">
          <h2 className="text-xl text-white font-semibold">{title}</h2>
          <p className="text-sm text-gray-400">{genre}</p>
          <p className="text-sm text-yellow-400">
            {voteAverage ? voteAverage.toFixed(1) : "N/A"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;
