import Image from 'next/image'
import Link from 'next/link'
import { fetchWithRetry } from '../../lib/api-error'

//interface defining the shape of the pokemon details
interface PokeomonDetail {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string
    other: {
      'official-artwork': {
        front_default: string
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

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params

  //call the fetcher
  const pokemon = await fetchWithRetry<PokeomonDetail>(
    `https://pokeapi.co/api/v2/pokemon/${id}`
  )

  //Call standard sprite if official art is missing
  const artworkUrl =
    pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default

  return (
    <main className="min-h-screen p-8 bg-teal-600 flex flex-col items-center">
      {/* Back button container */}
      <div className="w-full max-w-2xl mb-6">
        <Link href="/" className="inline-block font-pokemon text-xs bg-white/90 text-gray-800 px-4 py-2 rounded-xl shadow-md hover:bg-white transition-all">
          ← Back to Pokedex
        </Link>
      </div>

      {/* Detailed card container */}
      <div className="w-full max-w-2xl bg-white rounded-2xl p-8 border border-gray-100 flex flex-col md:flex-row items-center gap-8">
        {/* Left column: Image, ID, Name & type */}
        <div className="flex flex-col items-center">
          <span className="font-pokemon text-sm text-gray-400 font-bold mb-2">
            #{String(pokemon.id).padStart(3, '0')}
          </span>

          <div className="w-48 h-48 bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner relative">
            <Image
              src={artworkUrl}
              alt={pokemon.name}
              fill
              sizes="192px"
              className="object-contain"
              priority
            />
          </div>

          <h1 className="capitalize font-pokemon text-xl font-extrabold text-gray-800 mt-4 text-center">
            {pokemon.name}
          </h1>

          {/* Type badges */}
          <div className="flex gap-2 mt-3">
            {pokemon.types.map((t) => (
              <span key="t.type.name" className="capitalize font-pokemon text-[10px] bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-semibold">
                {t.type.name}
              </span>
            ))}
          </div>
        </div>

        {/* Right column: Physical Attributes & Stats */}
        <div className="flex-1 w-full">
          <h2 className="font-pokemon text-xs text-gray-500 mb-4 font-bold tracking-wide">
            Attributes
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
              <p className="text-[10px] font-pokemon text-gray-400">Height</p>
              <p className="font-pokemon text-xs font-bold text-gray-700 mt-1">{pokemon.height / 10} m</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
              <p className="text-[10px] font-pokemon text-gray-400">Weight</p>
              <p className="font-pokemon text-xs font-bold text-gray-700 mt-1">{pokemon.weight / 10} kg</p>
            </div>
          </div>

          <h2 className="font-pokemon text-xs text-gray-500 mb-3 font-bold tracking-wide">
            Base stats
          </h2>
          <div className="space-y-2">
            {pokemon.stats.map((s) => (
              <div key={s.stat.name} className="text-xs font-pokemon">
                <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                  <span className="uppercase">{s.stat.name}</span>
                  <span className="font-bold">{s.base_stat}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(s.base_stat, 100)}%` }}
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