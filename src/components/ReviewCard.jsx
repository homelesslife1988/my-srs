import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ReviewCard({ card, user, onReviewed }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const reviewCard = async (quality) => {
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

    onReviewed(); // move to next card
  };

  return (
    <div className="border rounded p-6 mb-4 shadow-sm bg-gray-50">
      <p className="text-lg font-semibold mb-2">Question:</p>
      <p className="mb-4 text-gray-800">{card.question}</p>

      {showAnswer && (
        <>
          <p className="text-lg font-semibold mb-2">Answer:</p>
          <p className="mb-4 text-gray-700">{card.answer}</p>
        </>
      )}

      <div className="flex gap-3">
        {!showAnswer && (
          <button
            onClick={() => setShowAnswer(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Show Answer
          </button>
        )}
        {showAnswer && (
          <>
            <button
              onClick={() => reviewCard("easy")}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
            >
              Easy
            </button>
            <button
              onClick={() => reviewCard("medium")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded shadow"
            >
              Medium
            </button>
            <button
              onClick={() => reviewCard("hard")}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow"
            >
              Hard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
