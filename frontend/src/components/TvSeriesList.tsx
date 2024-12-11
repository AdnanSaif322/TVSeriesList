import { TvSeries } from "../types/tvSeries";

interface Props {
  tvSeries: TvSeries[];
  handleEdit: (series: TvSeries) => void;
  handleDelete: (id: string) => void;
}

const TvSeriesList = ({ tvSeries, handleEdit, handleDelete }: Props) => {
  if (!tvSeries || tvSeries.length === 0) {
    return <p>No TV series available</p>; // Display a message when there are no TV series
  }

  return (
    <ul>
      {tvSeries.map((series) => {
        if (!series || !series.name) {
          console.warn("Skipping invalid series:", series); // Log any invalid series
          return null; // Skip rendering if series is invalid
        }

        return (
          <li key={series.id}>
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
