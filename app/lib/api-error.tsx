/*
  Shared server side PokeAPI fetcher.
  Retries network failures, and server errors up to three attempts;
  successful responses are cached by Next.js for one hour.
 */
export async function fetchWithRetry<T>(url: string): Promise<T> {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response: Response

    try {
      response = await fetch(url, { next: { revalidate: 3600 } })
    } catch (error) {
      if (attempt === maxAttempts) throw error

      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
      continue
    }

    if (response.ok) {
      return response.json() as Promise<T>
    }

    const shouldRetry = response.status === 429 || response.status >= 500
    if (!shouldRetry || attempt === maxAttempts) {
      throw new Error(`PokeAPI request failed with status ${response.status}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
  }

  throw new Error('PokeAPI request failed after multiple attempts')
}
