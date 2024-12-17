import React, { useState } from "react";
import { searchTvSeries } from "../services/api"; // Adjust the import path
import { Props, TvSeriesSearchResult } from "../types/tvSeries";

const TvSeriesForm: React.FC<Props> = ({
  name,
  genre,
  year,
  editingId,
  setName,
  setGenre,
  setYear,
  handleSubmit,
}) => {
  const [searchResults, setSearchResults] = useState<TvSeriesSearchResult[]>(
    []
  );

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      const results = await searchTvSeries(query); // Fetch results from the API
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectResult = (result: TvSeriesSearchResult) => {
    setName(result.name);
    setGenre(result.genre);
    setYear(Number(result.year));
    setSearchResults([]); // Clear search results after selection
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
          style={{
            border: "1px solid #ccc",
            maxHeight: "150px",
            overflowY: "auto",
            padding: "10px",
          }}
        >
          {searchResults.map((result, index) => (
            <li
              key={index}
              onClick={() => handleSelectResult(result)}
              style={{ cursor: "pointer", padding: "5px", listStyle: "none" }}
            >
              {result.name} ({result.year})
            </li>
          ))}
        </ul>
      )}
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Year"
        value={year ?? ""}
        onChange={(e) =>
          setYear(e.target.value ? Number(e.target.value) : null)
        } // Set to null if empty
        required
      />
      <button type="submit">{editingId ? "Update" : "Add"}</button>
    </form>
  );
};

export default TvSeriesForm;
