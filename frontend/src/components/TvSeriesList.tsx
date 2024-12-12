import { TvSeries } from "../types/tvSeries";

interface Props {
  tvSeries: TvSeries[];
  handleEdit: (series: TvSeries) => void;
  handleDelete: (id: string) => void;
}

const TvSeriesList = ({ tvSeries, handleEdit, handleDelete }: Props) => {
  if (!tvSeries || tvSeries.length === 0) {
    return <p>No TV series available</p>; // Show message if list is empty
  }

  return (
    <ul>
      {tvSeries.map((series, index) => {
        if (!series || typeof series !== "object" || !series.name) {
          console.warn("Skipping invalid series:", series);
          return null; // Skip rendering invalid series
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
