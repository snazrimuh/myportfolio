<script setup lang="ts">
interface Contribution {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
  color?: string
}

interface ApiResponse {
  total: number
  contributions: Contribution[]
}

interface Repo {
  name: string
  description: string | null
  url: string
  language: string | null
  stars: number
  forks: number
  updatedAt: string
  total: number
}

const props = defineProps<{ username: string }>()

const now = new Date()

const fromDate = computed(() => {
  const d = new Date(now)
  d.setFullYear(d.getFullYear() - 1)
  return d
})

const toDate = computed(() => now)

const { data, status } = useFetch<ApiResponse>(
  () => {
    const from = fromDate.value.toISOString().split('T')[0]
    const to = toDate.value.toISOString().split('T')[0]
    return `/api/github-contributions?username=${props.username}&from=${from}&to=${to}`
  },
  { watch: [] },
)

const { data: reposData } = useFetch<Repo[]>(
  () => `/api/github-repos?username=${props.username}`,
  { watch: [] },
)

const repos = computed(() => reposData.value ?? [])
const visibleRepos = computed(() => repos.value.slice(0, 3))
const extraRepos = computed(() => (repos.value[0]?.total ?? repos.value.length) - 3)

// GitHub API already returns weeks-aligned data, just group into weeks
const weeks = computed<Contribution[][]>(() => {
  const contributions = data.value?.contributions ?? []
  if (!contributions.length) return []

  const result: Contribution[][] = []
  for (let i = 0; i < contributions.length; i += 7) {
    result.push(contributions.slice(i, i + 7))
  }
  return result
})

// Use the exact total from GitHub's API
const totalContributions = computed(() => data.value?.total ?? 0)

// Month start map: weekIndex → month label (only when month changes)
const monthStartMap = computed(() => {
  const map: Record<number, string> = {}
  let lastMonth = -1
  weeks.value.forEach((week, wi) => {
    const first = week[0]
    if (!first) return
    const d = new Date(first.date)
    const m = d.getMonth()
    if (m !== lastMonth) {
      map[wi] = d.toLocaleString('en', { month: 'short' })
      lastMonth = m
    }
  })
  return map
})

const levelClass: Record<number, string> = {
  0: 'bg-muted/50',
  1: 'bg-primary/30',
  2: 'bg-primary/50',
  3: 'bg-primary/75',
  4: 'bg-primary',
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Vue: '#41b883',
  Kotlin: '#A97BFF',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Dart: '#00B4AB',
  'C#': '#178600',
  'C++': '#f34b7d',
  Shell: '#89e051',
}

const langColor = (lang: string | null) =>
  lang ? (languageColors[lang] ?? '#8b949e') : '#8b949e'

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  if (d < 30) return `${d}d ago`
  const m = Math.floor(d / 30)
  if (m < 12) return `${m}mo ago`
  return `${Math.floor(m / 12)}y ago`
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Header row -->
    <div class="flex items-center justify-between">
      <p class="text-xs text-muted-foreground">
        <span class="font-semibold text-foreground">{{ totalContributions.toLocaleString() }}</span>
        contributions in last 12 months
      </p>
      <a
        :href="`https://github.com/${username}`"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors duration-150"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        View Profile
      </a>
    </div>

    <!-- Two-column layout -->
    <div class="flex gap-0 items-stretch">

      <!-- Left: Heatmap -->
      <div class="flex-1 min-w-0 overflow-hidden flex flex-col justify-between pr-4">
        <!-- Loading skeleton -->
        <div v-if="status === 'pending'" class="h-20 rounded-lg bg-muted/40 animate-pulse" />

        <!-- Error -->
        <div v-else-if="status === 'error'" class="text-xs text-muted-foreground">
          Could not load contribution data.
        </div>

        <!-- Graph -->
        <div v-else-if="weeks.length" class="flex flex-col gap-0 w-full">
          <!-- Month labels row -->
          <div class="flex mb-[3px]" style="padding-left: 22px">
            <div
              v-for="(week, wi) in weeks"
              :key="wi"
              class="flex-1 overflow-visible relative h-[11px] min-w-0"
            >
              <span
                v-if="monthStartMap[wi]"
                class="absolute left-0 top-0 text-[9px] text-muted-foreground whitespace-nowrap leading-none"
              >{{ monthStartMap[wi] }}</span>
            </div>
          </div>

          <!-- Day labels + grid -->
          <div class="flex w-full">
            <div class="flex flex-col gap-[2px] w-5 shrink-0 mr-0.5">
              <div
                v-for="(label, i) in DAY_LABELS"
                :key="i"
                class="h-[10px] text-[8px] text-muted-foreground leading-none flex items-center justify-end pr-1"
              >{{ label }}</div>
            </div>
            <div class="flex flex-1 min-w-0 gap-[2px]">
              <div
                v-for="(week, wi) in weeks"
                :key="wi"
                class="flex flex-col gap-[2px] flex-1 min-w-0"
              >
                <div
                  v-for="day in week"
                  :key="day.date"
                  :title="`${day.date} — ${day.count} contribution${day.count !== 1 ? 's' : ''}`"
                  class="w-full h-[10px] rounded-[2px] transition-opacity duration-100 cursor-default hover:opacity-80 hover:ring-1 hover:ring-primary/50"
                  :class="levelClass[day.level]"
                />
              </div>
            </div>
          </div>

          <!-- Legend below heatmap -->
          <div class="flex items-center gap-1 mt-1.5">
            <span class="text-[9px] text-muted-foreground mr-0.5">Less</span>
            <div v-for="lvl in [0,1,2,3,4]" :key="lvl" class="w-[9px] h-[9px] rounded-[2px]" :class="levelClass[lvl]" />
            <span class="text-[9px] text-muted-foreground ml-0.5">More</span>
          </div>
        </div>

        <div v-else class="text-xs text-muted-foreground">No contributions found.</div>
      </div>

      <!-- Divider -->
      <div class="w-px bg-border/60 self-stretch shrink-0" />

      <!-- Right: Recent Repos -->
      <div class="w-40 shrink-0 flex flex-col justify-between pl-4">
        <div class="flex flex-col gap-1">
          <p class="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Recent Repos</p>

          <!-- Skeletons -->
          <template v-if="!repos.length">
            <div v-for="i in 3" :key="i" class="h-9 rounded-md bg-muted/40 animate-pulse" />
          </template>

          <!-- Repo list -->
          <a
            v-for="repo in visibleRepos"
            :key="repo.name"
            :href="repo.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex flex-col gap-[2px] rounded-md px-2 py-1.5 hover:bg-muted/30 transition-colors duration-150"
          >
            <span class="text-[10px] font-medium text-foreground truncate group-hover:text-primary transition-colors leading-tight">{{ repo.name }}</span>
            <div class="flex items-center gap-1.5">
              <span v-if="repo.language" class="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: langColor(repo.language) }" />
                {{ repo.language }}
              </span>
              <span class="text-[9px] text-muted-foreground ml-auto shrink-0">{{ timeAgo(repo.updatedAt) }}</span>
            </div>
          </a>
        </div>

        <!-- +N more -->
        <a
          v-if="extraRepos > 0"
          :href="`https://github.com/${username}?tab=repositories`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-[9px] text-muted-foreground hover:text-primary transition-colors text-left pl-2 pt-1"
        >+ {{ extraRepos }} more</a>
      </div>

    </div>
  </div>
</template>

