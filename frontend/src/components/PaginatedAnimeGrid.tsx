import { useState, useMemo } from "react";
import { TvSeries } from "../types/tvSeries";
import AnimeCard from "./AnimeCard";

const ITEMS_PER_PAGE = 20;
interface AnimeCardProps {
  flattenedSeries: TvSeries[];
  itemsPerPage?: number;
}

export const PaginatedAnimeGrid = ({
  flattenedSeries,
  itemsPerPage = ITEMS_PER_PAGE,
}: AnimeCardProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(flattenedSeries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = useMemo(() => {
    return flattenedSeries.slice(startIndex, endIndex);
  }, [startIndex, endIndex, flattenedSeries]);

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
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {currentItems.map((series) => (
          <AnimeCard
            key={series.id}
            title={series.name}
            imageUrl={series.imageUrl}
            genre={series.genre}
            voteAverage={series.voteAverage}
          />
        ))}
      </div>

      <div className="flex justify-between p-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-gray-500 text-white"
          }`}
        >
          Previous
        </button>
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-gray-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
