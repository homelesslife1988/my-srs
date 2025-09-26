import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-lg font-bold">My SRS App</div>
      <div className="flex gap-4">
        <Link to="/" className="hover:underline hover:text-indigo-200">Home</Link>
        <Link to="/decks" className="hover:underline hover:text-indigo-200">Decks</Link>
      </div>
    </nav>
  );
}
