import { useState, type FormEvent } from 'react'

type Movie = {
  id : number 
  title : string
  overview : string
  poster_path : string | null
}

const IMG = 'https://image.tmdb.org/t/p/w500'
const NO_POSTER = 'https://placehold.co/400x600?text=No+Poster'

export default function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function search(e: FormEvent){
    e.preventDefault()
    if(!query.trim()) return

    setLoading(true)
    setError('')
    try{
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
      })
      if(!res.ok) throw new Error(`HTTP ${res.status}`)
      setMovies((await res.json()).results)
    }catch{
      setError('Something went wrong. Please try again')
    }finally{
      setLoading(false)
    }
  }

    return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="mb-6 text-2xl font-bold">Movie Search</h1>

      <form onSubmit={search} className="mb-6 rounded bg-white p-4 shadow-sm">
        <label htmlFor="q" className="mb-1 block text-sm">Search for a movie</label>
        <input
          id="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-2 w-full rounded border border-gray-300 px-3 py-2"
        />
        <button
          disabled={loading}
          className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
      {movies?.length === 0 && <p>No movies found.</p>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {movies?.map((m) => (
          <article key={m.id} className="rounded bg-white p-4 shadow-sm">
            <img
              src={m.poster_path ? IMG + m.poster_path : NO_POSTER}
              alt={m.title}
              className="mb-3 aspect-[2/3] w-full rounded object-cover"
            />
            <h2 className="mb-1 font-bold">{m.title}</h2>
            <p className="line-clamp-4 text-sm text-gray-500">{m.overview}</p>
          </article>
        ))}
      </div>
    </div>
  )
}



