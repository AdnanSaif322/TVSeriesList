import { TvSeries } from "../types/tvSeries";
import AnimeCard from "./AnimeCard";

interface Props {
  tvSeries: TvSeries[];
  handleEdit: (series: TvSeries) => void;
  handleDelete: (id: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TvSeriesList = ({ tvSeries, handleEdit, handleDelete }: Props) => {
  // Flatten the array to ensure no nested arrays are included
  const flattenedSeries = tvSeries.flat();

  // Check if the list is empty
  if (!Array.isArray(flattenedSeries) || flattenedSeries.length === 0) {
    return <p>No TV series available</p>;
  }

  // Logging for debugging
  // console.log("Flattened tvSeries data:", flattenedSeries);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {flattenedSeries.map((series, index) => {
        // const imageUrl = imageUrls[series.id] || "/path/to/default/image.jpg"; // Fallback if image URL is not available yet

        return (
          <AnimeCard
            key={index}
            title={series.name}
            imageUrl={series.imageUrl}
            genre={series.genre}
            vote_average={series.vote_average}
          />
        );
      })}
    </div>
  );
};

export default TvSeriesList;
