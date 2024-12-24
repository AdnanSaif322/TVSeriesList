import {
  AnimeDetails,
  ApiResponse,
  Genre,
  TvSeries,
  TvSeriesApiResult,
  TvSeriesSearchResult,
} from "../types/tvSeries";

const API_URL = "http://localhost:3000/series";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const fetchTvSeries = async (): Promise<TvSeries[]> => {
  const res = await fetch(API_URL);
  const data = await res.json();
  //console.log("Raw API Response:", data);

  if (!data || !Array.isArray(data.data)) {
    throw new Error("Invalid API response: Expected an array.");
  }

  // Validate each series object
  const validSeries = data.data.filter((series: TvSeries) => {
    return (
      series &&
      typeof series.id === "number" &&
      typeof series.name === "string" &&
      typeof series.genre === "string" &&
      typeof series.year === "number" &&
      typeof series.vote_average === "number" &&
      typeof series.imageUrl === "string"
    );
    console.log(series.imageUrl);
  });

  return validSeries;
};

// Fetch image URL from TMDb
export const getImageUrl = (seriesId: number) => {
  const baseUrl = "https://image.tmdb.org/t/p/w500"; // Base URL for image resources

  return fetch(
    `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${TMDB_API_KEY}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch TV series data.");
      }
      return response.json();
    })
    .then((data) => {
      const posterPath = data?.poster_path; // Use the correct key for the poster image
      return posterPath
        ? `${baseUrl}${posterPath}` // Construct the full image URL
        : "/path/to/default/image.jpg"; // Fallback to default image if no poster_path
    })
    .catch((error) => {
      console.error("Error fetching image:", error);
      return "/path/to/default/image.jpg"; // Default image on error
    });
};

// Fetch genres from TMDb
const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const API_KEY = TMDB_API_KEY; // Use your API key here
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const searchTvSeries = async (
  query: string
): Promise<TvSeriesSearchResult[]> => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error(
        "API key is missing. Make sure it's defined in your .env file."
      );
    }

    const API_URL = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
      query
    )}&api_key=${TMDB_API_KEY}`;
    //console.log("API Key:", TMDB_API_KEY);
    const res = await fetch(API_URL);
    const response = await res.json();

    //Fetch the genre list
    const genres = await fetchGenres();
    const imageUrl = await getImageUrl(response.results[0].id);

    if (response && response.results) {
      return response.results.map((result: TvSeriesApiResult) => {
        // Map genre IDs to names
        const genreNames = result.genre_ids
          .map((id) => genres.find((genre) => genre.id === id)?.name)
          .filter((name) => name); // Filter out undefined values

        return {
          name: result.name,
          genre: genreNames.join(", ") || "Unknown", // Join genre names
          year: result.first_air_date?.split("-")[0] || "Unknown",
          vote_average: result.vote_average,
          id: result.id,
          imageUrl: imageUrl,
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};

export const addTvSeries = async (
  series: Omit<TvSeries, "id">
): Promise<TvSeries> => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(series),
    });

    const response = await res.json();
    console.log("Raw API Response:", response);

    // Check if `data` is an object and contains valid series data
    if (response && response.data && typeof response.data === "object") {
      return response.data;
    }

    throw new Error("Response does not contain valid series data");
  } catch (error) {
    console.error("Error in addTvSeries:", error);
    throw error;
  }
};

export const updateTvSeries = async (
  id: number,
  updates: Partial<TvSeries>
): Promise<TvSeries> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      throw new Error(`Failed to update TV series. Status: ${res.status}`);
    }

    const response: ApiResponse<TvSeries> = await res.json();
    console.log("Raw API Response:", response);

    if (response && response.data && typeof response.data === "object") {
      return response.data;
    }

    throw new Error("Response does not contain valid series data");
  } catch (error) {
    console.error("Error in updateTvSeries:", error);
    throw error;
  }
};

export const deleteTvSeries = async (id: number): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      throw new Error(
        `Failed to delete TV series with ID: ${id}. Status: ${res.status}`
      );
    }

    console.log(`Successfully deleted TV series with ID: ${id}`);
  } catch (error) {
    console.error("Error in deleteTvSeries:", error);
    throw error;
  }
};

export const fetchAnimeDetailsByName = async (
  name: string
): Promise<AnimeDetails> => {
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";

  // Step 1: Search TMDb by name
  const searchResponse = await fetch(
    `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      name
    )}`
  );
  if (!searchResponse.ok) {
    throw new Error("Failed to search for anime by name");
  }
  const searchData = await searchResponse.json();

  // Check if any results were found
  if (!searchData.results || searchData.results.length === 0) {
    throw new Error("No results found for the provided name");
  }

  // Step 2: Get the first result's ID
  const seriesId = searchData.results[0].id;

  // Step 3: Fetch series details by ID
  const detailsResponse = await fetch(
    `${TMDB_BASE_URL}/tv/${seriesId}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  if (!detailsResponse.ok) {
    throw new Error("Failed to fetch anime details");
  }
  const detailsData = await detailsResponse.json();

  // Step 3: Fetch cast details
  const creditsResponse = await fetch(
    `${TMDB_BASE_URL}/tv/${seriesId}/credits?api_key=${TMDB_API_KEY}`
  );
  const creditsData = await creditsResponse.json();

  // Map cast details
  const cast = creditsData.cast.slice(0, 12).map((member: any) => ({
    id: member.id,
    name: member.name,
    character: member.character,
    imageUrl: member.profile_path
      ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
      : "https://via.placeholder.com/500x750?text=No+Image",
    episodes: member.total_episode_count || 0,
  }));

  // Return the combined details
  return {
    title: detailsData.name,
    imageUrl: `https://image.tmdb.org/t/p/w500${detailsData.poster_path}`,
    genre: detailsData.genres.map((g: any) => g.name).join(", "),
    vote_average: detailsData.vote_average,
    year: new Date(detailsData.first_air_date).getFullYear(),
    description: detailsData.overview,
    cast, // You can extend this to include cast data if needed
  };
};
