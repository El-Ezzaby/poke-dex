import { Suspense } from 'react'
import PokemonClientList from './components/PokemonClientList'
import { fetchWithRetry } from './lib/api-error'

interface PokemonListItem {
  name: string;
  url: string;
}

/*
  Fetches the first 151 Pokémon on the server using the shared retry and cache
  behavior, then validates the list before passing it to the client grid.
 */
async function fetchPokemonList() {
  const url = 'https://pokeapi.co/api/v2/pokemon?limit=151'
  const data = await fetchWithRetry<{ results?: PokemonListItem[] }>(url)
  if (!data.results) throw new Error('PokeAPI returned an invalid Pokémon list')
  return data.results
}

/*
  Main Home.
  Fetches the data on the server and passes it to the client list.
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