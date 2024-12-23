import { useParams } from "react-router";

export default function SeriesDetails() {
  const params = useParams();
  return <div>{params.name}</div>;
}
