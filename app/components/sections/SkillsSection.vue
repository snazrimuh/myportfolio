<script setup lang="ts">
import { Monitor, Server, Database, Wrench, Cpu, Brain, Code, GitBranch, Boxes, Cloud, type LucideIcon } from 'lucide-vue-next'
import type { ApiSkillCategory } from '~/composables/usePublicApi'

const categoryIconMap: Record<string, LucideIcon> = { Monitor, Server, Database, Wrench, Cpu, Brain }

// Tech icon mapping - using lucide icons where available
const techIconMap: Record<string, LucideIcon> = {
  // Languages
  TypeScript: Code,
  JavaScript: Code,
  Python: Code,
  Java: Code,
  Go: Code,
  Rust: Code,
  PHP: Code,
  // Frontend
  React: Boxes,
  Vue: Boxes,
  'Vue.js': Boxes,
  Angular: Boxes,
  Svelte: Boxes,
  'Next.js': Boxes,
  'Nuxt': Boxes,
  'Nuxt.js': Boxes,
  // Backend
  'Node.js': Server,
  Express: Server,
  NestJS: Server,
  Django: Server,
  Flask: Server,
  Laravel: Server,
  // Database
  PostgreSQL: Database,
  MySQL: Database,
  MongoDB: Database,
  Redis: Database,
  Firebase: Database,
  // DevOps
  Docker: Cloud,
  Kubernetes: Cloud,
  AWS: Cloud,
  GCP: Cloud,
  'Google Cloud': Cloud,
  // Tools
  Git: GitBranch,
  GitHub: GitBranch,
  GitLab: GitBranch,
  // Styling
  'Tailwind CSS': Boxes,
  Tailwind: Boxes,
  'Bootstrap': Boxes,
  'Sass': Boxes,
  // Other
  GraphQL: Boxes,
  REST: Boxes,
  'REST API': Boxes,
  Jest: Code,
  'Unit Testing': Code,
}

const { data: profile } = useProfile()
const { fetchSkills } = usePublicApi()
const skillCategories = ref<ApiSkillCategory[]>([])

onMounted(async () => {
  try {
    skillCategories.value = await fetchSkills()
  } catch (e) {
    console.error('Failed to fetch skills:', e)
  }
})

function getCategoryIcon(name: string) {
  return categoryIconMap[name] || Cpu
}

function getSkillIcon(skillName: string, skillIcon?: string): LucideIcon | null {
  const iconName = skillIcon || skillName
  return techIconMap[iconName] || null
}
</script>

<template>
  <section id="skills" class="py-24 sm:py-32 bg-secondary/30">
    <div class="container mx-auto px-8 max-w-5xl">

      <!-- Section heading -->
      <div class="section-divider">
        <h2>Skills</h2>
      </div>

      <p class="text-center text-muted-foreground text-base leading-relaxed max-w-xl mx-auto mb-14">
        {{ profile?.skillsTagline || 'Technologies and tools I use to build products from scratch.' }}
      </p>

      <!-- Categories grid -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="category in skillCategories"
          :key="category.name"
          class="minimal-card rounded-2xl p-6 space-y-4"
        >
          <!-- Category header -->
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <component :is="getCategoryIcon(category.icon)" class="h-4 w-4 text-primary" />
            </div>
            <h3 class="text-sm font-semibold text-foreground font-display">{{ category.name }}</h3>
          </div>

          <!-- Skill pills -->
          <div class="flex flex-wrap gap-2">
            <div
              v-for="skill in category.skills"
              :key="skill.id"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-transparent text-xs font-normal text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all cursor-default group"
            >
              <component
                v-if="getSkillIcon(skill.name, skill.icon)"
                :is="getSkillIcon(skill.name, skill.icon)"
                class="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span>{{ skill.name }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
