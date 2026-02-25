<script setup lang="ts">
import { Github, ExternalLink } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import type { ApiProject, ProjectCategory } from '~/composables/usePublicApi'

const { fetchProjects } = usePublicApi()
const allProjects = ref<ApiProject[]>([])
const activeFilter = ref<ProjectCategory | 'ALL'>('ALL')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const data = await fetchProjects()
    allProjects.value = data.map(p => ({
      ...p,
      tech: Array.isArray(p.tech)
        ? p.tech
        : (typeof p.tech === 'string' ? JSON.parse(p.tech) : []),
    }))
  } catch (e) {
    console.error('Failed to fetch projects:', e)
  } finally {
    loading.value = false
  }
})

const filtered = computed(() =>
  activeFilter.value === 'ALL'
    ? allProjects.value
    : allProjects.value.filter(p => p.category === activeFilter.value)
)

const filters: { label: string; value: ProjectCategory | 'ALL' }[] = [
  { label: 'All',       value: 'ALL' },
  { label: 'Backend',   value: 'BACKEND' },
  { label: 'Fullstack', value: 'FULLSTACK' },
  { label: 'Mobile',    value: 'MOBILE' },
  { label: 'ML / DL',   value: 'ML_DL' },
]

const categoryLabel: Record<ProjectCategory, string> = {
  BACKEND:   'Backend',
  FULLSTACK: 'Fullstack',
  MOBILE:    'Mobile',
  ML_DL:     'ML / DL',
}

const categoryColor: Record<ProjectCategory, string> = {
  BACKEND:   'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  FULLSTACK: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  MOBILE:    'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  ML_DL:     'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}
</script>

<template>
  <section id="projects" class="py-24 sm:py-32 bg-background">
    <div class="container mx-auto px-8 max-w-5xl">

      <!-- Section heading -->
      <div class="section-divider">
        <h2>Projects</h2>
      </div>

      <p class="text-center text-muted-foreground text-base leading-relaxed max-w-xl mx-auto mb-10">
        A selection of things I've built  from APIs to web apps and mobile applications.
      </p>

      <!-- Filter tabs -->
      <div class="flex flex-wrap items-center justify-center gap-2 mb-10">
        <button
          v-for="f in filters"
          :key="f.value"
          :class="[
            'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
            activeFilter === f.value
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-background text-foreground border-border hover:border-primary/50 hover:text-primary',
          ]"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Projects grid -->
      <Transition name="fade" mode="out-in">
        <div
          :key="activeFilter"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <!-- Loading skeleton -->
          <template v-if="loading">
            <div
              v-for="n in 6"
              :key="'skel-' + n"
              class="minimal-card rounded-2xl overflow-hidden animate-pulse"
            >
              <div class="aspect-video bg-secondary" />
              <div class="p-5 space-y-3">
                <div class="h-3 bg-secondary rounded w-3/4" />
                <div class="h-2 bg-secondary rounded w-full" />
                <div class="h-2 bg-secondary rounded w-5/6" />
              </div>
            </div>
          </template>

          <template v-if="!loading">
            <div
              v-for="project in filtered"
              :key="project.id"
              class="minimal-card rounded-2xl overflow-hidden group/card flex flex-col"
            >
            <!-- Image -->
            <div class="aspect-video bg-secondary flex items-center justify-center overflow-hidden relative flex-shrink-0">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover opacity-90 group-hover/card:opacity-100 transition-opacity duration-300"
              />
              <span
                v-else
                class="text-7xl font-bold font-display text-primary/10 group-hover/card:text-primary/20 transition-colors duration-300 select-none"
              >
                {{ project.title.charAt(0) }}
              </span>

              <!-- Category badge overlay -->
              <span
                :class="['absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full', categoryColor[project.category]]"
              >
                {{ categoryLabel[project.category] }}
              </span>
            </div>

            <!-- Info -->
            <div class="p-5 space-y-3 flex flex-col flex-1">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-sm font-semibold text-foreground font-display leading-snug">{{ project.title }}</h3>
                <div class="flex items-center gap-1 shrink-0">
                  <a
                    v-if="project.github"
                    :href="project.github"
                    target="_blank"
                    rel="noopener"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Github class="h-3.5 w-3.5" />
                  </a>
                  <a
                    v-if="project.liveUrl"
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noopener"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <ExternalLink class="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <p class="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">{{ project.description }}</p>

              <div class="flex flex-wrap gap-1 mt-auto">
                <Badge
                  v-for="tech in project.tech"
                  :key="tech"
                  variant="secondary"
                  class="text-[10px] px-2 py-0.5 bg-primary/8 text-primary border-0 font-normal hover:bg-primary/15 transition-colors cursor-default"
                >
                  {{ tech }}
                </Badge>
              </div>
            </div>
          </div>
          </template>

          <!-- Empty state -->
          <div
            v-if="!loading && filtered.length === 0"
            class="col-span-full text-center py-16 text-muted-foreground text-sm"
          >
            No projects in this category yet.
          </div>
        </div>
      </Transition>

      <!-- Count -->
      <p v-if="!loading && allProjects.length > 0" class="text-center text-xs text-muted-foreground mt-8">
        Showing {{ filtered.length }} of {{ allProjects.length }} projects
      </p>

    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
