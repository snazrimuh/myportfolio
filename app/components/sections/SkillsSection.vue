<script setup lang="ts">
import { Monitor, Server, Database, Wrench, Cpu, Brain, type LucideIcon } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import type { ApiSkillCategory } from '~/composables/usePublicApi'

const iconMap: Record<string, LucideIcon> = { Monitor, Server, Database, Wrench, Cpu, Brain }

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

function getIcon(name: string) {
  return iconMap[name] || Cpu
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
              <component :is="getIcon(category.icon)" class="h-4 w-4 text-primary" />
            </div>
            <h3 class="text-sm font-semibold text-foreground font-display">{{ category.name }}</h3>
          </div>

          <!-- Skill pills -->
          <div class="flex flex-wrap gap-1.5">
            <Badge
              v-for="skill in category.skills"
              :key="skill.id"
              variant="outline"
              class="text-xs font-normal text-muted-foreground border-border bg-transparent hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all cursor-default"
            >
              {{ skill.name }}
            </Badge>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
