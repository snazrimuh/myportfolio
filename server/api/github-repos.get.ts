interface GithubRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  fork: boolean
}

export default defineEventHandler(async (event): Promise<Array<{
  name: string
  description: string | null
  url: string
  language: string | null
  stars: number
  forks: number
  updatedAt: string
  total: number
}>> => {
  const { username } = getQuery(event) as { username?: string }

  if (!username || typeof username !== 'string') {
    throw createError({ statusCode: 400, message: 'username query parameter is required' })
  }

  const config = useRuntimeConfig()
  const token = config.githubToken

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const repos = await $fetch<GithubRepo[]>(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=20&type=owner`,
    { headers }
  )

  const filtered = repos.filter(r => !r.fork)

  return filtered
    .slice(0, 8)
    .map(r => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at,
      total: filtered.length,
    }))
})
