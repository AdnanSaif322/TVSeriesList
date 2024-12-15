import { TvSeries } from "../types/tvSeries";

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
  console.log("Flattened tvSeries data:", flattenedSeries);

  return (
    <ul>
      {flattenedSeries.map((series, index) => {
        // Validate each series object
        if (
          !series ||
          typeof series !== "object" ||
          !series.id ||
          !series.name ||
          !series.year
        ) {
          console.warn("Skipping invalid series:", series);
          return null;
        }

        return (
          <li key={series.id || index}>
            {series.name} - {series.genre} ({series.year})
            <button onClick={() => handleEdit(series)}>Edit</button>
            <button onClick={() => handleDelete(series.id)}>Delete</button>
          </li>
        );
      })}
    </ul>
  );
};

export default TvSeriesList;
