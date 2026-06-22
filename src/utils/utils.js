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

const typeColors = {
  movies: 'purple',
  tvshows: 'blue',
  books: 'green',
  shortstories: 'teal',
  articles: 'orange',
  essays: 'pink'
}

export function typeColor(type) {
  return typeColors[type] || 'gray'
}
