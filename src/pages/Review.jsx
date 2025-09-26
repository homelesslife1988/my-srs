import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../firebase";
import ReviewCard from "../components/ReviewCard";
import ReviewProgress from "../components/ReviewProgress";
import { getDueCards } from "../utils/firebaseHelpers";

export default function Review() {
  const { deckId } = useParams();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (currentUser && deckId) fetchCards(currentUser.uid);
    });
    return unsubscribe;
  }, [deckId]);

  const fetchCards = async (uid) => {
    const dueCards = await getDueCards(uid, deckId);
    setCards(dueCards);
    setCurrentIndex(0);
  };

  const handleNextCard = () => {
    setCurrentIndex(prev => prev + 1);
  };

  if (!user) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">Review</h1>
        <p>Please log in from the Decks page to review cards.</p>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">Review</h1>
        <p>No due cards for this deck!</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow border border-gray-200">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Review Deck</h1>

      <ReviewCard card={currentCard} user={user} onReviewed={handleNextCard} />
      <ReviewProgress currentIndex={currentIndex} total={cards.length} />
    </div>
  );
}
