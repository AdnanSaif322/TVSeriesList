import React, { useState } from "react";
import { searchTvSeries } from "../services/api"; // Adjust the import path
import { Props, TvSeriesSearchResult } from "../types/tvSeries";

const TvSeriesForm: React.FC<Props> = ({
  name,
  genre,
  year,
  vote_average,
  editingId,
  setName,
  setGenre,
  setYear,
  imageUrl,
  setImageUrl,
  setVote_average,
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
    console.log("Selected result:", result);
    setName(result.name);
    setGenre(result.genre);
    setYear(Number(result.year));
    setVote_average(
      result.vote_average !== undefined ? Number(result.vote_average) : null
    );
    setImageUrl(result.imageUrl);
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
        type="hidden"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        required
      />
      <input
        type="hidden"
        placeholder="Year"
        value={year ?? ""}
        onChange={(e) =>
          setYear(e.target.value ? Number(e.target.value) : null)
        } // Set to null if empty
        required
      />
      <input
        type="hidden"
        placeholder="Rating"
        value={
          vote_average !== null && vote_average !== undefined
            ? vote_average
            : ""
        } // Ensure empty string for null/undefined
        onChange={(e) =>
          setVote_average(e.target.value !== "" ? Number(e.target.value) : null)
        } // Convert to number only if not empty
        required
      />
      <input
        type="hidden"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)} // Update image URL state
        required
      />

      <button type="submit">{editingId ? "Update" : "Add"}</button>
    </form>
  );
};

export default TvSeriesForm;
