import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";

export default function Review() {
  const { deckId } = useParams();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  /** --- Auth --- **/
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchDueCards(currentUser.uid);
    });
    return unsubscribe;
  }, [deckId]);

  /** --- Fetch due cards for this deck --- **/
  const fetchDueCards = async (uid) => {
    const q = query(
      collection(db, `users/${uid}/cards`),
      where("deckId", "==", deckId)
    );
    const snapshot = await getDocs(q);
    const allCards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const dueCards = allCards.filter((card) => new Date(card.due) <= new Date());
    setCards(dueCards);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  /** --- SRS Review Logic --- **/
  const reviewCard = async (card, quality) => {
    if (!user) return;
    let interval = card.interval || 1;
    let ease = card.ease || 2.5;

    if (quality === "hard") interval = 1;
    else if (quality === "medium") interval = interval;
    else if (quality === "easy") interval = Math.round(interval * ease);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);

    await updateDoc(doc(db, `users/${user.uid}/cards`, card.id), {
      interval,
      due: dueDate.toISOString(),
    });

    // Move to next card
    const nextIndex = currentIndex + 1;
    if (nextIndex < cards.length) {
      setCurrentIndex(nextIndex);
      setShowAnswer(false);
    } else {
      setCards([]); // finished
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Review</h1>
        <p>Please log in from the Decks page to review cards.</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Review</h1>
        <p>No due cards for this deck!</p>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Review Deck</h1>

      <div className="border p-6 mb-4">
        <p className="text-lg font-bold mb-2">Question:</p>
        <p className="mb-4">{card.question}</p>

        {showAnswer && (
          <>
            <p className="text-lg font-bold mb-2">Answer:</p>
            <p className="mb-4">{card.answer}</p>
          </>
        )}

        <div className="flex gap-2">
          {!showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              className="bg-blue-500 text-white p-2"
            >
              Show Answer
            </button>
          )}

          {showAnswer && (
            <>
              <button
                onClick={() => reviewCard(card, "easy")}
                className="bg-green-500 text-white p-2"
              >
                Easy
              </button>
              <button
                onClick={() => reviewCard(card, "medium")}
                className="bg-yellow-600 text-white p-2"
              >
                Medium
              </button>
              <button
                onClick={() => reviewCard(card, "hard")}
                className="bg-red-500 text-white p-2"
              >
                Hard
              </button>
            </>
          )}
        </div>
      </div>

      <p>
        Card {currentIndex + 1} of {cards.length}
      </p>
    </div>
  );
}
