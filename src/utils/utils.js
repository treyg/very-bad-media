const typeFixes = {
  movies: 'Movie',
  tvshows: 'TV Show',
  books: 'Book',
  articles: 'Article',
  essays: 'Essay',
  shortstories: 'Short Story'
}

export function fixType(type) {
  return typeFixes[type] || type
}
