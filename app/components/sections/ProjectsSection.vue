<script setup lang="ts">
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import type { ApiProject } from '~/composables/usePublicApi'

const { fetchProjects } = usePublicApi()
const projects = ref<ApiProject[]>([])

onMounted(async () => {
  try {
    projects.value = await fetchProjects()
  } catch (e) {
    console.error('Failed to fetch projects:', e)
  }
})

// Carousel state
const currentIndex = ref(0)
const perPage = ref(2)
const carouselTrack = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragDelta = ref(0)

const totalPages = computed(() => Math.ceil(projects.value.length / perPage.value))
const currentPage = computed(() => Math.floor(currentIndex.value / perPage.value))

function goToPage(page: number) {
  currentIndex.value = Math.max(0, Math.min(page * perPage.value, projects.value.length - perPage.value))
}

function prev() { goToPage(Math.max(0, currentPage.value - 1)) }
function next() { goToPage(Math.min(totalPages.value - 1, currentPage.value + 1)) }

function onDragStart(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  dragDelta.value = 0
  dragStartX.value = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
}
function onDragMove(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  const x = 'touches' in e ? (e.touches[0]?.clientX ?? dragStartX.value) : e.clientX
  dragDelta.value = x - dragStartX.value
}
function onDragEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragDelta.value < -60) next()
  else if (dragDelta.value > 60) prev()
  dragDelta.value = 0
}

onMounted(() => {
  const update = () => { perPage.value = window.innerWidth < 768 ? 1 : 2 }
  update()
  window.addEventListener('resize', update)
  onUnmounted(() => window.removeEventListener('resize', update))
})

const translateX = computed(() => {
  const base = -(currentIndex.value / perPage.value) * 100
  if (isDragging.value && carouselTrack.value) {
    const pct = (dragDelta.value / carouselTrack.value.offsetWidth) * 100
    return base + pct
  }
  return base
})
</script>

<template>
  <section id="projects" class="py-24 sm:py-32 bg-background">
    <div class="container mx-auto px-8 max-w-5xl">

      <!-- Section heading -->
      <div class="section-divider">
        <h2>Projects</h2>
      </div>

      <p class="text-center text-muted-foreground text-base leading-relaxed max-w-xl mx-auto mb-14">
        A selection of things I've built — from APIs to web apps and IoT systems.
      </p>

      <!-- Carousel wrapper -->
      <div class="relative group/carousel">

        <!-- Prev -->
        <button
          v-if="projects.length > perPage"
          :disabled="currentPage === 0"
          class="carousel-nav carousel-nav-left"
          aria-label="Previous"
          @click="prev"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>

        <!-- Track -->
        <div
          ref="carouselTrack"
          class="overflow-hidden select-none"
          @mousedown="onDragStart"
          @mousemove="onDragMove"
          @mouseup="onDragEnd"
          @mouseleave="onDragEnd"
          @touchstart.passive="onDragStart"
          @touchmove.passive="onDragMove"
          @touchend="onDragEnd"
        >
          <div
            class="flex"
            :class="isDragging ? '' : 'transition-transform duration-500 ease-in-out'"
            :style="{ transform: `translateX(${translateX}%)` }"
          >
            <div
              v-for="project in projects"
              :key="project.id"
              :style="{ width: `${100 / perPage}%`, flexShrink: 0 }"
              class="px-2.5"
            >
              <!-- Card -->
              <div class="minimal-card rounded-2xl overflow-hidden group/card h-full">

                <!-- Image -->
                <div class="aspect-video bg-secondary flex items-center justify-center overflow-hidden relative">
                  <img
                    v-if="project.image"
                    :src="project.image"
                    :alt="project.title"
                    class="w-full h-full object-cover opacity-90 group-hover/card:opacity-100 transition-opacity duration-300"
                    draggable="false"
                  />
                  <span
                    v-else
                    class="text-7xl font-bold font-display text-primary/10 group-hover/card:text-primary/20 transition-colors duration-300 select-none"
                  >
                    {{ project.title.charAt(0) }}
                  </span>
                </div>

                <!-- Info -->
                <div class="p-5 space-y-3">
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

                  <p class="text-xs text-muted-foreground leading-relaxed line-clamp-2">{{ project.description }}</p>

                  <div class="flex flex-wrap gap-1">
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
            </div>
          </div>
        </div>

        <!-- Next -->
        <button
          v-if="projects.length > perPage"
          :disabled="currentPage >= totalPages - 1"
          class="carousel-nav carousel-nav-right"
          aria-label="Next"
          @click="next"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>

      <!-- Dots -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-1.5 mt-8">
        <button
          v-for="page in totalPages"
          :key="page"
          :aria-label="`Go to page ${page}`"
          :class="[
            'rounded-full transition-all duration-300',
            currentPage === page - 1
              ? 'w-6 h-1.5 bg-primary'
              : 'w-1.5 h-1.5 bg-border hover:bg-muted-foreground',
          ]"
          @click="goToPage(page - 1)"
        />
      </div>

      <p v-if="projects.length > 0" class="text-center text-xs text-muted-foreground mt-3">
        {{ currentPage * perPage + 1 }}–{{ Math.min((currentPage + 1) * perPage, projects.length) }}
        of {{ projects.length }} projects
      </p>

    </div>
  </section>
</template>

