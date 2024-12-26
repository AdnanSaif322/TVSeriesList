import {
  AnimeDetails,
  TvSeries,
  TvSeriesApiResult,
  TvSeriesSearchResult,
} from "../types/tvSeries";

const API_URL = "http://localhost:3000/series";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const DEFAULT_IMAGE = "/path/to/default/image.jpg";

export const fetchTvSeries = async (): Promise<TvSeries[]> => {
  const res = await fetch(API_URL);
  const data = await res.json();
  console.log("Raw API Response:", data);

  if (!data || !Array.isArray(data.data)) {
    throw new Error("Invalid API response: Expected an array.");
  }

  // Validate each series object
  const validSeries = data.data.filter((series: TvSeries) => {
    const isValid =
      series &&
      typeof series.id === "number" &&
      typeof series.name === "string" &&
      typeof series.genre === "string" &&
      typeof series.year === "number" &&
      typeof series.voteAverage === "number" &&
      typeof series.imageUrl === "string";
    if (!isValid) {
      console.log("Invalid Series:", JSON.stringify(series, null, 2));
    }
    return isValid;
  });
  console.log("Valid Series:", validSeries);
  return validSeries;
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
    // Fetch search results
    const SEARCH_API_URL = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
      query
    )}&api_key=${TMDB_API_KEY}`;
    const searchRes = await fetch(SEARCH_API_URL);
    const searchResponse = await searchRes.json();

    if (
      searchResponse &&
      searchResponse.results &&
      searchResponse.results.length > 0
    ) {
      // Map search results and fetch detailed data for each
      const detailedResults = await Promise.all(
        searchResponse.results.map(async (result: TvSeriesApiResult) => {
          const detailsRes = await fetch(
            `https://api.themoviedb.org/3/tv/${result.id}?api_key=${TMDB_API_KEY}&language=en-US`
          );
          const detailsData = await detailsRes.json();

          // Map detailed data to your result structure
          return {
            name: detailsData.name,
            genre: detailsData.genres.map((g: any) => g.name).join(", "),
            year: new Date(detailsData.first_air_date).getFullYear().toString(),
            voteAverage: detailsData.vote_average,
            id: detailsData.id,
            imageUrl: detailsData.poster_path
              ? `https://image.tmdb.org/t/p/w500${detailsData.poster_path}`
              : DEFAULT_IMAGE,
          };
        })
      );

      return detailedResults;
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
  //console.log(creditsData.cast);

  // Map cast details
  const cast = creditsData.cast.slice(0, 18).map((member: any) => ({
    id: member.id,
    name: member.name,
    character: member.character,
    imageUrl: member.profile_path
      ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
      : "https://via.placeholder.com/500x750?text=No+Image",
  }));

  console.log("Details Data:", JSON.stringify(detailsData, null, 2));
  const numberOfSeasons = detailsData.seasons.length;
  // Return the combined details
  return {
    title: detailsData.name,
    imageUrl: detailsData.poster_path
      ? `https://image.tmdb.org/t/p/w500${detailsData.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image",
    genre: detailsData.genres.map((g: any) => g.name).join(", "),
    vote_average: detailsData.vote_average,
    year: new Date(detailsData.first_air_date).getFullYear(),
    description: detailsData.overview,
    cast, // You can extend this to include cast data if needed
    backgroundImageUrl: `https://image.tmdb.org/t/p/w500${detailsData.backdrop_path}`,
    episodeCount: detailsData.number_of_episodes,
    seasonCount: numberOfSeasons,
  };
};
