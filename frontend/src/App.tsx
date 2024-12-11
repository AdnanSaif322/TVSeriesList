import React, { useEffect, useState } from "react";
import "./App.css";
import {
  fetchTvSeries,
  addTvSeries,
  updateTvSeries,
  deleteTvSeries,
} from "./services/api";
import { TvSeries } from "./types/tvSeries";
import TvSeriesForm from "./components/TvSeriesForm";
import TvSeriesList from "./components/TvSeriesList";

function App() {
  const [tvSeries, setTvSeries] = useState<TvSeries[]>([]);
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    //console.log("Current TV series List:", tvSeries); //log the state after its updated
    fetchTvSeries().then(setTvSeries).catch(console.error);
  }, []);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !genre || !year) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = { name, genre, year };

    if (editingId) {
      updateTvSeries(editingId, payload)
        .then((updatedSeries) => {
          setTvSeries((prev) =>
            prev.map((series) =>
              series.id === editingId ? updatedSeries : series
            )
          );
          resetForm();
        })
        .catch(console.error);
    } else {
      addTvSeries(payload)
        .then((newSeries) => {
          setTvSeries((prev) => [...prev, newSeries]);
          resetForm();
        })
        .catch(console.error);
    }
  };

  const handleEdit = (series: TvSeries) => {
    setEditingId(series.id);
    setName(series.name);
    setGenre(series.genre);
    setYear(series.year);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this TV series?")) {
      deleteTvSeries(id)
        .then(() =>
          setTvSeries((prev) => prev.filter((series) => series.id !== id))
        )
        .catch(console.error);
    }
  };

  const resetForm = () => {
    setName("");
    setGenre("");
    setYear("");
    setEditingId(null);
  };

  return (
    <div>
      <h1>TV Series List</h1>
      <TvSeriesForm
        name={name}
        genre={genre}
        year={year}
        editingId={editingId}
        setName={setName}
        setGenre={setGenre}
        setYear={setYear}
        handleSubmit={handleSubmit}
      />
      <TvSeriesList
        tvSeries={tvSeries}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default App;
