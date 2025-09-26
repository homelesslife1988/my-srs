import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Decks from "./pages/Decks";
import Review from "./pages/Review";
import Navbar from "./components/Navbar";

// Add your GitHub Pages repo name as basename
const repoName = "/my-srs";

export default function App() {
  return (
    <Router basename={repoName}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/decks" element={<Decks />} />
        <Route path="/review/:deckId" element={<Review />} />
      </Routes>
    </Router>
  );
}
