import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Decks from "./pages/Decks";
import Review from "./pages/Review";

export default function App() {
  return (
    <Router basename="/my-srs"> {/* Important for GitHub Pages */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decks" element={<Decks />} />
        <Route path="/review/:deckId" element={<Review />} />
      </Routes>
    </Router>
  );
}
