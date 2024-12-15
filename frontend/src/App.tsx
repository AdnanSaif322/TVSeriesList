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
  const [year, setYear] = useState<number>(0);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTvSeries()
      .then((fetchedSeries) => {
        console.log("Fetched TV Series:", fetchedSeries);

        if (Array.isArray(fetchedSeries)) {
          setTvSeries(fetchedSeries.filter((series) => series !== undefined));
        } else {
          console.error("Invalid fetched series:", fetchedSeries);
          setTvSeries([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch TV series:", error);
        setTvSeries([]);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !genre || !year) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = { name, genre, year };

    if (editingId !== null) {
      updateTvSeries(editingId, payload) // Convert editingId to number
        .then((updatedSeries) => {
          setTvSeries((prev) =>
            prev.map(
              (series) =>
                series.id === Number(editingId) ? updatedSeries : series // Ensure id comparison is number
            )
          );
          resetForm();
        })
        .catch((error) => {
          console.error("Error updating series:", error);
          alert("Failed to update the series. Please try again.");
        });
    } else {
      addTvSeries(payload)
        .then((newSeries) => {
          setTvSeries((prev) => [...prev, newSeries]);
          resetForm();
        })
        .catch((error) => {
          console.error("Error adding series:", error);
          alert("Failed to add the series. Please try again.");
        });
    }
  };

  const handleEdit = (series: TvSeries) => {
    setEditingId(
      typeof series.id === "string" ? parseInt(series.id, 10) : series.id
    );
    setName(series.name);
    setGenre(series.genre);
    setYear(
      typeof series.year === "string" ? parseInt(series.year, 10) : series.year
    );
  };

  const handleDelete = (id: number) => {
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
    setYear(0);
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
