import { Suspense } from 'react'
import Image from 'next/image'

interface PokemonListItem {
  name: string;
  url: string;
}

async function PokemonGrid() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
  if (!res.ok) {
    throw new Error(`PokeAPI request failed with status ${res.status}`)
  }

  const data = await res.json()
  const pokemonList: PokemonListItem[] | undefined = data.results
  if (!pokemonList) {
    throw new Error('PokeAPI returned an invalid Pokémon list')
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
      {pokemonList.map((pokemon, index) => {
        const id = index + 1
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        return (
          <div key={pokemon.name} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-xl hover:opacity-80 transition-shadow cursor-pointer border border-gray-100">
            <span className="text-xs text-gray-400 font-semibold self-end">
              #{String(id).padStart(3, '0')}
            </span>
            <div className="w-24 h-24 relative my-2">
              <Image
                src={imageUrl}
                alt={pokemon.name}
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>
            <h2 className="capitalize font-pokemon font-bold text-gray-700 mt-2">
              {pokemon.name}
            </h2>
          </div>
        )
      })}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-teal-600">
      <h1 className="font-pokemon text-4xl font-extrabold text-center mb-8 text-gray-800">
        Pokedex (Gen 1)
      </h1>

      <Suspense
        fallback={
          <p className="font-pokemon text-center text-gray-900" role="status">
            Loading Pokemon...
          </p>
        }
      >
        <PokemonGrid />
      </Suspense>
    </main>
  )
}