<div className="p-6 max-w-3xl mx-auto bg-white rounded shadow border border-gray-200">
  <h1 className="text-2xl font-bold text-indigo-700 mb-4">Review Deck</h1>

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
          <button onClick={() => reviewCard(card, 'easy')} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow">Easy</button>
          <button onClick={() => reviewCard(card, 'medium')} className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded shadow">Medium</button>
          <button onClick={() => reviewCard(card, 'hard')} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow">Hard</button>
        </>
      )}
    </div>
  </div>

  <p className="text-gray-500 text-sm">Card {currentIndex + 1} of {cards.length}</p>
</div>
