import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Decks from "./pages/Decks";
import Review from "./pages/Review";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Decks />} />
        <Route path="/review/:deckId" element={<Review />} />
      </Routes>
    </Router>
  );
}

export default App;
