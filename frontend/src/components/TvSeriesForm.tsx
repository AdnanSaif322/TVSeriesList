import React, { useState } from "react";
import { searchTvSeries } from "../services/api"; // Adjust the import path
import { Props, TvSeriesSearchResult } from "../types/tvSeries";

const TvSeriesForm: React.FC<Props> = ({
  name,
  setName,
  setGenre,
  setYear,
  setImageUrl,
  setVoteAverage,
  handleSubmit,
}) => {
  const [searchResults, setSearchResults] = useState<TvSeriesSearchResult[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      setLoading(true); // Start loading
      try {
        const results = await searchTvSeries(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectResult = (result: TvSeriesSearchResult) => {
    setName(result.name);
    setGenre(result.genre);
    setYear(Number(result.year));
    setVoteAverage(result.voteAverage ?? null);
    setImageUrl(result.imageUrl);
    setSearchResults([]); // Clear search results after selecting
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 items-center w-full max-w-sm mx-auto"
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            handleSearch(e.target.value); // Trigger search
          }}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        {loading && (
          <div className="absolute left-0 right-0 mt-1">Loading...</div>
        )}
        {searchResults.length > 0 && (
          <ul
            role="listbox"
            aria-live="polite"
            className="absolute left-0 right-0 mt-1 bg-gray-800 text-white border border-gray-300 max-h-40 overflow-y-auto p-2 rounded-md shadow-lg"
          >
            {searchResults.map((result, index) => (
              <li
                key={result.id || index}
                role="option"
                onClick={() => handleSelectResult(result)}
                className="cursor-pointer p-2 hover:bg-gray-700"
              >
                {result.name} ({result.year})
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="w-full p-3 bg-blue-500 text-white rounded-md mt-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      >
        Add
      </button>
    </form>
  );
};

export default TvSeriesForm;
