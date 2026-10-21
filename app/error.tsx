'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-800">
        Could not load the Pokédex
      </h1>
      <p className="max-w-md text-gray-600">
        The Pokémon data service could not be reached. Check your connection and
        try again.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  )
}
