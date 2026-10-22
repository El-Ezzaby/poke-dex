import { Suspense } from 'react'
import PokemonDetails from './PokemonDetails'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PokemonDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading Pokémon details...</p>}>
      <PokemonPageContent params={params} />
    </Suspense>
  )
}

async function PokemonPageContent({ params }: PageProps) {
  const { id } = await params
  return <PokemonDetails id={id} />
}
