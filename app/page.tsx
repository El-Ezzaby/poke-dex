import { Suspense } from 'react'
import PokemonClientList from './components/PokemonClientList'

interface PokemonListItem {
  name: string;
  url: string;
}

/*
  Server side data fetcher with retry logic.
  Handles network failures.
 */
async function fetchPokemonList() {
  const url = 'https://pokeapi.co/api/v2/pokemon?limit=151'
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response: Response

    try {
      // Fetch data on the server (revalidate every hour)
      response = await fetch(url, { next: { revalidate: 3600 } })
    } catch (error) {
      if (attempt === maxAttempts) throw error

      // Delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
      continue
    }

    if (response.ok) {
      const data = await response.json()
      const pokemonList: PokemonListItem[] | undefined = data.results
      if (!pokemonList) throw new Error('PokeAPI returned an invalid Pokémon list')
      return pokemonList
    }

    // Only retry on rate limits or server errors
    const shouldRetry = response.status === 429 || response.status >= 500
    if (!shouldRetry || attempt === maxAttempts) {
      throw new Error(`PokeAPI request failed with status ${response.status}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
  }

  throw new Error('PokeAPI request failed after multiple attempts')
}

/*
  Main Home.
  Fetches the dataon the server and passes it to the client list.
*/
export default async function Home() {
  const pokemonList = await fetchPokemonList()

  return (
    <main className="min-h-screen p-8 bg-teal-600">
      {/* Suspense boundary catches loading states */}
      <Suspense
        fallback={
          <div>
            <h1 className="font-pokemon text-3xl md:text-4xl font-extrabold text-center mb-4 text-white drop-shadow-md">
              Pokédex (Gen 1)
            </h1>
            <p className="font-pokemon text-center text-white" role="status">
              Loading Pokémon...
            </p>
          </div>
        }
      >
        <PokemonClientList initialPokemon={pokemonList} />
      </Suspense>
    </main>
  )
}