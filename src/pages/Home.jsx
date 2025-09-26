import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Spaced Repetition App</h1>
      <Link to="/my-srs/decks" className="text-blue-500 underline">
        Go to Decks
      </Link>
    </div>
  );
}
