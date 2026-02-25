<script setup lang="ts">
import type { ApiExperience } from '~/composables/usePublicApi'

const { fetchExperiences } = usePublicApi()

// All items: education first (order asc), then work (order asc)
const items = ref<(ApiExperience & { _section: string })[]>([])

onMounted(async () => {
  try {
    const all = await fetchExperiences()
    const education = all
      .filter(e => e.type === 'EDUCATION')
      .sort((a, b) => a.order - b.order)
      .map(e => ({ ...e, _section: 'Education' }))
    const work = all
      .filter(e => e.type === 'WORK')
      .sort((a, b) => a.order - b.order)
      .map(e => ({ ...e, _section: 'Professional Experience' }))
    items.value = [...education, ...work]
  } catch (e) {
    console.error('Failed to fetch experiences:', e)
  }
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatRange(start: string, end: string | null) {
  return `${formatDate(start)} – ${end ? formatDate(end) : 'Present'}`
}

// Detect section label change to render a heading before the first item of each group
function showSectionHeader(index: number) {
  if (index === 0) return true
  return items.value[index]._section !== items.value[index - 1]._section
}
</script>

<template>
  <section id="resume" class="py-24 sm:py-32 bg-secondary/30">
    <div class="container mx-auto px-8 max-w-5xl">

      <!-- Heading -->
      <div class="section-divider">
        <h2>Resume</h2>
      </div>

      <p class="text-center text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto mb-16">
        My professional journey — from formal education to hands-on industry experience.
      </p>

      <!-- Flowing 2-column layout using CSS columns -->
      <div class="resume-columns">
        <template v-for="(item, i) in items" :key="item.id">

          <!-- Section header block (breaks into column cleanly) -->
          <div
            v-if="showSectionHeader(i)"
            class="resume-section-header"
          >
            <h3 class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span class="inline-block w-6 h-px bg-primary shrink-0" />
              {{ item._section }}
            </h3>
          </div>

          <!-- Timeline item -->
          <div class="resume-item">
            <!-- dot + line -->
            <div class="resume-line" />
            <span class="resume-dot" />

            <p class="text-[10px] font-semibold uppercase tracking-widest text-primary mb-0.5">
              {{ formatRange(item.startDate, item.endDate) }}
            </p>
            <h4 class="text-sm font-bold text-foreground leading-snug mb-0.5">
              {{ item.title }}
            </h4>
            <p class="text-xs text-muted-foreground italic mb-2">
              {{ item.company }}<span v-if="item.location"> · {{ item.location }}</span>
            </p>
            <p v-if="item.description" class="text-xs text-muted-foreground leading-relaxed">
              {{ item.description }}
            </p>
          </div>

        </template>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* CSS multi-column: items flow naturally across 2 columns */
.resume-columns {
  columns: 1;
  column-gap: 3.5rem;
}
@media (min-width: 768px) {
  .resume-columns {
    columns: 2;
  }
}

/* Section header — never split across columns, always starts fresh */
.resume-section-header {
  break-inside: avoid;
  break-before: auto;
  padding-bottom: 1.75rem;
  padding-top: 0.25rem;
  position: relative;
  padding-left: 1.75rem;
}

/* Line running through header to connect to first item below */
.resume-section-header::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border, #e5e7eb);
}

/* Each timeline item — never split mid-card */
.resume-item {
  position: relative;
  padding-left: 1.75rem;
  padding-bottom: 2rem;
  break-inside: avoid;
}

/* Vertical line running through items — starts from very top so lines connect */
.resume-line {
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border, #e5e7eb);
}

/* Circle dot */
.resume-dot {
  position: absolute;
  left: 0;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: 2px solid var(--primary, #3b82f6);
  background: var(--background, #fff);
  display: block;
}
</style>
