<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { ApiExperience } from '~/composables/usePublicApi'

const { data: profile } = useProfile()
const { fetchExperiences } = usePublicApi()

const internships = ref<ApiExperience[]>([])
const education = ref<ApiExperience | null>(null)
const certifications = ref<ApiExperience[]>([])

onMounted(async () => {
  try {
    const experiences = await fetchExperiences()
    internships.value = experiences.filter(e => e.type === 'INTERNSHIP')
    education.value = experiences.find(e => e.type === 'EDUCATION') || null
    certifications.value = experiences.filter(e => e.type === 'CERTIFICATION')
  } catch (e) {
    console.error('Failed to fetch experiences:', e)
  }
})

const infoItems = computed(() => {
  const p = profile.value
  if (!p) return []
  return [
    { label: 'City',      value: p.location },
    { label: 'Degree',    value: p.degree },
    { label: 'Email',     value: p.email },
    { label: 'Freelance', value: p.freelanceAvailable ? 'Available' : 'Not available' },
  ].filter(item => item.value)
})
</script>

<template>
  <section id="about" class="py-24 sm:py-32 bg-background">
    <div class="container mx-auto px-8 max-w-5xl">

      <!-- Section heading (centered, with underline divider) -->
      <div class="section-divider">
        <h2>About</h2>
      </div>

      <!-- General bio summary -->
      <p class="text-muted-foreground text-base leading-relaxed text-justify mb-10 whitespace-pre-line">
        {{ profile?.bio }}
      </p>

      <!-- Role sub-sections (dynamic about cards) -->
      <div v-if="profile?.aboutCards?.length" class="grid gap-5 sm:grid-cols-2 mb-10">
        <div
          v-for="(card, i) in profile.aboutCards"
          :key="i"
          class="minimal-card rounded-2xl p-6 space-y-2"
        >
          <h3 class="text-base font-bold font-display text-foreground">{{ card.title }}</h3>
          <p class="text-sm text-muted-foreground leading-relaxed text-justify">
            {{ card.description }}
          </p>
        </div>
      </div>

      <!-- Info & Stats -->
      <div class="space-y-6">
        <!-- Info grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
          <div
            v-for="item in infoItems"
            :key="item.label"
            class="flex items-center gap-2 text-sm"
          >
            <ChevronRight class="h-3.5 w-3.5 text-primary shrink-0" />
            <span class="font-semibold text-foreground min-w-[4rem]">{{ item.label }}:</span>
            <span class="text-muted-foreground">{{ item.value }}</span>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-3 gap-4 pt-2">
          <div class="text-center p-4 rounded-xl bg-secondary border border-border">
            <p class="text-2xl font-bold font-display text-primary">
              <EffectsCountUp :target="internships.length" :duration="2000" suffix="+" />
            </p>
            <p class="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Internships</p>
          </div>
          <div class="text-center p-4 rounded-xl bg-secondary border border-border">
            <p class="text-2xl font-bold font-display text-primary">
              <EffectsCountUp :target="15" :duration="2000" suffix="+" />
            </p>
            <p class="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Projects</p>
          </div>
          <div class="text-center p-4 rounded-xl bg-secondary border border-border">
            <p class="text-2xl font-bold font-display text-primary">
              <EffectsCountUp :target="certifications.length" :duration="2000" />
            </p>
            <p class="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Certs</p>
          </div>
        </div>
      </div>

      <!-- Experience timeline -->
      <div v-if="internships.length" class="mt-14">
        <h3 class="section-eyebrow mb-8">Professional Experience</h3>
        <div class="space-y-6">
          <div
            v-for="exp in internships"
            :key="exp.id"
            class="minimal-card rounded-xl p-5 sm:p-6"
          >
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
              <div>
                <p class="text-sm font-semibold uppercase tracking-wide text-foreground">{{ exp.title }}</p>
                <p class="text-xs text-primary mt-0.5">{{ exp.company }}</p>
              </div>
              <span class="text-xs text-muted-foreground whitespace-nowrap">
                {{ new Date(exp.startDate).getFullYear() }}
                – {{ exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present' }}
              </span>
            </div>
            <p v-if="exp.description" class="text-sm text-muted-foreground leading-relaxed">{{ exp.description }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
