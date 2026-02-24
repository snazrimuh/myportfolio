<script setup lang="ts">
import {
  FolderKanban,
  Cpu,
  Briefcase,
  Mail,
  ArrowRight,
  Activity,
  TrendingUp,
  Terminal,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const api = useApi()
const loading = ref(true)

const stats = reactive({
  projects: 0,
  skills: 0,
  skillCategories: 0,
  experiences: 0,
  messages: 0,
  unread: 0,
})

onMounted(async () => {
  try {
    const [projects, skills, experiences, contacts] = await Promise.all([
      api.get<any[]>('/projects'),
      api.get<any[]>('/skills'),
      api.get<any[]>('/experiences'),
      api.get<any[]>('/contacts'),
    ])
    stats.projects = projects.length
    stats.skillCategories = skills.length
    stats.skills = skills.reduce((sum: number, cat: any) => sum + (cat.skills?.length || 0), 0)
    stats.experiences = experiences.length
    stats.messages = contacts.length
    stats.unread = contacts.filter((m: any) => !m.read).length
  } catch (e) {
    console.error('Failed to fetch stats', e)
  } finally {
    loading.value = false
  }
})

const statCards = computed(() => [
  {
    label: 'Projects',
    value: stats.projects,
    icon: FolderKanban,
    to: '/admin/projects',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30 hover:border-blue-400/60',
    glowColor: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]',
    description: 'portfolio projects',
  },
  {
    label: 'Skills',
    value: stats.skills,
    icon: Cpu,
    to: '/admin/skills',
    gradient: 'from-emerald-500/20 to-green-500/10',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400/60',
    glowColor: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    description: `across ${stats.skillCategories} categories`,
  },
  {
    label: 'Experiences',
    value: stats.experiences,
    icon: Briefcase,
    to: '/admin/experiences',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30 hover:border-amber-400/60',
    glowColor: 'hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    description: 'work & education',
  },
  {
    label: 'Messages',
    value: stats.messages,
    icon: Mail,
    to: '/admin/contacts',
    gradient: 'from-purple-500/20 to-violet-500/10',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30 hover:border-purple-400/60',
    glowColor: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    description: stats.unread > 0 ? `${stats.unread} unread` : 'all read',
  },
])

const quickActions = computed(() => [
  { label: 'Manage Projects', icon: FolderKanban, to: '/admin/projects', color: 'text-blue-400' },
  { label: 'Manage Skills', icon: Cpu, to: '/admin/skills', color: 'text-emerald-400' },
  { label: 'Manage Experiences', icon: Briefcase, to: '/admin/experiences', color: 'text-amber-400' },
  { label: 'View Messages', icon: Mail, to: '/admin/contacts', color: 'text-purple-400' },
])
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-lg border border-primary/20 bg-linear-to-br from-primary/5 via-card to-card p-6 sm:p-8">
      <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div class="relative">
        <div class="flex items-center gap-3 mb-2">
          <Terminal class="h-5 w-5 text-primary" />
          <span class="text-xs font-mono text-muted-foreground tracking-wider uppercase">Admin Panel</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold font-retro text-primary retro-glow mb-2">
          Dashboard
        </h1>
        <p class="text-sm text-muted-foreground max-w-md">
          Manage your portfolio content — projects, skills, experiences, and messages — all from one place.
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        v-for="card in statCards"
        :key="card.label"
        :to="card.to"
        class="group block"
      >
        <Card
          :class="[
            'relative overflow-hidden transition-all duration-300 cursor-pointer h-full',
            card.borderColor,
            card.glowColor,
          ]"
        >
          <div :class="['absolute inset-0 bg-linear-to-br opacity-50', card.gradient]" />
          <CardHeader class="relative flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              {{ card.label }}
            </CardTitle>
            <div :class="['rounded-lg p-2 bg-background/50 ring-1 ring-white/5', card.iconColor]">
              <component :is="card.icon" class="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent class="relative">
            <div class="flex items-baseline gap-2">
              <p v-if="loading" class="text-3xl font-bold text-foreground/30">—</p>
              <p v-else class="text-3xl font-bold font-display tracking-wider">{{ card.value }}</p>
            </div>
            <p class="text-xs text-muted-foreground mt-1.5">{{ card.description }}</p>
            <div class="mt-3 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200" :class="card.iconColor">
              <span>Manage</span>
              <ArrowRight class="h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>

    <!-- Quick Actions -->
    <div>
      <div class="flex items-center gap-2 mb-4">
        <Activity class="h-4 w-4 text-primary" />
        <h2 class="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Quick Actions</h2>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="group"
        >
          <div class="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-card">
            <div class="rounded-md bg-muted p-2">
              <component :is="action.icon" :class="['h-4 w-4', action.color]" />
            </div>
            <span class="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
              {{ action.label }}
            </span>
            <ArrowRight class="h-3.5 w-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Overview Footer -->
    <div class="flex items-center gap-2 rounded-lg border border-border/30 bg-muted/30 px-4 py-3">
      <TrendingUp class="h-4 w-4 text-primary/60" />
      <p class="text-xs text-muted-foreground">
        Your portfolio has
        <span class="font-semibold text-foreground">{{ stats.projects }}</span> projects,
        <span class="font-semibold text-foreground">{{ stats.skills }}</span> skills, and
        <span class="font-semibold text-foreground">{{ stats.experiences }}</span> experiences.
        <template v-if="stats.unread > 0">
          You have <span class="font-semibold text-purple-400">{{ stats.unread }}</span> unread message{{ stats.unread > 1 ? 's' : '' }}.
        </template>
      </p>
    </div>
  </div>
</template>
