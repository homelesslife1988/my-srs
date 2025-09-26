import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Decks from "./pages/Decks";
import Review from "./pages/Review";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decks" element={<Decks />} />
        <Route path="/review/:deckId" element={<Review />} />
      </Routes>
    </Router>
  );
}
