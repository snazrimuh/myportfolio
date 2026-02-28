<script setup lang="ts">
import {
  FolderOpen,
  Layers,
  Briefcase,
  Mail,
  ArrowRight,
  UserCircle,
} from 'lucide-vue-next'

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
    label: 'Profile',
    value: '—',
    icon: UserCircle,
    to: '/admin/profile',
    description: 'name, bio, links, taglines',
  },
  {
    label: 'Projects',
    value: stats.projects,
    icon: FolderOpen,
    to: '/admin/projects',
    description: 'portfolio projects',
  },
  {
    label: 'Skills',
    value: stats.skills,
    icon: Layers,
    to: '/admin/skills',
    description: `across ${stats.skillCategories} categories`,
  },
  {
    label: 'Experiences',
    value: stats.experiences,
    icon: Briefcase,
    to: '/admin/experiences',
    description: 'work & education',
  },
  {
    label: 'Messages',
    value: stats.messages,
    icon: Mail,
    to: '/admin/contacts',
    description: stats.unread > 0 ? `${stats.unread} unread` : 'all read',
    badge: stats.unread > 0 ? stats.unread : null,
  },
])
</script>

<template>
  <div>
    <!-- Section heading -->
    <div class="section-divider">
      <h2>Dashboard</h2>
    </div>

    <p class="text-center text-muted-foreground text-base leading-relaxed max-w-xl mx-auto mb-14">
      Manage your portfolio content — profile, projects, skills, experiences, and messages.
    </p>

    <!-- Stat cards -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="card in statCards"
        :key="card.label"
        :to="card.to"
        class="group minimal-card rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/40 transition-all duration-200"
      >
        <!-- Icon + label -->
        <div class="flex items-center justify-between">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <component :is="card.icon" class="h-5 w-5 text-primary" />
          </div>
          <ArrowRight class="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-200" />
        </div>

        <!-- Count -->
        <div>
          <p v-if="loading && card.label !== 'Profile'" class="text-3xl font-bold font-display text-foreground/30">—</p>
          <div v-else class="flex items-baseline gap-2">
            <p class="text-3xl font-bold font-display text-foreground">{{ card.value }}</p>
            <span
              v-if="card.badge"
              class="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary"
            >{{ card.badge }} unread</span>
          </div>
          <p class="text-sm font-semibold font-display text-foreground mt-0.5">{{ card.label }}</p>
          <p class="text-xs text-muted-foreground mt-0.5">{{ card.description }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Summary -->
    <div v-if="!loading" class="mt-14 grid grid-cols-3 gap-4">
      <div class="text-center p-4 rounded-xl bg-secondary border border-border">
        <p class="text-2xl font-bold font-display text-primary">
          <EffectsCountUp :target="stats.projects" :duration="1500" />
        </p>
        <p class="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Projects</p>
      </div>
      <div class="text-center p-4 rounded-xl bg-secondary border border-border">
        <p class="text-2xl font-bold font-display text-primary">
          <EffectsCountUp :target="stats.skills" :duration="1500" />
        </p>
        <p class="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Skills</p>
      </div>
      <div class="text-center p-4 rounded-xl bg-secondary border border-border">
        <p class="text-2xl font-bold font-display text-primary">
          <EffectsCountUp :target="stats.experiences" :duration="1500" />
        </p>
        <p class="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Experiences</p>
      </div>
    </div>
  </div>
</template>
