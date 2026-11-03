export const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;
export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
};
export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
};
// Design-preview content only. Live catalogue data always comes from the API.
export const previewBooks: Book[] = [
  ["The Quiet Hour", "Mila Hart", "Fiction", "quiet-hour"],
  ["Under the Sun", "Noah Rivers", "Fiction", "under-the-sun"],
  ["The Last Garden", "Ellis Moore", "Science", "last-garden"],
  ["Slow Mornings", "Amelie Ward", "Others", "slow-mornings"],
  ["The Art of Almost", "Julian Park", "Fiction", "art-of-almost"],
  ["Wild Places", "Leo Bennett", "History", "wild-places"],
].map(([title, author, category, slug], index) => ({
  _id: `preview-${slug}`,
  title,
  author,
  category,
  image: `/covers/${slug}.svg`,
  description: "A featured title from the BookNook design collection.",
  totalCopies: 3,
  availableCopies: 3,
  ownerName: "BookNook",
  ownerEmail: "",
  createdAt: new Date(Date.UTC(2026, 0, 6 - index)).toISOString(),
}));
