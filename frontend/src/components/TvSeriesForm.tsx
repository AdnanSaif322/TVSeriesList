import React, { FormEvent } from "react";

interface Props {
  name: string;
  genre: string;
  year: string;
  editingId: string | null;
  setName: (name: string) => void;
  setGenre: (genre: string) => void;
  setYear: (year: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

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
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <button type="submit">{editingId ? "Update" : "Add"}</button>
    </form>
  );
};

export default TvSeriesForm;
