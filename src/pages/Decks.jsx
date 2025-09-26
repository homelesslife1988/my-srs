// Import the same React code from your Decks.jsx but apply Tailwind CSS classes
<div className="p-6 max-w-6xl mx-auto">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-indigo-700">Your Decks</h1>
    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow">
      Logout
    </button>
  </div>

  {/* Add Deck */}
  <div className="flex gap-3 mb-6">
    <input
      type="text"
      placeholder="New deck name"
      value={deckName}
      onChange={(e) => setDeckName(e.target.value)}
      className="flex-1 border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <button onClick={createDeck} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded shadow">
      Add Deck
    </button>
  </div>

  <div className="flex gap-6">
    {/* Deck List */}
    <ul className="w-1/3 bg-white rounded shadow p-4 border border-gray-200">
      {decks.map(deck => (
        <li
          key={deck.id}
          onClick={() => selectDeck(deck)}
          className="p-2 mb-2 rounded cursor-pointer hover:bg-indigo-50 hover:text-indigo-700"
        >
          {deck.name}
        </li>
      ))}
    </ul>

    {/* Card Editor */}
    {selectedDeck && (
      <div className="flex-1 bg-white rounded shadow p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-indigo-700">{selectedDeck.name} - Cards</h2>

        {/* Card Form */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            type="text"
            name="question"
            placeholder="Question"
            value={cardForm.question}
            onChange={handleCardChange}
            className="flex-1 border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="answer"
            placeholder="Answer"
            value={cardForm.answer}
            onChange={handleCardChange}
            className="flex-1 border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addCard}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Add Card
          </button>
        </div>

        {/* Due Only Toggle */}
        <div className="mb-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDueOnly}
              onChange={() => setShowDueOnly(!showDueOnly)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span>Show Due Cards Only</span>
          </label>
        </div>

        {/* Card List */}
        <ul>
          {dueCards.map(card => (
            <li key={card.id} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b py-3">
              <div>
                <p className="font-semibold">{card.question}</p>
                <p className="text-gray-600 text-sm">{card.answer}</p>
                <p className="text-gray-400 text-xs">Due: {new Date(card.due).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button onClick={() => editCard(card)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded">Edit</button>
                <button onClick={() => deleteCard(card.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Delete</button>
                <button onClick={() => reviewCard(card, 'easy')} className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded">Easy</button>
                <button onClick={() => reviewCard(card, 'medium')} className="bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-2 rounded">Medium</button>
                <button onClick={() => reviewCard(card, 'hard')} className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">Hard</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>
