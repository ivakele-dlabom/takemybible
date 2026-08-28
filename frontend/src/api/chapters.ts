export const fetchChapterCount = async (bookId: number): Promise<{ count: number }> => {
  const response = await fetch(`http://localhost:9090/api/kjv/books/${bookId}/chapters/count`);
  if (!response.ok) {
    throw new Error('Failed to fetch chapter count');
  }
  return await response.json();
}
