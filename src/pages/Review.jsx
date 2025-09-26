import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  const handleNextCard = () => setCurrentIndex(prev => prev + 1);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Review</h1>
        <p className="text-gray-600 mb-4">Please log in from the <Link to="/" className="text-indigo-500 underline">Decks page</Link> to review cards.</p>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">Review</h1>
        <p className="text-gray-600">No due cards for this deck!</p>
        <Link to="/" className="mt-4 text-indigo-500 underline">Go Back to Decks</Link>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-indigo-700 text-center">Review Deck</h1>

        <ReviewProgress currentIndex={currentIndex} total={cards.length} />

        {currentCard ? (
          <ReviewCard card={currentCard} user={user} onReviewed={handleNextCard} />
        ) : (
          <div className="text-center text-gray-600 py-6">
            🎉 You have completed all due cards!
            <div className="mt-4">
              <Link to="/" className="text-indigo-500 underline">Back to Decks</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
