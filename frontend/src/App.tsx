import { useEffect, useState } from "react";
import "./App.css";
import { FormEvent } from "react";

interface TvSeries {
  id: string;
  name: string;
  genre: string;
  year: string;
}

function App() {
  const [tvSeries, setTvSeries] = useState<TvSeries[]>([]);
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_URL = "http://localhost:3000"; // Hono backend URL

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => res.json())
      .then((data) => setTvSeries(data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const payload = { name, genre, year };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        setTvSeries(
          (prev) =>
            editingId
              ? prev.map((series) =>
                  series.id === editingId ? { ...series, ...payload } : series
                )
              : [...prev, { id: `${Date.now()}`, ...payload }] // Generate a new ID dynamically
        );
        setName("");
        setGenre("");
        setYear("");
        setEditingId(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id: string) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() =>
        setTvSeries((prev) => prev.filter((series) => series.id !== id))
      )
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>TV Series List</h1>
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

      <ul>
        {tvSeries.map((series) => (
          <li key={series.id}>
            {series.name} - {series.genre} ({series.year})
            <button onClick={() => setEditingId(series.id)}>Edit</button>
            <button onClick={() => handleDelete(series.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
