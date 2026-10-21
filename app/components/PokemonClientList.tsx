'use client' // Marks this as a Client Component to enable hooks like useState and browser event listeners

import { useState, useRef } from 'react'
import Image from 'next/image'

// TypeScript interface defining the shape of each Pokémon item from the API
interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonClientListProps {
  initialPokemon: PokemonListItem[];
}

export default function PokemonClientList({ initialPokemon }: PokemonClientListProps) {
  //Snap the text cursor back to the search bar after clicking clear search button
  const inputRef = useRef<HTMLInputElement>(null)

  // State to track what the user types into the search bar
  const [searchQuery, setSearchQuery] = useState('')

  // Filter the full list of Pokémon based on the search query (case-insensitive)
  const filteredPokemon = initialPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Sticky Header & Search Container */}
      <div className="sticky top-0 z-20 bg-teal-600/95 backdrop-blur-md pt-4 pb-4 -mx-8 px-8 shadow-md">
        <h1 className="font-pokemon text-3xl md:text-4xl font-extrabold text-center mb-4 text-white drop-shadow-md">
          Pokédex (Gen 1)
        </h1>

        <div className="relative w-full max-w-md mx-auto">
          <input
            //focuses the text cursor to search bar after clear search click
            ref={inputRef}
            type="text"
            placeholder="SEARCH POKEMON..."
            value={searchQuery}
            // Update state instantly on every keystroke
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-400 font-pokemon text-xs shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-400 transition-all border border-gray-200"
          />

          {/* Quick clear button "X" */}
          {searchQuery && (
            <button onClick={() => {
              setSearchQuery('')
              inputRef.current?.focus()
            }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold font-pokemon text-sm px-1 cursor-pointer"
                    title="clear saerch"
            >
              X
            </button>
          )}
        </div>
      </div>

      {/* Grid Content: Scrolls underneath the sticky header */}
      <div className="mt-8">
        {filteredPokemon.length === 0 ? (
          // Fallback message if no Pokémon matches the search filter
          <p className="text-center font-pokemon text-white text-sm mt-12">
            No Pokémon found!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
            {filteredPokemon.map((pokemon) => {
              // Extract the unique Pokémon ID from its URL (e.g., ".../pokemon/25/")
              const id = Number(pokemon.url.split('/').filter(Boolean).pop())
              // Load the Pokemon image
              const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

              return (
                <div
                  key={pokemon.name}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-xl hover:scale-105 transition-all cursor-pointer border border-gray-100"
                >
                  {/* Formatted Pokédex Number */}
                  <span className="text-xs text-gray-400 font-semibold self-end">
                    #{String(id).padStart(3, '0')}
                  </span>

                  {/* Image component */}
                  <div className="w-24 h-24 relative my-2">
                    <Image
                      src={imageUrl}
                      alt={pokemon.name}
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </div>

                  {/* Pokémon Name */}
                  <h2 className="capitalize font-pokemon font-bold text-gray-700 mt-2 text-xs text-center">
                    {pokemon.name}
                  </h2>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}