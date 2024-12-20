import { TvSeries } from "../types/tvSeries";
import AnimeCard from "./AnimeCard";

interface Props {
  tvSeries: TvSeries[];
  handleEdit: (series: TvSeries) => void;
  handleDelete: (id: number) => void;
}

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
      {flattenedSeries.map((series, index) => (
        <AnimeCard
          key={index}
          title={series.name}
          imageUrl={series.imageUrl}
          genre={series.genre}
          vote_average={series.vote_average}
        />
      ))}
    </div>

    // <ul>
    //   {flattenedSeries.map((series, index) => {
    //     // Validate each series object
    //     if (
    //       !series ||
    //       typeof series !== "object" ||
    //       !series.id ||
    //       !series.name ||
    //       !series.year
    //     ) {
    //       console.warn("Skipping invalid series:", series);
    //       return null;
    //     }

    //     return (
    //       <li key={series.id || index}>
    //         {series.name} - {series.genre} ({series.year})
    //         <button onClick={() => handleEdit(series)}>Edit</button>
    //         <button onClick={() => handleDelete(series.id)}>Delete</button>
    //       </li>
    //     );
    //   })}
    // </ul>
  );
};

export default TvSeriesList;
