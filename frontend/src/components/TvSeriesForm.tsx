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

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      try {
        const results = await searchTvSeries(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectResult = (result: TvSeriesSearchResult) => {
    setName(result.name);
    setGenre(result.genre);
    setYear(Number(result.year));
    setVoteAverage(
      result.voteAverage ? Number(result.voteAverage) : (null as number | null)
    );
    setImageUrl(result.imageUrl);
    setSearchResults([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          handleSearch(e.target.value); // Trigger search
        }}
        required
      />
      {searchResults.length > 0 && (
        <ul
          role="listbox"
          style={{
            border: "1px solid #ccc",
            maxHeight: "150px",
            overflowY: "auto",
            padding: "10px",
          }}
        >
          {searchResults.map((result, index) => (
            <li
              key={result.id || index} // Prefer `id` if available
              role="option"
              onClick={() => handleSelectResult(result)}
              style={{ cursor: "pointer", padding: "5px", listStyle: "none" }}
            >
              {result.name} ({result.year})
            </li>
          ))}
        </ul>
      )}

      <button type="submit">Add</button>
    </form>
  );
};

export default TvSeriesForm;
