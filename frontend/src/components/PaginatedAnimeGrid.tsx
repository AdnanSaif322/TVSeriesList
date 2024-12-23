import { useState } from "react";
import { TvSeries } from "../types/tvSeries";
import AnimeCard from "./AnimeCard";

const ITEMS_PER_PAGE = 20;
interface AnimeCardProps {
  flattenedSeries: TvSeries[];
}

export const PaginatedAnimeGrid = ({ flattenedSeries }: AnimeCardProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(flattenedSeries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentItems = flattenedSeries.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {currentItems.map((series, index) => (
          <AnimeCard
            key={index}
            title={series.name}
            imageUrl={series.imageUrl}
            genre={series.genre}
            vote_average={series.vote_average}
          />
        ))}
      </div>

      <div className="flex justify-between p-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Previous
        </button>
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};
