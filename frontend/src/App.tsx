import React, { useEffect, useState } from "react";
//import "./index.css";
import {
  fetchTvSeries,
  addTvSeries,
  updateTvSeries,
  deleteTvSeries,
} from "./services/api";
import { TvSeries } from "./types/tvSeries";
import TvSeriesForm from "./components/TvSeriesForm";
import TvSeriesList from "./components/TvSeriesList";
import Swal from "sweetalert2";

function App() {
  const [tvSeries, setTvSeries] = useState<TvSeries[]>([]);
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState<number | null>(0);
  const [voteAverage, setVoteAverage] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(""); // To store image URLs
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTvSeries()
      .then((fetchedSeries) => {
        // console.log("Fetched TV Series:", fetchedSeries);

        if (Array.isArray(fetchedSeries)) {
          const filteredSeries = fetchedSeries.filter(
            (series) => series !== undefined
          );
          setTvSeries(filteredSeries);
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
  console.log(tvSeries);
  if (tvSeries.length == 0) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !genre || !year || !voteAverage) {
      alert("Please fill in all fields.");
      return;
    }

    // console.log("Image URL:", imageUrl);
    const payload = { name, genre, year, voteAverage, imageUrl };

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
          Swal.fire({
            title: "Success!",
            text: "TV series added successfully!",
            icon: "success",
            confirmButtonText: "OK",
            timer: 3000,
            timerProgressBar: true,
          });
          resetForm();
        })
        .catch((error) => {
          console.error("Error adding series:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to add the series. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
            timer: 5000,
            timerProgressBar: true,
          });
        });
    }
  };

  // const handleEdit = (series: TvSeries) => {
  //   setEditingId(
  //     typeof series.id === "string" ? parseInt(series.id, 10) : series.id
  //   );
  //   setName(series.name);
  //   setGenre(series.genre);
  //   setYear(
  //     typeof series.year === "string" ? parseInt(series.year, 10) : series.year
  //   );
  // };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTvSeries(id)
          .then(() => {
            setTvSeries((prev) => prev.filter((series) => series.id !== id));
            Swal.fire(
              "Deleted!",
              "The TV series has been deleted successfully.",
              "success"
            );
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(
              "Error!",
              "Failed to delete the TV series. Please try again.",
              "error"
            );
          });
      }
    });
  };

  const resetForm = () => {
    setName("");
    setGenre("");
    setYear(0);
    setVoteAverage(0);
    setEditingId(null);
    setImageUrl("");
  };

  return (
    <div className="flex flex-wrap justify-center">
      <div className="w-full text-center mb-4">
        <h1>Series List</h1>
      </div>
      <div className="w-full flex justify-center mb-4">
        <TvSeriesForm
          name={name}
          genre={genre}
          year={year}
          voteAverage={voteAverage}
          editingId={editingId}
          setName={setName}
          setGenre={setGenre}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          setYear={setYear}
          setVoteAverage={setVoteAverage}
          handleSubmit={handleSubmit}
        />
      </div>
      <div className="w-full flex justify-center">
        <TvSeriesList
          tvSeries={tvSeries}
          // handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;
