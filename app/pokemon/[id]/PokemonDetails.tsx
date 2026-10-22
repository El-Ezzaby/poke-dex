'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    other: {
      'official-artwork': {
        front_default: string | null
      }
    }
  }
  types: {
    type: {
      name: string
    }
  }[]
  stats: {
    base_stat: number
    stat: {
      name: string
    }
  }[]
}

async function fetchPokemon(id: string, signal: AbortSignal): Promise<PokemonDetail> {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response: Response

    try {
      response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(id)}`, {
        signal,
      })
    } catch (error) {
      if (signal.aborted || attempt === maxAttempts) throw error
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
      continue
    }

    if (response.ok) return response.json() as Promise<PokemonDetail>

    const shouldRetry = response.status === 429 || response.status >= 500
    if (!shouldRetry || attempt === maxAttempts) {
      throw new Error(`PokeAPI request failed with status ${response.status}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
  }

  throw new Error('PokeAPI request failed after multiple attempts')
}

export default function PokemonDetails({ id }: { id: string }) {
  const [result, setResult] = useState<{
    requestKey: string
    pokemon?: PokemonDetail
    error?: boolean
  }>({ requestKey: '' })
  const [retryCount, setRetryCount] = useState(0)
  const requestKey = `${id}-${retryCount}`

  useEffect(() => {
    const controller = new AbortController()

    fetchPokemon(id, controller.signal)
      .then((pokemon) => setResult({ requestKey, pokemon }))
      .catch(() => {
        if (!controller.signal.aborted) setResult({ requestKey, error: true })
      })

    return () => controller.abort()
  }, [id, requestKey])

  const isCurrentResult = result.requestKey === requestKey
  const pokemon = isCurrentResult ? result.pokemon : undefined
  const error = isCurrentResult && result.error

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-teal-600 p-8 text-center text-white">
        <p>Could not load Pokémon details. Check your connection and try again.</p>
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
          className="rounded-lg bg-white px-4 py-2 font-semibold text-teal-800"
        >
          Try again
        </button>
        <Link href="/" className="underline">
          Back to Pokédex
        </Link>
      </main>
    )
  }

  if (!pokemon) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-teal-600 p-8 text-center text-white">
        <p role="status">Loading Pokémon details...</p>
      </main>
    )
  }

  const artworkUrl =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default

  return (
    <main className="min-h-screen bg-teal-600 p-8 flex flex-col items-center">
      <div className="mb-6 w-full max-w-2xl">
        <Link href="/" className="inline-block rounded-xl bg-white/90 px-4 py-2 font-pokemon text-xs text-gray-800 shadow-md transition-all hover:bg-white">
          ← Back to Pokedex
        </Link>
      </div>

      <div className="flex w-full max-w-2xl flex-col items-center gap-8 rounded-2xl border border-gray-100 bg-white p-8 md:flex-row">
        <div className="flex flex-col items-center">
          <span className="mb-2 font-pokemon text-sm font-bold text-gray-400">
            #{String(pokemon.id).padStart(3, '0')}
          </span>

          <div className="relative h-48 w-48 rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-inner">
            {artworkUrl && (
              <Image
                src={artworkUrl}
                alt={pokemon.name}
                fill
                sizes="192px"
                className="object-contain"
                priority
                unoptimized
              />
            )}
          </div>

          <h1 className="mt-4 text-center font-pokemon text-xl font-extrabold capitalize text-gray-800">
            {pokemon.name}
          </h1>

          <div className="mt-3 flex gap-2">
            {pokemon.types.map(({ type }) => (
              <span key={type.name} className="rounded-full bg-teal-100 px-3 py-1 font-pokemon text-[10px] font-semibold capitalize text-teal-800">
                {type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full flex-1">
          <h2 className="mb-4 font-pokemon text-xs font-bold tracking-wide text-gray-500">
            Attributes
          </h2>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
              <p className="font-pokemon text-[10px] text-gray-400">Height</p>
              <p className="mt-1 font-pokemon text-xs font-bold text-gray-700">{pokemon.height / 10} m</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
              <p className="font-pokemon text-[10px] text-gray-400">Weight</p>
              <p className="mt-1 font-pokemon text-xs font-bold text-gray-700">{pokemon.weight / 10} kg</p>
            </div>
          </div>

          <h2 className="mb-3 font-pokemon text-xs font-bold tracking-wide text-gray-500">
            Base stats
          </h2>
          <div className="space-y-2">
            {pokemon.stats.map(({ base_stat, stat }) => (
              <div key={stat.name} className="font-pokemon text-xs">
                <div className="mb-1 flex justify-between text-[10px] text-gray-600">
                  <span className="uppercase">{stat.name}</span>
                  <span className="font-bold">{base_stat}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-teal-500 transition-all"
                    style={{ width: `${Math.min(base_stat, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
