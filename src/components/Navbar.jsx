import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-blue-500 text-white flex gap-4">
      <Link to="/my-srs/">Home</Link>
      <Link to="/my-srs/decks">Decks</Link>
    </nav>
  );
}
