import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Review() {
  const { deckId } = useParams();
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchCards = async () => {
    const q = query(
      collection(db, "cards"),
      where("deckId", "==", deckId)
    );
    const snapshot = await getDocs(q);
    setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAnswer = async (quality) => {
    const card = cards[current];
    let interval = card.interval || 1;
    let ease = card.ease || 2.5;

    if (quality === "hard") interval = 1;
    else interval = Math.round(interval * ease);

    const due = new Date();
    due.setDate(due.getDate() + interval);

    await updateDoc(doc(db, "cards", card.id), { interval, due: due.toISOString() });

    setShowAnswer(false);
    setCurrent(current + 1);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  if (!cards.length) return <p className="p-4">No cards to review!</p>;
  if (current >= cards.length) return <p className="p-4">Review complete!</p>;

  const card = cards[current];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Review Card {current + 1}/{cards.length}</h2>
      <div className="border p-4 mb-4">
        <p className="text-lg">{card.question}</p>
        {showAnswer && <p className="mt-2 text-green-600">{card.answer}</p>}
      </div>
      {!showAnswer && (
        <button onClick={() => setShowAnswer(true)} className="bg-blue-500 text-white p-2">
          Show Answer
        </button>
      )}
      {showAnswer && (
        <div className="flex gap-2 mt-2">
          <button onClick={() => handleAnswer("easy")} className="bg-green-500 text-white p-2">Easy</button>
          <button onClick={() => handleAnswer("medium")} className="bg-yellow-500 text-white p-2">Medium</button>
          <button onClick={() => handleAnswer("hard")} className="bg-red-500 text-white p-2">Hard</button>
        </div>
      )}
    </div>
  );
}
