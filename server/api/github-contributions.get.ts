export default defineEventHandler(async (event): Promise<{ total: number; contributions: Array<{ date: string; count: number; color: string; level: 0 | 1 | 2 | 3 | 4 }> }> => {
  const { username, from, to } = getQuery(event) as { username?: string; from?: string; to?: string }

  if (!username || typeof username !== 'string') {
    throw createError({ statusCode: 400, message: 'username query parameter is required' })
  }

  const config = useRuntimeConfig()
  const token = config.githubToken
  if (!token) {
    throw createError({ statusCode: 500, message: 'GitHub token not configured' })
  }

  // Validate and parse dates
  let fromDate: Date
  let toDate: Date

  try {
    fromDate = from ? new Date(from) : (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 1); return d })()
    toDate = to ? new Date(to) : new Date()
  } catch {
    throw createError({ statusCode: 400, message: 'Invalid date format (use YYYY-MM-DD)' })
  }

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw createError({ statusCode: 400, message: 'Invalid date format (use YYYY-MM-DD)' })
  }

  // Format as ISO strings for GraphQL
  const fromISO = fromDate.toISOString().split('T')[0] + 'T00:00:00Z'
  const toISO = toDate.toISOString().split('T')[0] + 'T23:59:59Z'

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `

  const res: any = await $fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: { query, variables: { username, from: fromISO, to: toISO } },
  })

  if (res.errors) {
    throw createError({ statusCode: 502, message: res.errors[0]?.message || 'GitHub API error' })
  }

  const calendar: any = res.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar) {
    throw createError({ statusCode: 404, message: 'User or contributions not found' })
  }

  // Transform to flat contribution array matching the component's expected format
  const contributions = calendar.weeks.flatMap((week: any) =>
    week.contributionDays.map((day: any) => ({
      date: day.date,
      count: day.contributionCount,
      color: day.color,
      level: countToLevel(day.contributionCount),
    }))
  )

  return {
    total: calendar.totalContributions,
    contributions,
  }
})

function countToLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}
