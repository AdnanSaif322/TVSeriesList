import { TvSeries } from "../types/tvSeries";
import { PaginatedAnimeGrid } from "./PaginatedAnimeGrid";

interface Props {
  tvSeries: TvSeries[];
  handleDelete: (id: number) => void;
}

const TvSeriesList = ({ tvSeries, handleDelete }: Props) => {
  // Flatten the array to ensure no nested arrays are included
  const flattenedSeries = tvSeries.flat();

  // Check if the list is empty
  if (flattenedSeries.length === 0) {
    return <p>No TV series available</p>;
  }

  //console.log("Flattened tvSeries data:", flattenedSeries);

  return (
    <PaginatedAnimeGrid
      flattenedSeries={flattenedSeries}
      handleDelete={handleDelete}
    />
  );
};

export default TvSeriesList;
