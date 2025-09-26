export default function ReviewProgress({ currentIndex, total }) {
  return (
    <p className="text-gray-500 text-sm text-center">
      Card {currentIndex + 1} of {total}
    </p>
  );
}
